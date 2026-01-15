import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Student, AppSettings } from './types';
import { v4 as uuidv4 } from 'uuid';

interface AppState {
    students: Student[];
    settings: AppSettings;

    // Actions
    setStudents: (students: Student[]) => void;
    setSettings: (settings: Partial<AppSettings>) => void;
    calculateRanks: () => void;
    saveToRemote: () => Promise<void>;
    loadFromRemote: () => Promise<void>;
    currentMode: "INTRO" | "TOP3" | "RANK_4_7" | "RANK_8_10";
    setMode: (mode: "INTRO" | "TOP3" | "RANK_4_7" | "RANK_8_10") => void;
}

const DEFAULT_SETTINGS: AppSettings = {
    slideDuration: 10,
    tieBreaker: "shared",
    titleTop: "ШАХОВИЙ РЕЙТИНГ УЧНІВ",
    titleBottom: "АВТОРСЬКОЇ ШКОЛИ БОЙКА",
};

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            students: [],
            settings: DEFAULT_SETTINGS,
            currentMode: "INTRO",

            setMode: (mode) => set({ currentMode: mode }),

            setStudents: (newStudents) => {
                set({ students: newStudents });
                get().calculateRanks(); // Auto-recalc on update
            },

            setSettings: (newSettings) => {
                set((state) => ({ settings: { ...state.settings, ...newSettings } }));
                if (newSettings.tieBreaker) {
                    get().calculateRanks();
                }
            },

            calculateRanks: () => {
                const { students, settings } = get();
                // Sort by points descending, then by last name for stable tie-breaking
                const sorted = [...students].sort((a, b) => {
                    if (b.points !== a.points) return b.points - a.points;
                    return a.lastName.localeCompare(b.lastName);
                });

                const ranked = sorted.map((student) => ({ ...student })); // Create new array of objects

                // Correct Rank Logic based on settings.tieBreaker
                let currentRank = 1;
                for (let i = 0; i < ranked.length; i++) {
                    if (i > 0) {
                        if (ranked[i].points < ranked[i - 1].points) {
                            // If points are less than the previous student, assign a new rank
                            currentRank = i + 1;
                        } else if (settings.tieBreaker === 'stable') {
                            // If points are equal and tieBreaker is 'stable', assign a new rank (index + 1)
                            currentRank = i + 1;
                        }
                        // If points are equal and tieBreaker is 'shared', currentRank remains the same
                    }
                    ranked[i].rank = currentRank;
                }

                set({ students: ranked });
            },

            saveToRemote: async () => {
                const { students, settings } = get();
                try {
                    await fetch('/api/rankings', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ students, settings }),
                    });
                    console.log('Saved to KV');
                } catch (e) {
                    console.error('Failed to save', e);
                }
            },

            loadFromRemote: async () => {
                try {
                    const res = await fetch('/api/rankings');
                    if (!res.ok) throw new Error('Failed to fetch');
                    const data = await res.json();
                    if (data.students) set({ students: data.students });
                    if (data.settings) set((state) => ({ settings: { ...state.settings, ...data.settings } }));
                    console.log('Loaded from KV');
                } catch (e) {
                    console.error('Failed to load', e);
                }
            }
        }),
        {
            name: 'boiko-chess-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

