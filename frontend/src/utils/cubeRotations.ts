import * as CubeTypes from '../types/cube';
import { getGlobalIndex } from './cubeMapping';
import { rotateFaceWithIds } from './rotationHelper';

type CubeState = CubeTypes.CubeState;
type Face = 'U' | 'D' | 'L' | 'R' | 'F' | 'B';

const g = getGlobalIndex;

/**
 * 面回転の定義
 * face: 回転する面
 * cycles: 3つの4要素循環置換（グローバルインデックス）
 *   cycle[i] の値が cycle[(i+1) % 4] の位置に移動する
 */
interface RotationDef {
  face: Face;
  cycles: [number, number, number, number][];
}

/**
 * 全6面の回転定義
 * 各回転は「面自体の時計回り回転」+「隣接3ステッカー×4面の循環置換」で構成
 */
const ROTATION_DEFS: Record<string, RotationDef> = {
  R: {
    face: 'R',
    cycles: [
      [g('U', 2), g('B', 6), g('D', 2), g('F', 2)],
      [g('U', 5), g('B', 3), g('D', 5), g('F', 5)],
      [g('U', 8), g('B', 0), g('D', 8), g('F', 8)],
    ],
  },
  U: {
    face: 'U',
    cycles: [
      [g('F', 0), g('L', 0), g('B', 0), g('R', 0)],
      [g('F', 1), g('L', 1), g('B', 1), g('R', 1)],
      [g('F', 2), g('L', 2), g('B', 2), g('R', 2)],
    ],
  },
  F: {
    face: 'F',
    cycles: [
      [g('U', 6), g('R', 0), g('D', 2), g('L', 8)],
      [g('U', 7), g('R', 3), g('D', 1), g('L', 5)],
      [g('U', 8), g('R', 6), g('D', 0), g('L', 2)],
    ],
  },
  L: {
    face: 'L',
    cycles: [
      [g('U', 0), g('F', 0), g('D', 0), g('B', 8)],
      [g('U', 3), g('F', 3), g('D', 3), g('B', 5)],
      [g('U', 6), g('F', 6), g('D', 6), g('B', 2)],
    ],
  },
  D: {
    face: 'D',
    cycles: [
      [g('F', 6), g('R', 6), g('B', 6), g('L', 6)],
      [g('F', 7), g('R', 7), g('B', 7), g('L', 7)],
      [g('F', 8), g('R', 8), g('B', 8), g('L', 8)],
    ],
  },
  B: {
    face: 'B',
    cycles: [
      [g('U', 0), g('L', 6), g('D', 8), g('R', 2)],
      [g('U', 1), g('L', 3), g('D', 7), g('R', 5)],
      [g('U', 2), g('L', 0), g('D', 6), g('R', 8)],
    ],
  },
};

/**
 * 汎用回転関数
 * 1. 指定面を時計回りに90度回転
 * 2. 隣接ステッカーの循環置換を実行
 */
const applyRotation = (cubeState: CubeState, def: RotationDef): CubeState => {
  const newStickers = [...cubeState.stickers];
  const newStickerIds = cubeState.stickerIds ? [...cubeState.stickerIds] : undefined;

  // 面を時計回りに回転
  const faceStart = g(def.face, 0);
  const face = newStickers.slice(faceStart, faceStart + 9);
  const faceIds = newStickerIds ? newStickerIds.slice(faceStart, faceStart + 9) : undefined;

  const { rotatedFace, rotatedIds } = rotateFaceWithIds(face, faceIds);

  for (let i = 0; i < 9; i++) {
    newStickers[faceStart + i] = rotatedFace[i];
    if (newStickerIds && rotatedIds) {
      newStickerIds[faceStart + i] = rotatedIds[i];
    }
  }

  // 隣接面の循環置換: cycle[i] → cycle[i+1 mod 4]
  for (const cycle of def.cycles) {
    const [a, b, c, d] = cycle;
    const tempSticker = newStickers[a];
    newStickers[a] = newStickers[d];
    newStickers[d] = newStickers[c];
    newStickers[c] = newStickers[b];
    newStickers[b] = tempSticker;

    if (newStickerIds) {
      const tempId = newStickerIds[a];
      newStickerIds[a] = newStickerIds[d];
      newStickerIds[d] = newStickerIds[c];
      newStickerIds[c] = newStickerIds[b];
      newStickerIds[b] = tempId;
    }
  }

  return { stickers: newStickers, stickerIds: newStickerIds };
};

// 基本回転（時計回り）
export const rotateR = (s: CubeState): CubeState => applyRotation(s, ROTATION_DEFS.R);
export const rotateU = (s: CubeState): CubeState => applyRotation(s, ROTATION_DEFS.U);
export const rotateF = (s: CubeState): CubeState => applyRotation(s, ROTATION_DEFS.F);
export const rotateL = (s: CubeState): CubeState => applyRotation(s, ROTATION_DEFS.L);
export const rotateD = (s: CubeState): CubeState => applyRotation(s, ROTATION_DEFS.D);
export const rotateB = (s: CubeState): CubeState => applyRotation(s, ROTATION_DEFS.B);

// 逆回転（反時計回り = 時計回り×3）
const applyPrime = (s: CubeState, def: RotationDef): CubeState =>
  applyRotation(applyRotation(applyRotation(s, def), def), def);

export const rotateRPrime = (s: CubeState): CubeState => applyPrime(s, ROTATION_DEFS.R);
export const rotateUPrime = (s: CubeState): CubeState => applyPrime(s, ROTATION_DEFS.U);
export const rotateFPrime = (s: CubeState): CubeState => applyPrime(s, ROTATION_DEFS.F);
export const rotateLPrime = (s: CubeState): CubeState => applyPrime(s, ROTATION_DEFS.L);
export const rotateDPrime = (s: CubeState): CubeState => applyPrime(s, ROTATION_DEFS.D);
export const rotateBPrime = (s: CubeState): CubeState => applyPrime(s, ROTATION_DEFS.B);

// 2回転（180度 = 時計回り×2）
export const rotateR2 = (s: CubeState): CubeState => applyRotation(applyRotation(s, ROTATION_DEFS.R), ROTATION_DEFS.R);
export const rotateU2 = (s: CubeState): CubeState => applyRotation(applyRotation(s, ROTATION_DEFS.U), ROTATION_DEFS.U);
export const rotateF2 = (s: CubeState): CubeState => applyRotation(applyRotation(s, ROTATION_DEFS.F), ROTATION_DEFS.F);
export const rotateL2 = (s: CubeState): CubeState => applyRotation(applyRotation(s, ROTATION_DEFS.L), ROTATION_DEFS.L);
export const rotateD2 = (s: CubeState): CubeState => applyRotation(applyRotation(s, ROTATION_DEFS.D), ROTATION_DEFS.D);
export const rotateB2 = (s: CubeState): CubeState => applyRotation(applyRotation(s, ROTATION_DEFS.B), ROTATION_DEFS.B);

/**
 * 手順文字列から対応する回転関数を取得
 */
const MOVE_MAP: Record<string, (state: CubeState) => CubeState> = {
  'R': rotateR, "R'": rotateRPrime, 'R2': rotateR2,
  'U': rotateU, "U'": rotateUPrime, 'U2': rotateU2,
  'F': rotateF, "F'": rotateFPrime, 'F2': rotateF2,
  'L': rotateL, "L'": rotateLPrime, 'L2': rotateL2,
  'D': rotateD, "D'": rotateDPrime, 'D2': rotateD2,
  'B': rotateB, "B'": rotateBPrime, 'B2': rotateB2,
};

export const getMoveFunction = (move: string): ((state: CubeState) => CubeState) | null => {
  return MOVE_MAP[move] || null;
};
