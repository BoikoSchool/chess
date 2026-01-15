"use client";

import { useMemo } from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";

// --- Chess Piece Components ---

const PieceMaterial = ({ color }: { color: string }) => {
    const isDark = color === "#111";
    return (
        <meshStandardMaterial
            color={color}
            roughness={0.15}
            metalness={isDark ? 0.6 : 0.3}
            envMapIntensity={1}
        />
    );
};

const Base = () => (
    <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.4, 0.2, 32]} />
    </mesh>
);

const Pawn = ({ color }: { color: string }) => (
    <group>
        <Base />
        <mesh position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.3, 0.6, 24]} />
            <PieceMaterial color={color} />
        </mesh>
        <mesh position={[0, 0.8, 0]} castShadow>
            <sphereGeometry args={[0.22, 24, 24]} />
            <PieceMaterial color={color} />
        </mesh>
    </group>
);

const Rook = ({ color }: { color: string }) => (
    <group>
        <Base />
        <mesh position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.3, 0.8, 24]} />
            <PieceMaterial color={color} />
        </mesh>
        <mesh position={[0, 1, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.3, 24]} />
            <PieceMaterial color={color} />
        </mesh>
    </group>
);

const Knight = ({ color }: { color: string }) => (
    <group>
        <Base />
        <mesh position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.3, 0.6, 24]} />
            <PieceMaterial color={color} />
        </mesh>
        <mesh position={[0.1, 0.8, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
            <boxGeometry args={[0.4, 0.6, 0.3]} />
            <PieceMaterial color={color} />
        </mesh>
    </group>
);

const Bishop = ({ color }: { color: string }) => (
    <group>
        <Base />
        <mesh position={[0, 0.6, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.3, 1, 24]} />
            <PieceMaterial color={color} />
        </mesh>
        <mesh position={[0, 1.2, 0]} castShadow>
            <sphereGeometry args={[0.2, 24, 24]} scale={[1, 1.4, 1]} />
            <PieceMaterial color={color} />
        </mesh>
    </group>
);

const Queen = ({ color }: { color: string }) => (
    <group>
        <Base />
        <mesh position={[0, 0.7, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.3, 1.2, 24]} />
            <PieceMaterial color={color} />
        </mesh>
        <mesh position={[0, 1.4, 0]} castShadow>
            <cylinderGeometry args={[0.35, 0.2, 0.3, 24]} />
            <PieceMaterial color={color} />
        </mesh>
        <mesh position={[0, 1.6, 0]} castShadow>
            <sphereGeometry args={[0.1, 16, 16]} />
            <PieceMaterial color={color} />
        </mesh>
    </group>
);

const King = ({ color }: { color: string }) => (
    <group>
        <Base />
        <mesh position={[0, 0.7, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.3, 1.4, 24]} />
            <PieceMaterial color={color} />
        </mesh>
        <mesh position={[0, 1.6, 0]} castShadow>
            <cylinderGeometry args={[0.4, 0.22, 0.4, 24]} />
            <PieceMaterial color={color} />
        </mesh>
        <group position={[0, 1.9, 0]}>
            <mesh castShadow>
                <boxGeometry args={[0.1, 0.4, 0.1]} />
                <PieceMaterial color={color} />
            </mesh>
            <mesh castShadow>
                <boxGeometry args={[0.3, 0.1, 0.1]} />
                <PieceMaterial color={color} />
            </mesh>
        </group>
    </group>
);

const Piece = ({ type, color }: { type: string, color: string }) => {
    switch (type) {
        case 'p': return <Pawn color={color} />;
        case 'r': return <Rook color={color} />;
        case 'n': return <Knight color={color} />;
        case 'b': return <Bishop color={color} />;
        case 'q': return <Queen color={color} />;
        case 'k': return <King color={color} />;
        default: return null;
    }
};

// --- Main Intro Scene ---

export default function IntroChessScene() {
    const boardSize = 8;
    const offset = -boardSize / 2 + 0.5;

    // Piece layouts
    const piecesLayout = [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        [], [], [], [],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ];

    return (
        <group rotation={[0, -Math.PI / 8, 0]}>
            {/* Board */}
            <mesh receiveShadow position={[0, -0.05, 0]}>
                <boxGeometry args={[boardSize + 0.5, 0.2, boardSize + 0.5]} />
                <meshStandardMaterial color="#222" roughness={0.5} metalness={0.2} />
            </mesh>

            {useMemo(() => {
                const elements = [];
                for (let x = 0; x < boardSize; x++) {
                    for (let z = 0; z < boardSize; z++) {
                        const isDark = (x + z) % 2 === 1;
                        elements.push(
                            <mesh
                                key={`square-${x}-${z}`}
                                position={[x + offset, 0.05, z + offset]}
                                receiveShadow
                            >
                                <boxGeometry args={[1, 0.1, 1]} />
                                <meshStandardMaterial
                                    color={isDark ? "#121212" : "#333"}
                                    roughness={0.1}
                                    metalness={0.2}
                                />
                            </mesh>
                        );

                        // Place Pieces
                        let pieceType = null;
                        let color = null;
                        if (z === 0) { pieceType = piecesLayout[0][x]; color = "#eee"; }
                        if (z === 1) { pieceType = piecesLayout[1][x]; color = "#eee"; }
                        if (z === 6) { pieceType = piecesLayout[6][x]; color = "#111"; }
                        if (z === 7) { pieceType = piecesLayout[7][x]; color = "#111"; }

                        if (pieceType) {
                            elements.push(
                                <group key={`piece-${x}-${z}`} position={[x + offset, 0.12, z + offset]}>
                                    <Piece type={pieceType} color={color!} />
                                </group>
                            );
                        }
                    }
                }
                return elements;
            }, [offset])}

            {/* Dramatic Lighting for Intro */}
            <spotLight
                position={[8, 15, 8]}
                angle={0.4}
                penumbra={1}
                intensity={300}
                castShadow
                color="#ffffff"
            />
            <pointLight position={[-5, 5, -5]} intensity={50} color="#aaf" />

            {/* Text at Bottom Right (from camera perspective) */}
            <group position={[6, 0.2, 7]}>
                <Text
                    fontSize={1.4}
                    color="white"
                    anchorX="right"
                    anchorY="bottom"
                    rotation={[-Math.PI / 2.1, 0, 0]}
                    letterSpacing={0.02}
                    outlineWidth={0.06}
                    outlineColor="white"
                    outlineOpacity={1}
                >
                    BOIKO CHESS
                    <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.4} toneMapped={false} />
                </Text>
            </group>
        </group>
    );
}
