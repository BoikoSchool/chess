"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import Experience from "@/components/canvas/Experience";
import { Loader } from "@react-three/drei";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Maximize2, Minimize2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DisplayPage() {
    const [fullscreen, setFullscreen] = useState(false);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setFullscreen(true);
        } else {
            document.exitFullscreen();
            setFullscreen(false);
        }
    };

    const { loadFromRemote } = useAppStore();

    useEffect(() => {
        // Fetch latest data when display loads
        loadFromRemote();

        // Optional: Poll every minute? 
        // For now, let's keep it simple: refresh page to update.
    }, [loadFromRemote]);

    return (
        <main className="w-full h-screen bg-[#0b0b0b] relative overflow-hidden">
            {/* UI Overlay */}
            <div className="absolute top-4 left-4 z-50 flex gap-4 opacity-0 hover:opacity-100 transition-opacity">
                <Link
                    href="/admin"
                    className="p-2 bg-black/50 text-white rounded-lg hover:bg-white/10 backdrop-blur"
                >
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <button
                    onClick={toggleFullscreen}
                    className="p-2 bg-black/50 text-white rounded-lg hover:bg-white/10 backdrop-blur"
                >
                    {fullscreen ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
                </button>
            </div>

            <Canvas
                shadows
                dpr={[1, 2]}
                gl={{ antialias: false, toneMappingExposure: 1.2 }}
                camera={{ position: [0, 5, 10], fov: 45 }}
            >
                <Suspense fallback={null}>
                    <Experience />
                </Suspense>
            </Canvas>
            <Loader />
        </main>
    );
}
