"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/lib/store";
import PedestalGroup from "./PedestalGroup";
import IntroChessScene from "./IntroChessScene";
import * as THREE from "three";
import { Text } from "@react-three/drei";

type SceneMode = "INTRO" | "TOP3" | "RANK_4_7" | "RANK_8_10";

// Camera Targets
const TARGETS = {
    INTRO: { pos: new THREE.Vector3(0, 4, 11), look: new THREE.Vector3(0, 1, 0) },
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
        // Smoother lookAt
        camera.lookAt(target.look);
    });

    return (
        <>
            {mode === "INTRO" && (
                <IntroChessScene />
            )}


            {mode !== "INTRO" && (
                <PedestalGroup mode={mode} />
            )}
        </>
    );
}
