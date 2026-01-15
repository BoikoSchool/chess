"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/lib/store";
import PedestalGroup from "./PedestalGroup";
import * as THREE from "three";
import { Text } from "@react-three/drei";

type SceneMode = "INTRO" | "TOP3" | "RANK_4_7" | "RANK_8_10";

// Camera Targets
const TARGETS = {
    INTRO: { pos: new THREE.Vector3(0, 8, 14), look: new THREE.Vector3(0, 0, 0) },
    TOP3: { pos: new THREE.Vector3(0, 5, 12), look: new THREE.Vector3(0, 2, 0) },
    RANK_4_7: { pos: new THREE.Vector3(0, 6, 14), look: new THREE.Vector3(0, 1, 0) },
    RANK_8_10: { pos: new THREE.Vector3(0, 5, 12), look: new THREE.Vector3(0, 1, 0) },
};

export default function SceneController() {
    const { settings } = useAppStore();
    const { camera } = useThree();

    const [mode, setMode] = useState<SceneMode>("INTRO");
    const [lastSwitch, setLastSwitch] = useState(0);

    // Cycle Logic
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (time - lastSwitch > settings.slideDuration) {
            setLastSwitch(time);
            // Next mode
            setMode(prev => {
                if (prev === "INTRO") return "TOP3";
                if (prev === "TOP3") return "RANK_4_7";
                if (prev === "RANK_4_7") return "RANK_8_10";
                return "INTRO";
            });
        }

        // Camera Lerp
        const target = TARGETS[mode];
        // Gentle Dolly/Zoom
        const zoomOffset = Math.sin(time * 0.2) * 0.5;

        const destPos = target.pos.clone().add(new THREE.Vector3(0, 0, zoomOffset));

        camera.position.lerp(destPos, 0.02);
        // Needed to smooth lookAt? OrbitControls might fight this. 
        // In Experience, we removed OrbitControls? No, we might have added them.
        // If we want cinematic, we should control camera strictly.
        // For now, let's lookAt smoothly.
        const currentLook = new THREE.Vector3(0, 0, 0); // Approximation needed if we want smooth lookAt lerp
        // Easier: Just lookAt every frame to the target center
        camera.lookAt(target.look);
    });

    return (
        <>
            {/* Global Title Logic could go here or inside modes */}

            {mode === "INTRO" && (
                <group position={[0, 0, 0]}>
                    <Text
                        fontSize={2.5}
                        letterSpacing={0.15}
                        position={[0, 3, -4]}
                        rotation={[-Math.PI / 8, 0, 0]}
                        anchorX="center"
                        anchorY="middle"
                        outlineWidth={0.05}
                        outlineColor="#000000"
                    >
                        BOIKO CHESS
                        <meshStandardMaterial
                            color="#ffffff"
                            emissive="#e6daa2"
                            emissiveIntensity={1.5}
                            toneMapped={false}
                        />
                    </Text>

                    {/* Procedural King (Black) */}
                    <group position={[3, 0, 4]}>
                        {/* Base */}
                        <mesh position={[0, 0.2, 0]} castShadow>
                            <cylinderGeometry args={[1.2, 1.4, 0.4, 32]} />
                            <meshStandardMaterial color="#111" roughness={0.2} metalness={0.6} />
                        </mesh>
                        <mesh position={[0, 0.6, 0]} castShadow>
                            <cylinderGeometry args={[1, 1.1, 0.4, 32]} />
                            <meshStandardMaterial color="#111" roughness={0.2} metalness={0.6} />
                        </mesh>
                        {/* Body */}
                        <mesh position={[0, 2.5, 0]} castShadow>
                            <cylinderGeometry args={[0.6, 1, 3.5, 32]} />
                            <meshStandardMaterial color="#111" roughness={0.2} metalness={0.6} />
                        </mesh>
                        {/* Collar */}
                        <mesh position={[0, 4.3, 0]} castShadow rotation={[Math.PI / 2, 0, 0]}>
                            <torusGeometry args={[0.7, 0.15, 16, 32]} />
                            <meshStandardMaterial color="#111" roughness={0.2} metalness={0.6} />
                        </mesh>
                        {/* Head */}
                        <mesh position={[0, 5, 0]} castShadow>
                            <cylinderGeometry args={[0.8, 0.4, 1.2, 32]} />
                            <meshStandardMaterial color="#111" roughness={0.2} metalness={0.6} />
                        </mesh>
                        {/* Cross */}
                        <group position={[0, 6, 0]}>
                            <mesh position={[0, 0, 0]} castShadow>
                                <boxGeometry args={[0.3, 0.8, 0.3]} />
                                <meshStandardMaterial color="#111" roughness={0.2} metalness={0.6} />
                            </mesh>
                            <mesh position={[0, 0.2, 0]} castShadow>
                                <boxGeometry args={[0.8, 0.25, 0.25]} />
                                <meshStandardMaterial color="#111" roughness={0.2} metalness={0.6} />
                            </mesh>
                        </group>
                    </group>

                    {/* Procedural Pawn (White) */}
                    <group position={[-2, 0, 2]}>
                        {/* Base */}
                        <mesh position={[0, 0.2, 0]} castShadow>
                            <cylinderGeometry args={[0.9, 1.1, 0.4, 32]} />
                            <meshStandardMaterial color="#eee" roughness={0.2} metalness={0.3} />
                        </mesh>
                        {/* Body curve */}
                        <mesh position={[0, 1.4, 0]} castShadow>
                            <cylinderGeometry args={[0.4, 0.8, 2.0, 32]} />
                            <meshStandardMaterial color="#eee" roughness={0.2} metalness={0.3} />
                        </mesh>
                        {/* Collar */}
                        <mesh position={[0, 2.5, 0]} castShadow rotation={[Math.PI / 2, 0, 0]}>
                            <torusGeometry args={[0.5, 0.1, 16, 32]} />
                            <meshStandardMaterial color="#eee" roughness={0.2} metalness={0.3} />
                        </mesh>
                        {/* Head */}
                        <mesh position={[0, 3.2, 0]} castShadow>
                            <sphereGeometry args={[0.65, 32, 32]} />
                            <meshStandardMaterial color="#eee" roughness={0.2} metalness={0.3} />
                        </mesh>
                    </group>
                </group>
            )}

            {mode !== "INTRO" && (
                <PedestalGroup mode={mode} />
            )}
        </>
    );
}
