"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { Student } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Loader2, Save, Play, Settings, Upload, Trash2, Edit2 } from "lucide-react";

export default function AdminPage() {
    const router = useRouter();
    const { students, settings, setStudents, updateSettings } = useAppStore();

    const [rawText, setRawText] = useState("");
    const [isParsing, setIsParsing] = useState(false);
    const [localStudents, setLocalStudents] = useState<Student[]>([]);
    const [activeTab, setActiveTab] = useState<"input" | "table">("input");

    // Load students from store on mount
    useEffect(() => {
        setLocalStudents(students);
    }, [students]);

    const handleParse = async () => {
        setIsParsing(true);
        try {
            const response = await fetch("/api/ai/parse", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rawText }),
            });

            const data = await response.json();
            if (data.students) {
                setLocalStudents(data.students);
                setActiveTab("table");
            }
        } catch (error) {
            console.error("Parse failed", error);
            alert("Parsing failed. Check console.");
        } finally {
            setIsParsing(false);
        }
    };

    const handleSave = () => {
        setStudents(localStudents);
        alert("Saved successfully!");
    };

    const updateStudent = (id: string, field: keyof Student, value: any) => {
        setLocalStudents((prev) =>
            prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
        );
    };

    const removeStudent = (id: string) => {
        setLocalStudents((prev) => prev.filter((s) => s.id !== id));
    };

    return (
        <main className="min-h-screen p-8 bg-zinc-950 text-zinc-100 font-sans">
            <header className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-700">
                        BOIKO CHESS <span className="text-zinc-500 font-medium text-lg ml-2">Admin</span>
                    </h1>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => router.push("/display")}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors text-sm font-semibold"
                    >
                        <Play className="w-4 h-4" /> Launch Display
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 rounded-lg text-black font-bold transition-all shadow-[0_0_15px_rgba(230,162,60,0.3)]"
                    >
                        <Save className="w-4 h-4" /> Save Changes
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COLUMN: INPUT */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Upload className="w-5 h-5 text-amber-500" /> Import Data
                        </h2>
                        <p className="text-zinc-400 text-sm mb-4">
                            Paste the raw ranking list below. The AI will try to extract names, points, and classes.
                        </p>
                        <textarea
                            value={rawText}
                            onChange={(e) => setRawText(e.target.value)}
                            className="w-full h-64 bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-sm font-mono text-zinc-300 focus:outline-none focus:ring-2 focus:ring-amber-900 resize-none"
                            placeholder="1. Ivanov Ivan - 150 - 5-A&#10;2. Petrenko Petro - 140 - 3-B..."
                        />
                        <button
                            onClick={handleParse}
                            disabled={isParsing || !rawText}
                            className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 rounded-lg font-medium transition-colors border border-zinc-700"
                        >
                            {isParsing ? <Loader2 className="animate-spin w-4 h-4" /> : "AI Parse & Generate"}
                        </button>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-amber-500" /> Settings
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-zinc-500 mb-1 uppercase tracking-wider">Slide Duration (sec)</label>
                                <input
                                    type="number"
                                    value={settings.slideDuration}
                                    onChange={(e) => updateSettings({ slideDuration: parseInt(e.target.value) || 5 })}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-zinc-500 mb-1 uppercase tracking-wider">Tie Breaker</label>
                                <select
                                    value={settings.tieBreaker}
                                    onChange={(e) => updateSettings({ tieBreaker: e.target.value as any })}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm"
                                >
                                    <option value="shared">Shared Rank (e.g. 1, 2, 2, 4)</option>
                                    <option value="stable">Stable Sort (Alphabetical)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: PREVIEW/TABLE */}
                <div className="lg:col-span-2">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg min-h-[600px]">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Edit2 className="w-5 h-5 text-amber-500" /> Active Roster
                                <span className="text-xs font-normal text-zinc-500 bg-zinc-800 px-2 py-1 rounded-full">{localStudents.length} students</span>
                            </h2>
                            <div className="text-xs text-zinc-500 italic">
                                * Ranks are calculated automatically on Save
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-zinc-950 text-zinc-500 uppercase text-xs">
                                    <tr>
                                        <th className="px-4 py-3 rounded-l-lg">Name</th>
                                        <th className="px-4 py-3">Points</th>
                                        <th className="px-4 py-3">Class</th>
                                        <th className="px-4 py-3 rounded-r-lg text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    {localStudents.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-12 text-center text-zinc-600">
                                                No data. Use import or add manually.
                                            </td>
                                        </tr>
                                    ) : (
                                        localStudents.map((s) => (
                                            <tr key={s.id} className="hover:bg-zinc-800/50 transition-colors group">
                                                <td className="px-4 py-3">
                                                    <input
                                                        value={s.fullName}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            const parts = val.split(' ');
                                                            updateStudent(s.id, 'fullName', val);
                                                            updateStudent(s.id, 'lastName', parts[0] || "");
                                                            updateStudent(s.id, 'firstName', parts[1] || "");
                                                        }}
                                                        className="bg-transparent border-none focus:ring-0 w-full p-0 font-medium text-zinc-200 placeholder-zinc-700"
                                                        placeholder="Full Name"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="number"
                                                        value={s.points}
                                                        onChange={(e) => updateStudent(s.id, 'points', parseInt(e.target.value) || 0)}
                                                        className="bg-transparent border-none focus:ring-0 w-20 p-0 text-amber-500 font-bold"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        value={s.classLabel}
                                                        onChange={(e) => updateStudent(s.id, 'classLabel', e.target.value)}
                                                        className="bg-transparent border-none focus:ring-0 w-full p-0 text-zinc-400"
                                                        placeholder="Class"
                                                    />
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <button
                                                        onClick={() => removeStudent(s.id)}
                                                        className="text-zinc-600 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
