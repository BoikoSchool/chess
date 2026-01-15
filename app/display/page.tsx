"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import Experience from "@/components/canvas/Experience";
import { Loader } from "@react-three/drei";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Maximize2, Minimize2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

export default function DisplayPage() {
    const [fullscreen, setFullscreen] = useState(false);
    const { loadFromRemote, currentMode } = useAppStore();

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setFullscreen(true);
        } else {
            document.exitFullscreen();
            setFullscreen(false);
        }
    };

    useEffect(() => {
        loadFromRemote();
    }, [loadFromRemote]);

    return (
        <main className="w-full h-screen bg-[#0b0b0b] relative overflow-hidden">
            {/* UI Overlay */}
            <div className="absolute top-4 left-4 z-[100] flex gap-4 opacity-0 hover:opacity-100 transition-opacity">
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

            {/* Static Intro Overlay */}
            <AnimatePresence>
                {currentMode === "INTRO" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0 z-40 bg-black flex items-center justify-center pointer-events-none"
                    >
                        <img
                            src="/intro-bg.png"
                            alt="Boiko Chess Background"
                            className="w-full h-full object-cover"
                        />
                        {/* Gradually appearing title */}
                        <motion.h1
                            initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            transition={{ delay: 1, duration: 2, ease: "easeOut" }}
                            className="absolute bottom-[12%] right-[8%] text-white text-7xl md:text-[8rem] font-black tracking-tighter"
                            style={{
                                textShadow: '0 0 40px rgba(255,255,255,0.6)',
                                WebkitTextFillColor: 'white',
                            }}
                        >
                            BOIKO CHESS
                        </motion.h1>
                    </motion.div>
                )}
            </AnimatePresence>

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
