// Core Data Types

export type TieBreakerRule = "shared" | "stable";

export interface Student {
    id: string; // UUID
    firstName: string;
    lastName: string;
    fullName: string;
    points: number;
    classLabel: string;
    rank: number; // 1-based (calculated)
    diff?: number; // Change from previous (optional/future)
}

export interface AppSettings {
    slideDuration: number; // Seconds
    tieBreaker: TieBreakerRule;
    titleTop: string;
    titleBottom: string;
}

export interface ParseResult {
    students: Student[];
    warnings: string[];
}
