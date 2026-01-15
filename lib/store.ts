import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Student, AppSettings } from './types';
import { v4 as uuidv4 } from 'uuid';

interface AppState {
    students: Student[];
    settings: AppSettings;

    // Actions
    setStudents: (students: Student[]) => void;
    updateSettings: (settings: Partial<AppSettings>) => void;
    calculateRanks: () => void;
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

            setStudents: (newStudents) => {
                set({ students: newStudents });
                get().calculateRanks(); // Auto-recalc on update
            },

            updateSettings: (newSettings) => {
                set((state) => ({ settings: { ...state.settings, ...newSettings } }));
                if (newSettings.tieBreaker) {
                    get().calculateRanks();
                }
            },

            calculateRanks: () => {
                const { students, settings } = get();
                // Sort by points descending
                const sorted = [...students].sort((a, b) => {
                    if (b.points !== a.points) return b.points - a.points;
                    // Tie-breaker: alphabetical if points equal (secondary sort)
                    return a.lastName.localeCompare(b.lastName);
                });

                // Assign ranks
                let currentRank = 1;
                const ranked = sorted.map((student, index) => {
                    let rank = currentRank;
                    if (settings.tieBreaker === 'shared') {
                        // If points same as previous, share rank
                        if (index > 0 && student.points === sorted[index - 1].points) {
                            rank = sorted[index - 1].rank;
                        } else {
                            rank = index + 1;
                        }
                    } else {
                        // Stable: just index + 1
                        rank = index + 1;
                    }
                    return { ...student, rank };
                });

                set({ students: ranked });
            },
        }),
        {
            name: 'boiko-chess-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
