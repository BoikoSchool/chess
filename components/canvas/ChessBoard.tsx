"use client";

import { useRef, useLayoutEffect } from "react";
import { InstancedMesh, Object3D, Color } from "three";

const BOARD_SIZE = 12; // 8x8 is standard, but let's make it larger for the "floor" effect
const OFFSET = -BOARD_SIZE / 2 + 0.5;

const COLOR_DARK = new Color("#3a3a3a");
const COLOR_LIGHT = new Color("#dce4de");

export default function ChessBoard() {
    const meshRef = useRef<InstancedMesh>(null);

    useLayoutEffect(() => {
        if (!meshRef.current) return;

        const temp = new Object3D();
        let i = 0;

        // Create a larger grid than just 8x8 to fill the infinite floor look
        // Let's do 20x20 centered
        const SIZE = 24;
        const START = -SIZE / 2;

        for (let x = 0; x < SIZE; x++) {
            for (let z = 0; z < SIZE; z++) {
                temp.position.set(START + x, 0, START + z);
                temp.updateMatrix();
                meshRef.current.setMatrixAt(i, temp.matrix);

                // Chess pattern logic
                const isDark = (x + z) % 2 === 1;
                meshRef.current.setColorAt(i, isDark ? COLOR_DARK : COLOR_LIGHT);

                i++;
            }
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    }, []);

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, 24 * 24]} receiveShadow>
            <boxGeometry args={[1, 0.2, 1]} />
            <meshStandardMaterial roughness={0.5} metalness={0.1} />
        </instancedMesh>
    );
}
