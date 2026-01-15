"use client";

import { useAppStore } from "@/lib/store";
import { useMemo } from "react";
import Pedestal from "./Pedestal";
import { Student } from "@/lib/types";

interface PedestalGroupProps {
    mode: string;
}

export default function PedestalGroup({ mode }: PedestalGroupProps) {
    const { students, settings } = useAppStore();

    const subset = useMemo(() => {
        if (mode === "TOP3") return students.slice(0, 3);
        if (mode === "RANK_4_7") return students.slice(3, 7);
        if (mode === "RANK_8_10") return students.slice(7, 10);
        return [];
    }, [mode, students]);

    // Positioning Logic
    // Top 3 Layout: 2nd(Left) - 1st(Center, High) - 3rd(Right)
    // Others: Linear or Arc? Request says "4 pedestals of different heights"

    const getLayout = (student: Student, index: number, total: number) => {
        // Determine relative position in this subset (0, 1, 2...)
        // But we need to know their actual Rank or visual hierarchy

        if (mode === "TOP3") {
            // visualIndex: 0=Center(1st), 1=Left(2nd), 2=Right(3rd)
            // But input is sorted by rank: [1st, 2nd, 3rd]
            // Map: i=0 -> Pos(0,0), i=1 -> Pos(-3,0), i=2 -> Pos(3,0)
            if (index === 0) return { pos: [0, 0, 0], height: 3.0, scale: 1.0 };
            if (index === 1) return { pos: [-3.5, 0, 1], height: 2.4, scale: 0.85 };
            if (index === 2) return { pos: [3.5, 0, 1], height: 2.0, scale: 0.75 };
        }

        // 4-7: [4th, 5th, 6th, 7th]
        if (mode === "RANK_4_7") {
            // Layout: -4.5, -1.5, 1.5, 4.5
            // Heights descending?
            const x = (index - 1.5) * 3;
            return { pos: [x, 0, 0], height: 2.5 - (index * 0.2), scale: 0.8 };
        }

        // 8-10: [8th, 9th, 10th]
        if (mode === "RANK_8_10") {
            const x = (index - 1) * 3;
            return { pos: [x, 0, 0], height: 2.0 - (index * 0.1), scale: 0.75 };
        }

        return { pos: [0, -10, 0], height: 1, scale: 1 };
    };

    return (
        <group position={[0, 0, 0]}>
            {/* Title */}
            <TitleGroup settings={settings} mode={mode} />

            {/* Pedestals */}
            {subset.map((student, i) => {
                const layout = getLayout(student, i, subset.length);
                return (
                    <Pedestal
                        key={student.id}
                        student={student}
                        position={layout.pos as [number, number, number]}
                        height={layout.height}
                        rankScale={layout.scale}
                    />
                );
            })}
        </group>
    );
}

import { Text } from "@react-three/drei";
import { AppSettings } from "@/lib/types";

// Pass mode to TitleGroup
function TitleGroup({ settings, mode }: { settings: AppSettings, mode: string }) {
    const yPos = mode === "TOP3" ? 7.5 : 6;
    return (
        <group position={[0, yPos, -10]}>
            <Text
                position={[0, 1.0, 0]}
                fontSize={0.9}
                color="#e6daa2"
                anchorX="center"
                maxWidth={15}
                textAlign="center"
                outlineWidth={0.02}
                outlineColor="#000000"
            >
                ШАХОВИЙ РЕЙТИНГ УЧНІВ
                <meshStandardMaterial
                    color="#e6daa2"
                    emissive="#e6daa2"
                    emissiveIntensity={1.2}
                    toneMapped={false}
                />
            </Text>
            <Text
                position={[0, -0.2, 0]}
                fontSize={0.9}
                color="#e6daa2"
                anchorX="center"
                maxWidth={15}
                textAlign="center"
                outlineWidth={0.02}
                outlineColor="#000000"
            >
                АВТОРСЬКОЇ ШКОЛИ БОЙКА
                <meshStandardMaterial
                    color="#e6daa2"
                    emissive="#e6daa2"
                    emissiveIntensity={1.2}
                    toneMapped={false}
                />
            </Text>
        </group>
    )
}
