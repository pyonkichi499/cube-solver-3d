import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as CubeTypes from '../types/cube';

type CubeState = CubeTypes.CubeState;
type Color = CubeTypes.Color;

interface Cube3DProps {
  cubeState: CubeState;
  size?: number;
}

// Color to hex mapping for Three.js materials
const colorToHex: Record<Color, string> = {
  white: '#FFFFFF',
  yellow: '#FFD500',
  orange: '#FF5800',
  red: '#C41E3A',
  green: '#009E60',
  blue: '#0051BA'
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
}

const Cubie: React.FC<CubieProps> = ({ position, colors }) => {
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
          <meshLambertMaterial color={colorToHex[colors.right]} />
        </mesh>
      )}
      
      {/* Left face (-X) */}
      {colors.left && (
        <mesh position={[-0.46, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[0.9, 0.9]} />
          <meshLambertMaterial color={colorToHex[colors.left]} />
        </mesh>
      )}
      
      {/* Top face (+Y) */}
      {colors.top && (
        <mesh position={[0, 0.46, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.9, 0.9]} />
          <meshLambertMaterial color={colorToHex[colors.top]} />
        </mesh>
      )}
      
      {/* Bottom face (-Y) */}
      {colors.bottom && (
        <mesh position={[0, -0.46, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.9, 0.9]} />
          <meshLambertMaterial color={colorToHex[colors.bottom]} />
        </mesh>
      )}
      
      {/* Front face (+Z) */}
      {colors.front && (
        <mesh position={[0, 0, 0.46]}>
          <planeGeometry args={[0.9, 0.9]} />
          <meshLambertMaterial color={colorToHex[colors.front]} />
        </mesh>
      )}
      
      {/* Back face (-Z) */}
      {colors.back && (
        <mesh position={[0, 0, -0.46]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.9, 0.9]} />
          <meshLambertMaterial color={colorToHex[colors.back]} />
        </mesh>
      )}
    </group>
  );
};

const CubeGeometry: React.FC<{ cubeState: CubeState }> = ({ cubeState }) => {
  // Get the color for a specific sticker on a face
  const getColor = (face: number, row: number, col: number): Color => {
    const index = face * 9 + row * 3 + col;
    return cubeState.stickers[index];
  };

  const cubies = [];
  
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        // Skip the core
        if (x === 0 && y === 0 && z === 0) continue;
        
        const colors: CubieProps['colors'] = {};
        
        // Map positions to face indices
        if (y === 1) colors.top = getColor(0, z + 1, x + 1);      // U face
        if (x === 1) colors.right = getColor(1, 1 - y, z + 1);    // R face
        if (z === 1) colors.front = getColor(2, 1 - y, x + 1);    // F face
        if (y === -1) colors.bottom = getColor(3, 1 - z, x + 1);  // D face
        if (x === -1) colors.left = getColor(4, 1 - y, 1 - z);    // L face
        if (z === -1) colors.back = getColor(5, 1 - y, 1 - x);    // B face
        
        cubies.push(
          <Cubie
            key={`${x},${y},${z}`}
            position={[x, y, z]}
            colors={colors}
          />
        );
      }
    }
  }

  return <>{cubies}</>;
};

export const Cube3D: React.FC<Cube3DProps> = ({ cubeState }) => {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-5, -5, -5]} intensity={0.3} />
        <CubeGeometry cubeState={cubeState} />
        <OrbitControls enablePan={false} minDistance={3} maxDistance={10} />
      </Canvas>
    </div>
  );
};