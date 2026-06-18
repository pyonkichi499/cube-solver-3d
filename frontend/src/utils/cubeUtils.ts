import * as CubeTypes from '../types/cube';
import { getMoveFunction } from './cubeRotations';

type CubeState = CubeTypes.CubeState;
type Color = CubeTypes.Color;
type Face = CubeTypes.Face;

// Create a solved cube state
export const createSolvedCube = (): CubeState => {
  const faces: Face[] = ['U', 'F', 'L', 'B', 'R', 'D'];
  const stickers: Color[] = [];
  const stickerIds: number[] = [];
  
  // Each face has 9 stickers in a 3x3 grid
  faces.forEach((face, faceIndex) => {
    const color = CubeTypes.faceToColor(face);
    for (let i = 0; i < 9; i++) {
      stickers.push(color);
      stickerIds.push(faceIndex * 9 + i);
    }
  });
  
  return { stickers, stickerIds };
};

// Convert cube state to API format (string of face letters)
// Backend expects order: U(9) R(9) F(9) D(9) L(9) B(9)
// Frontend stores in order: U(0-8) F(9-17) L(18-26) B(27-35) R(36-44) D(45-53)
export const cubeStateToString = (cubeState: CubeState): string => {
  const colorToFace: Record<Color, string> = {
    'white': 'U',
    'yellow': 'D',
    'orange': 'L',
    'red': 'R',
    'green': 'F',
    'blue': 'B'
  };
  
  // Reorder stickers to match backend expected format
  const reorderedStickers: Color[] = [];
  
  // U face (indices 0-8)
  for (let i = 0; i < 9; i++) {
    reorderedStickers.push(cubeState.stickers[i]);
  }
  
  // R face (indices 36-44)
  for (let i = 36; i < 45; i++) {
    reorderedStickers.push(cubeState.stickers[i]);
  }
  
  // F face (indices 9-17)
  for (let i = 9; i < 18; i++) {
    reorderedStickers.push(cubeState.stickers[i]);
  }
  
  // D face (indices 45-53)
  for (let i = 45; i < 54; i++) {
    reorderedStickers.push(cubeState.stickers[i]);
  }
  
  // L face (indices 18-26)
  for (let i = 18; i < 27; i++) {
    reorderedStickers.push(cubeState.stickers[i]);
  }
  
  // B face (indices 27-35)
  for (let i = 27; i < 36; i++) {
    reorderedStickers.push(cubeState.stickers[i]);
  }
  
  return reorderedStickers.map(color => colorToFace[color]).join('');
};

// Parse API format string (URFDLB order) to cube state (UFLBRD order)
// This is the inverse of cubeStateToString()
export const stringToCubeState = (stateString: string): CubeState => {
  if (stateString.length !== 54) {
    throw new Error(`Invalid cube state string length: ${stateString.length} (expected 54)`);
  }

  const apiStickers: Color[] = stateString.split('').map(face => CubeTypes.faceToColor(face));

  // Reorder from API format (URFDLB) to frontend format (UFLBRD)
  // API:      U(0-8)  R(9-17)  F(18-26) D(27-35) L(36-44) B(45-53)
  // Frontend: U(0-8)  F(9-17)  L(18-26) B(27-35) R(36-44) D(45-53)
  const stickers: Color[] = [
    ...apiStickers.slice(0, 9),    // U <- API U (0-8)
    ...apiStickers.slice(18, 27),  // F <- API F (18-26)
    ...apiStickers.slice(36, 45),  // L <- API L (36-44)
    ...apiStickers.slice(45, 54),  // B <- API B (45-53)
    ...apiStickers.slice(9, 18),   // R <- API R (9-17)
    ...apiStickers.slice(27, 36),  // D <- API D (27-35)
  ];

  const stickerIds = Array.from({ length: stickers.length }, (_, i) => i);
  return { stickers, stickerIds };
};

// Apply a move to the cube state
export const applyMove = (cubeState: CubeState, move: string): CubeState => {
  const moveFunction = getMoveFunction(move);
  if (!moveFunction) {
    if (import.meta.env.DEV) console.warn(`Unknown move: ${move}`);
    return cubeState;
  }
  
  if (import.meta.env.DEV) console.log(`Applying move: ${move}`);
  return moveFunction(cubeState);
};

// Apply multiple moves
export const applyMoves = (cubeState: CubeState, moves: string[]): CubeState => {
  return moves.reduce((state, move) => applyMove(state, move), cubeState);
};