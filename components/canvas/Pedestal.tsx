"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { Student } from "@/lib/types";
import { Group, Mesh } from "three";

interface PedestalProps {
    student: Student;
    position: [number, number, number];
    height?: number;
    rankScale?: number; // 1.0 for winner, 0.9 for others, etc.
}

const ROMAN_NUMERALS = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

export default function Pedestal({ student, position, height = 3, rankScale = 1 }: PedestalProps) {
    const groupRef = useRef<Group>(null);
    const glowTextMaterial = useRef<any>(null);

    // Animation: Gentle float or subtle rotation? 
    // Let's keep it static but maybe slight hover?
    // Actually, standard pedestals stand firm.

    const radius = 1.2 * rankScale;
    const cylinderHeight = height * rankScale;
    const roman = ROMAN_NUMERALS[student.rank] || student.rank.toString();

    return (
        <group ref={groupRef} position={position}>
            {/* 1. Base Cylinder (Body) */}
            <mesh position={[0, cylinderHeight / 2, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[radius, radius, cylinderHeight, 32]} />
                <meshStandardMaterial color="#1a1917" roughness={0.3} metalness={0.8} />
            </mesh>

            {/* 2. Top Cap */}
            <mesh position={[0, cylinderHeight + 0.05, 0]} receiveShadow>
                <cylinderGeometry args={[radius + 0.05, radius + 0.05, 0.1, 32]} />
                <meshStandardMaterial color="#42413c" roughness={0.5} metalness={0.5} />
            </mesh>

            {/* 3. Gold Rings (Near top) */}
            <mesh position={[0, cylinderHeight - 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[radius + 0.02, 0.05, 16, 64]} />
                <meshStandardMaterial color="#827644" emissive="#827644" emissiveIntensity={0.5} metalness={1} roughness={0.2} />
            </mesh>
            <mesh position={[0, cylinderHeight - 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[radius + 0.02, 0.05, 16, 64]} />
                <meshStandardMaterial color="#827644" emissive="#827644" emissiveIntensity={0.5} metalness={1} roughness={0.2} />
            </mesh>

            {/* 4. Rank Label (Roman Numeral) on Body */}
            <Text
                position={[0, cylinderHeight / 2, radius + 0.1]}
                fontSize={1.5 * rankScale}
                color="#e6daa2"
                anchorX="center"
                anchorY="middle"
            // font="https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459Wlhyw.woff"
            >
                {roman}
                <meshStandardMaterial color="#e6daa2" emissive="#e6daa2" emissiveIntensity={1} toneMapped={false} />
                {/* Shadow behind text? */}
                <Text fontSize={1.5 * rankScale} position={[0, 0, -0.05]} color="#000000" anchorX="center" anchorY="middle">
                    {roman}
                </Text>
            </Text>


            {/* 5. Floating Names above */}
            <group position={[0, cylinderHeight + 1.5, 0]}>
                {/* Name */}
                <Text
                    position={[0, 0.5, 0]}
                    fontSize={0.6 * rankScale}
                    color="#e6daa2"
                    anchorX="center"
                    anchorY="bottom"
                    textAlign="center"
                    maxWidth={3}
                // font="https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459Wlhyw.woff"
                >
                    {student.fullName.replace(" ", "\n")}
                    <meshStandardMaterial
                        color="#e6daa2"
                        emissive="#e6daa2"
                        emissiveIntensity={2}
                        toneMapped={false}
                    />
                </Text>

                {/* Points */}
                <Text
                    position={[0, -0.2, 0]}
                    fontSize={0.6 * rankScale}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="top"
                // font="https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459Wlhyw.woff"
                >
                    {student.points} балів
                </Text>

                {/* Class */}
                <Text
                    position={[0, -0.7, 0]}
                    fontSize={0.5 * rankScale}
                    color="#dddddd"
                    anchorX="center"
                    anchorY="top"
                    // font="https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459Wlhyw.woff"
                    outlineWidth={0.02}
                    outlineColor="#000000"
                >
                    {student.classLabel}
                </Text>
            </group>
        </group>
    );
}
