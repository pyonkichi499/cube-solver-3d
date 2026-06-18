export type Face = 'U' | 'D' | 'L' | 'R' | 'F' | 'B';
export type Color = 'white' | 'yellow' | 'orange' | 'red' | 'green' | 'blue';
export type MoveNotation = string; // e.g., "R", "R'", "R2"

export interface CubeState {
  // 3x3x3 cube has 54 stickers (9 per face)
  // Stored as a flat array in the order: UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB
  stickers: Color[];
  // デバッグ用：各ステッカーの元の位置を追跡（0-53の番号）
  stickerIds?: number[];
}

export interface CubeConfig {
  size: number; // 3 for 3x3x3
  colors: {
    U: Color; // Up - white
    D: Color; // Down - yellow
    L: Color; // Left - orange
    R: Color; // Right - red
    F: Color; // Front - green
    B: Color; // Back - blue
  };
}

export const DEFAULT_COLORS: CubeConfig['colors'] = {
  U: 'white',
  D: 'yellow',
  L: 'orange',
  R: 'red',
  F: 'green',
  B: 'blue'
};

// Convert face letter to color
export const faceToColor = (face: string): Color => {
  const mapping: Record<string, Color> = {
    'U': 'white',
    'D': 'yellow',
    'L': 'orange',
    'R': 'red',
    'F': 'green',
    'B': 'blue'
  };
  return mapping[face] || 'white';
};

// Convert color to face letter
export const colorToFace = (color: Color): Face => {
  const mapping: Record<Color, Face> = {
    'white': 'U',
    'yellow': 'D',
    'orange': 'L',
    'red': 'R',
    'green': 'F',
    'blue': 'B'
  };
  return mapping[color];
};

// Color to hex mapping for 3D rendering
export const COLOR_TO_HEX: Record<Color, string> = {
  'white': '#FFFFFF',
  'yellow': '#FFD500',
  'orange': '#FF6B00',
  'red': '#C41E3A',
  'green': '#009E60',
  'blue': '#0051BA',
};

// Color to emoji mapping for debug panels
export const COLOR_EMOJI: Record<Color, string> = {
  'white': '⬜',
  'yellow': '🟨',
  'orange': '🟧',
  'red': '🟥',
  'green': '🟩',
  'blue': '🟦',
};

// Face display names
export const FACE_NAMES: Record<Face, string> = {
  'U': 'Up (白)',
  'D': 'Down (黄)',
  'F': 'Front (緑)',
  'B': 'Back (青)',
  'L': 'Left (橙)',
  'R': 'Right (赤)',
};