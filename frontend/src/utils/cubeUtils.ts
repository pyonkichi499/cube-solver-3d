import * as CubeTypes from '../types/cube';

type CubeState = CubeTypes.CubeState;
type Color = CubeTypes.Color;
type Face = CubeTypes.Face;

// Create a solved cube state
export const createSolvedCube = (): CubeState => {
  const faces: Face[] = ['U', 'R', 'F', 'D', 'L', 'B'];
  const stickers: Color[] = [];
  
  // Each face has 9 stickers in a 3x3 grid
  faces.forEach(face => {
    const color = CubeTypes.faceToColor(face);
    for (let i = 0; i < 9; i++) {
      stickers.push(color);
    }
  });
  
  return { stickers };
};

// Convert cube state to API format (string of face letters)
export const cubeStateToString = (cubeState: CubeState): string => {
  return cubeState.stickers.map(color => {
    const faceMap: Record<Color, string> = {
      'white': 'U',
      'yellow': 'D',
      'orange': 'L',
      'red': 'R',
      'green': 'F',
      'blue': 'B'
    };
    return faceMap[color];
  }).join('');
};

// Parse API format string to cube state
export const stringToCubeState = (stateString: string): CubeState => {
  const stickers: Color[] = stateString.split('').map(face => CubeTypes.faceToColor(face));
  return { stickers };
};

// Apply a move to the cube state (simplified version)
export const applyMove = (cubeState: CubeState, move: string): CubeState => {
  // This is a placeholder - implementing cube rotations is complex
  // For now, return the same state
  console.log(`Applying move: ${move}`);
  return { ...cubeState };
};

// Apply multiple moves
export const applyMoves = (cubeState: CubeState, moves: string[]): CubeState => {
  return moves.reduce((state, move) => applyMove(state, move), cubeState);
};