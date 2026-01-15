"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { InstancedMesh, Object3D, Color, MathUtils } from "three";

interface ConfettiProps {
    count?: number;
}

const COLORS = ["#e6daa2", "#827644", "#ffffff", "#cccccc"];

export default function Confetti({ count = 200 }: ConfettiProps) {
    const meshRef = useRef<InstancedMesh>(null);
    const dummy = useMemo(() => new Object3D(), []);

    // Particle state
    const particles = useMemo(() => {
        return new Array(count).fill(0).map(() => ({
            x: MathUtils.randFloatSpread(20),
            y: MathUtils.randFloat(10, 25), // Start high
            z: MathUtils.randFloatSpread(20),
            speed: MathUtils.randFloat(0.02, 0.08),
            rotationSpeed: MathUtils.randFloat(0.01, 0.05),
            wobble: MathUtils.randFloat(0, Math.PI * 2),
            wobbleSpeed: MathUtils.randFloat(0.02, 0.05),
            scale: MathUtils.randFloat(0.5, 1.2),
        }));
    }, [count]);

    useFrame(() => {
        if (!meshRef.current) return;

        particles.forEach((p, i) => {
            p.y -= p.speed;
            p.wobble += p.wobbleSpeed;

            // Reset if below floor
            if (p.y < -1) {
                p.y = 20;
                p.x = MathUtils.randFloatSpread(20);
                p.z = MathUtils.randFloatSpread(15);
            }

            // Add wobble movement
            const x = p.x + Math.sin(p.wobble) * 0.5;

            dummy.position.set(x, p.y, p.z);
            dummy.rotation.x += p.rotationSpeed;
            dummy.rotation.y += p.rotationSpeed;
            dummy.scale.setScalar(0.15 * p.scale);

            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    // Init colors
    useMemo(() => {
        // Defer color setting to after mount ref is ready (rendering phase) - but useMemo runs during render. 
        // Actually we can just do it in a ref text, but sticking to logic in useFrame or layoutEffect is safer.
        // We'll trust React to run this ref update once or we can do it in a useLayoutEffect
    }, []);

    return (
        <instancedMesh
            ref={meshRef}
            args={[undefined, undefined, count]}
        // Initialize colors in the ref callback to ensure it happens
        >
            <planeGeometry args={[1, 0.5]} />
            <meshBasicMaterial side={2} transparent opacity={0.8} />
            {/* Set colors on mount */}
            <InstanceColorInit count={count} meshRef={meshRef} />
        </instancedMesh>
    );
}

function InstanceColorInit({ count, meshRef }: { count: number, meshRef: React.RefObject<InstancedMesh | null> }) {
    useFrame(() => {
        // Just run once to set colors if not set. Simple hack to avoid useEffect complexity with instances
        if (meshRef.current && !meshRef.current.userData.colorsSet) {
            const tempColor = new Color();
            for (let i = 0; i < count; i++) {
                tempColor.set(COLORS[Math.floor(Math.random() * COLORS.length)]);
                meshRef.current.setColorAt(i, tempColor);
            }
            if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
            meshRef.current.userData.colorsSet = true;
        }
    });
    return null;
}
