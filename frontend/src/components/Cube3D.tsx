import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { CubeState, Color } from '../types/cube';
import { COLOR_TO_HEX } from '../types/cube';
import { getVisibleStickers } from '../utils/cubeMapping';
import * as THREE from 'three';

interface Cube3DProps {
  cubeState: CubeState;
  size?: number;
  debugMode?: boolean;
}

type StickerFace = 'right' | 'left' | 'top' | 'bottom' | 'front' | 'back';

interface FaceDef {
  key: StickerFace;
  position: [number, number, number];
  rotation: [number, number, number];
}

const FACE_DEFS: FaceDef[] = [
  { key: 'right',  position: [0.46, 0, 0],    rotation: [0, Math.PI / 2, 0] },
  { key: 'left',   position: [-0.46, 0, 0],   rotation: [0, -Math.PI / 2, 0] },
  { key: 'top',    position: [0, 0.46, 0],    rotation: [-Math.PI / 2, 0, 0] },
  { key: 'bottom', position: [0, -0.46, 0],   rotation: [Math.PI / 2, 0, 0] },
  { key: 'front',  position: [0, 0, 0.46],    rotation: [0, 0, 0] },
  { key: 'back',   position: [0, 0, -0.46],   rotation: [0, Math.PI, 0] },
];

const CUBE_FACE_MAP: Record<string, StickerFace> = {
  U: 'top', D: 'bottom', R: 'right', L: 'left', F: 'front', B: 'back',
};

// テキストテクスチャを作成する関数
const createTextTexture = (text: string, bgColor: string = '#FFFFFF'): THREE.Texture => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  canvas.width = 128;
  canvas.height = 128;
  context.fillStyle = bgColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#000000';
  context.font = 'bold 48px Arial';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

interface CubieProps {
  position: [number, number, number];
  colors: Partial<Record<StickerFace, Color>>;
  debugInfo?: Partial<Record<StickerFace, number>>;
  debugMode?: boolean;
}

const Cubie = React.memo<CubieProps>(({ position, colors, debugInfo, debugMode }) => {
  // デバッグテクスチャをメモ化
  const textures = useMemo(() => {
    if (!debugMode) return null;
    const cache: Partial<Record<StickerFace, THREE.Texture>> = {};
    for (const { key } of FACE_DEFS) {
      const color = colors[key];
      const id = debugInfo?.[key];
      if (color && id !== undefined) {
        cache[key] = createTextTexture(id.toString(), COLOR_TO_HEX[color]);
      }
    }
    return cache;
  }, [colors, debugInfo, debugMode]);

  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.85, 0.85, 0.85]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>

      {FACE_DEFS.map(({ key, position: facePos, rotation }) => {
        const color = colors[key];
        if (!color) return null;
        const texture = textures?.[key];
        return (
          <mesh key={key} position={facePos} rotation={rotation}>
            <planeGeometry args={[0.9, 0.9]} />
            {texture ? (
              <meshBasicMaterial map={texture} />
            ) : (
              <meshLambertMaterial color={COLOR_TO_HEX[color]} />
            )}
          </mesh>
        );
      })}
    </group>
  );
});

const CubeGeometry: React.FC<{ cubeState: CubeState; debugMode?: boolean }> = ({ cubeState, debugMode }) => {
  const cubies = [];

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        if (x === 0 && y === 0 && z === 0) continue;

        const colors: Partial<Record<StickerFace, Color>> = {};
        const debugInfo: Partial<Record<StickerFace, number>> = {};

        for (const sticker of getVisibleStickers({ x, y, z })) {
          const faceKey = CUBE_FACE_MAP[sticker.face];
          colors[faceKey] = cubeState.stickers[sticker.globalIndex];
          debugInfo[faceKey] = cubeState.stickerIds
            ? cubeState.stickerIds[sticker.globalIndex]
            : sticker.globalIndex;
        }

        cubies.push(
          <Cubie
            key={`${x},${y},${z}`}
            position={[x, y, z]}
            colors={colors}
            debugInfo={debugInfo}
            debugMode={debugMode}
          />
        );
      }
    }
  }

  return <>{cubies}</>;
};

export const Cube3D: React.FC<Cube3DProps> = ({ cubeState, debugMode = false }) => {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-5, -5, -5]} intensity={0.3} />
        <CubeGeometry cubeState={cubeState} debugMode={debugMode} />
        <OrbitControls enablePan={false} minDistance={3} maxDistance={10} />
      </Canvas>
    </div>
  );
};
