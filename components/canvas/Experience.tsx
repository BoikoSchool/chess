"use client";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, DepthOfField } from "@react-three/postprocessing";
import { useAppStore } from "@/lib/store";
import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import ChessBoard from "./ChessBoard";
import PedestalGroup from "./PedestalGroup";
import Confetti from "./Confetti";
import SceneController from "./SceneController";

export default function Experience() {
    const { students, settings } = useAppStore();

    return (
        <>
            <color attach="background" args={["#0b0b0b"]} />

            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <spotLight
                position={[10, 20, 10]}
                angle={0.5}
                penumbra={1}
                intensity={1000}
                color="#e6daa2"
                castShadow
            />
            <pointLight position={[-10, 10, -10]} intensity={200} color="#827644" />

            {/* Scene Content */}
            <group position={[0, -2, 0]}>
                <ChessBoard />
                <Confetti count={200} />
                <SceneController />
            </group>

            {/* Post Processing */}
            <EffectComposer>
                <Bloom
                    luminanceThreshold={0.8}
                    mipmapBlur
                    intensity={1.2}
                    radius={0.4}
                />
                <Vignette eskil={false} offset={0.1} darkness={1.1} />
            </EffectComposer>
        </>
    );
}
