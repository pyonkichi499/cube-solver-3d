import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as CubeTypes from '../types/cube';
import { getVisibleStickers } from '../utils/cubeMapping';
import * as THREE from 'three';

type CubeState = CubeTypes.CubeState;
type Color = CubeTypes.Color;

interface Cube3DProps {
  cubeState: CubeState;
  size?: number;
  debugMode?: boolean;
}

// Color to hex mapping for Three.js materials
const colorToHex: Record<Color, string> = {
  white: '#FFFFFF',
  yellow: '#FFD500',
  orange: '#FF8C00', // より明るいオレンジ（DarkOrange）
  red: '#DC143C',    // より鮮やかな赤（Crimson）
  green: '#00AA00',  // 少し明るい緑
  blue: '#0066FF'    // 少し明るい青
};

interface CubieProps {
  position: [number, number, number];
  colors: {
    right?: Color;
    left?: Color;
    top?: Color;
    bottom?: Color;
    front?: Color;
    back?: Color;
  };
  debugInfo?: {
    right?: number;
    left?: number;
    top?: number;
    bottom?: number;
    front?: number;
    back?: number;
  };
  debugMode?: boolean;
}

// テキストテクスチャを作成する関数
const createTextTexture = (text: string, bgColor: string = '#FFFFFF'): THREE.Texture => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  
  canvas.width = 128;
  canvas.height = 128;
  
  // 背景を描画
  context.fillStyle = bgColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  // テキストを描画
  context.fillStyle = '#000000';
  context.font = 'bold 48px Arial';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

const Cubie: React.FC<CubieProps> = ({ position, colors, debugInfo, debugMode }) => {
  return (
    <group position={position}>
      {/* Black cube core - smaller to avoid z-fighting */}
      <mesh>
        <boxGeometry args={[0.85, 0.85, 0.85]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>
      
      {/* Right face (+X) */}
      {colors.right && (
        <mesh position={[0.46, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.9, 0.9]} />
          {debugMode && debugInfo?.right !== undefined ? (
            <meshBasicMaterial map={createTextTexture(debugInfo.right.toString(), colorToHex[colors.right])} />
          ) : (
            <meshLambertMaterial color={colorToHex[colors.right]} />
          )}
        </mesh>
      )}
      
      {/* Left face (-X) */}
      {colors.left && (
        <mesh position={[-0.46, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[0.9, 0.9]} />
          {debugMode && debugInfo?.left !== undefined ? (
            <meshBasicMaterial map={createTextTexture(debugInfo.left.toString(), colorToHex[colors.left])} />
          ) : (
            <meshLambertMaterial color={colorToHex[colors.left]} />
          )}
        </mesh>
      )}
      
      {/* Top face (+Y) */}
      {colors.top && (
        <mesh position={[0, 0.46, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.9, 0.9]} />
          {debugMode && debugInfo?.top !== undefined ? (
            <meshBasicMaterial map={createTextTexture(debugInfo.top.toString(), colorToHex[colors.top])} />
          ) : (
            <meshLambertMaterial color={colorToHex[colors.top]} />
          )}
        </mesh>
      )}
      
      {/* Bottom face (-Y) */}
      {colors.bottom && (
        <mesh position={[0, -0.46, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.9, 0.9]} />
          {debugMode && debugInfo?.bottom !== undefined ? (
            <meshBasicMaterial map={createTextTexture(debugInfo.bottom.toString(), colorToHex[colors.bottom])} />
          ) : (
            <meshLambertMaterial color={colorToHex[colors.bottom]} />
          )}
        </mesh>
      )}
      
      {/* Front face (+Z) */}
      {colors.front && (
        <mesh position={[0, 0, 0.46]}>
          <planeGeometry args={[0.9, 0.9]} />
          {debugMode && debugInfo?.front !== undefined ? (
            <meshBasicMaterial map={createTextTexture(debugInfo.front.toString(), colorToHex[colors.front])} />
          ) : (
            <meshLambertMaterial color={colorToHex[colors.front]} />
          )}
        </mesh>
      )}
      
      {/* Back face (-Z) */}
      {colors.back && (
        <mesh position={[0, 0, -0.46]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.9, 0.9]} />
          {debugMode && debugInfo?.back !== undefined ? (
            <meshBasicMaterial map={createTextTexture(debugInfo.back.toString(), colorToHex[colors.back])} />
          ) : (
            <meshLambertMaterial color={colorToHex[colors.back]} />
          )}
        </mesh>
      )}
    </group>
  );
};

const CubeGeometry: React.FC<{ cubeState: CubeState; debugMode?: boolean }> = ({ cubeState, debugMode }) => {
  const cubies = [];
  
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        // Skip the core
        if (x === 0 && y === 0 && z === 0) continue;
        
        const colors: CubieProps['colors'] = {};
        const debugInfo: CubieProps['debugInfo'] = {};
        
        // Use the mapping utility to get correct sticker positions
        const visibleStickers = getVisibleStickers({ x, y, z });
        
        // Map stickers to colors and debug info
        visibleStickers.forEach(sticker => {
          const color = cubeState.stickers[sticker.globalIndex];
          
          // デバッグモードでは、その位置にあるステッカーの元のIDを表示
          const displayId = cubeState.stickerIds 
            ? cubeState.stickerIds[sticker.globalIndex] 
            : sticker.globalIndex;
          
          switch (sticker.face) {
            case 'U':
              colors.top = color;
              debugInfo.top = displayId;
              break;
            case 'D':
              colors.bottom = color;
              debugInfo.bottom = displayId;
              break;
            case 'R':
              colors.right = color;
              debugInfo.right = displayId;
              break;
            case 'L':
              colors.left = color;
              debugInfo.left = displayId;
              break;
            case 'F':
              colors.front = color;
              debugInfo.front = displayId;
              break;
            case 'B':
              colors.back = color;
              debugInfo.back = displayId;
              break;
          }
        });
        
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