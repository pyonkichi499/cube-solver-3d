import * as CubeTypes from '../types/cube';
import { getGlobalIndex } from './cubeMapping';
import { rotateFaceWithIds } from './rotationHelper';

type CubeState = CubeTypes.CubeState;
type Color = CubeTypes.Color;

/**
 * 面を時計回りに90度回転させる
 * 
 * 元の位置:     回転後の位置:
 * 0 1 2        6 3 0
 * 3 4 5   →    7 4 1
 * 6 7 8        8 5 2
 */
const rotateFaceClockwise = (face: Color[]): Color[] => {
  if (face.length !== 9) {
    throw new Error('Face must have exactly 9 stickers');
  }
  
  return [
    face[6], face[3], face[0], // 新しい上段
    face[7], face[4], face[1], // 新しい中段 
    face[8], face[5], face[2]  // 新しい下段
  ];
};

/**
 * 面を反時計回りに90度回転させる
 */
const rotateFaceCounterClockwise = (face: Color[]): Color[] => {
  if (face.length !== 9) {
    throw new Error('Face must have exactly 9 stickers');
  }
  
  return [
    face[2], face[5], face[8], // 新しい上段
    face[1], face[4], face[7], // 新しい中段
    face[0], face[3], face[6]  // 新しい下段
  ];
};

/**
 * R回転 (右面を時計回りに90度回転)
 * 右面を外側から見て時計回り
 * 
 * 影響を受ける面:
 * - R面: 時計回りに回転
 * - U面の右列 → B面の左列 (逆順)
 * - B面の左列 → D面の右列 (逆順)  
 * - D面の右列 → F面の右列
 * - F面の右列 → U面の右列
 */
export const rotateR = (cubeState: CubeState): CubeState => {
  const newStickers = [...cubeState.stickers];
  const newStickerIds = cubeState.stickerIds ? [...cubeState.stickerIds] : undefined;
  
  // R面を時計回りに回転
  const rFaceStart = getGlobalIndex('R', 0);
  const rFace = newStickers.slice(rFaceStart, rFaceStart + 9);
  const rFaceIds = newStickerIds ? newStickerIds.slice(rFaceStart, rFaceStart + 9) : undefined;
  
  const { rotatedFace, rotatedIds } = rotateFaceWithIds(rFace, rFaceIds);
  
  for (let i = 0; i < 9; i++) {
    newStickers[rFaceStart + i] = rotatedFace[i];
    if (newStickerIds && rotatedIds) {
      newStickerIds[rFaceStart + i] = rotatedIds[i];
    }
  }
  
  // 隣接面のステッカー移動
  // 循環移動のため、一時保存が必要
  const u2 = newStickers[getGlobalIndex('U', 2)];
  const u5 = newStickers[getGlobalIndex('U', 5)];
  const u8 = newStickers[getGlobalIndex('U', 8)];
  
  const b0 = newStickers[getGlobalIndex('B', 0)];
  const b3 = newStickers[getGlobalIndex('B', 3)];
  const b6 = newStickers[getGlobalIndex('B', 6)];
  
  const d2 = newStickers[getGlobalIndex('D', 2)];
  const d5 = newStickers[getGlobalIndex('D', 5)];
  const d8 = newStickers[getGlobalIndex('D', 8)];
  
  const f2 = newStickers[getGlobalIndex('F', 2)];
  const f5 = newStickers[getGlobalIndex('F', 5)];
  const f8 = newStickers[getGlobalIndex('F', 8)];
  
  // IDの一時保存
  let u2Id: number | undefined, u5Id: number | undefined, u8Id: number | undefined;
  let b0Id: number | undefined, b3Id: number | undefined, b6Id: number | undefined;
  let d2Id: number | undefined, d5Id: number | undefined, d8Id: number | undefined;
  let f2Id: number | undefined, f5Id: number | undefined, f8Id: number | undefined;
  
  if (newStickerIds) {
    u2Id = newStickerIds[getGlobalIndex('U', 2)];
    u5Id = newStickerIds[getGlobalIndex('U', 5)];
    u8Id = newStickerIds[getGlobalIndex('U', 8)];
    
    b0Id = newStickerIds[getGlobalIndex('B', 0)];
    b3Id = newStickerIds[getGlobalIndex('B', 3)];
    b6Id = newStickerIds[getGlobalIndex('B', 6)];
    
    d2Id = newStickerIds[getGlobalIndex('D', 2)];
    d5Id = newStickerIds[getGlobalIndex('D', 5)];
    d8Id = newStickerIds[getGlobalIndex('D', 8)];
    
    f2Id = newStickerIds[getGlobalIndex('F', 2)];
    f5Id = newStickerIds[getGlobalIndex('F', 5)];
    f8Id = newStickerIds[getGlobalIndex('F', 8)];
  }
  
  // 循環移動: U → B (逆順) → D (逆順) → F → U
  // U面の右列 → B面の左列 (逆順)
  newStickers[getGlobalIndex('B', 6)] = u2;
  newStickers[getGlobalIndex('B', 3)] = u5;
  newStickers[getGlobalIndex('B', 0)] = u8;
  
  // B面の左列 → D面の右列 (逆順)
  newStickers[getGlobalIndex('D', 2)] = b6;
  newStickers[getGlobalIndex('D', 5)] = b3;
  newStickers[getGlobalIndex('D', 8)] = b0;
  
  // D面の右列 → F面の右列
  newStickers[getGlobalIndex('F', 2)] = d2;
  newStickers[getGlobalIndex('F', 5)] = d5;
  newStickers[getGlobalIndex('F', 8)] = d8;
  
  // F面の右列 → U面の右列
  newStickers[getGlobalIndex('U', 2)] = f2;
  newStickers[getGlobalIndex('U', 5)] = f5;
  newStickers[getGlobalIndex('U', 8)] = f8;
  
  // IDの循環移動
  if (newStickerIds) {
    // U面の右列 → B面の左列 (逆順)
    newStickerIds[getGlobalIndex('B', 6)] = u2Id!;
    newStickerIds[getGlobalIndex('B', 3)] = u5Id!;
    newStickerIds[getGlobalIndex('B', 0)] = u8Id!;
    
    // B面の左列 → D面の右列 (逆順)
    newStickerIds[getGlobalIndex('D', 2)] = b6Id!;
    newStickerIds[getGlobalIndex('D', 5)] = b3Id!;
    newStickerIds[getGlobalIndex('D', 8)] = b0Id!;
    
    // D面の右列 → F面の右列
    newStickerIds[getGlobalIndex('F', 2)] = d2Id!;
    newStickerIds[getGlobalIndex('F', 5)] = d5Id!;
    newStickerIds[getGlobalIndex('F', 8)] = d8Id!;
    
    // F面の右列 → U面の右列
    newStickerIds[getGlobalIndex('U', 2)] = f2Id!;
    newStickerIds[getGlobalIndex('U', 5)] = f5Id!;
    newStickerIds[getGlobalIndex('U', 8)] = f8Id!;
  }
  
  return { stickers: newStickers, stickerIds: newStickerIds };
};

/**
 * U回転 (上面を時計回りに90度回転)
 * 上面を上から見て時計回り
 * 
 * 影響を受ける面:
 * - U面: 時計回りに回転
 * - F面の上段 → L面の上段
 * - L面の上段 → B面の上段
 * - B面の上段 → R面の上段
 * - R面の上段 → F面の上段
 */
export const rotateU = (cubeState: CubeState): CubeState => {
  const newStickers = [...cubeState.stickers];
  const newStickerIds = cubeState.stickerIds ? [...cubeState.stickerIds] : undefined;
  
  // U面を時計回りに回転
  const uFaceStart = getGlobalIndex('U', 0);
  const uFace = newStickers.slice(uFaceStart, uFaceStart + 9);
  const uFaceIds = newStickerIds ? newStickerIds.slice(uFaceStart, uFaceStart + 9) : undefined;
  
  const { rotatedFace, rotatedIds } = rotateFaceWithIds(uFace, uFaceIds);
  
  for (let i = 0; i < 9; i++) {
    newStickers[uFaceStart + i] = rotatedFace[i];
    if (newStickerIds && rotatedIds) {
      newStickerIds[uFaceStart + i] = rotatedIds[i];
    }
  }
  
  // 隣接面のステッカー移動
  // 循環移動のため、一時保存が必要
  const f0 = newStickers[getGlobalIndex('F', 0)];
  const f1 = newStickers[getGlobalIndex('F', 1)];
  const f2 = newStickers[getGlobalIndex('F', 2)];
  
  const r0 = newStickers[getGlobalIndex('R', 0)];
  const r1 = newStickers[getGlobalIndex('R', 1)];
  const r2 = newStickers[getGlobalIndex('R', 2)];
  
  const b0 = newStickers[getGlobalIndex('B', 0)];
  const b1 = newStickers[getGlobalIndex('B', 1)];
  const b2 = newStickers[getGlobalIndex('B', 2)];
  
  const l0 = newStickers[getGlobalIndex('L', 0)];
  const l1 = newStickers[getGlobalIndex('L', 1)];
  const l2 = newStickers[getGlobalIndex('L', 2)];
  
  // IDの一時保存
  let f0Id: number | undefined, f1Id: number | undefined, f2Id: number | undefined;
  let r0Id: number | undefined, r1Id: number | undefined, r2Id: number | undefined;
  let b0Id: number | undefined, b1Id: number | undefined, b2Id: number | undefined;
  let l0Id: number | undefined, l1Id: number | undefined, l2Id: number | undefined;
  
  if (newStickerIds) {
    f0Id = newStickerIds[getGlobalIndex('F', 0)];
    f1Id = newStickerIds[getGlobalIndex('F', 1)];
    f2Id = newStickerIds[getGlobalIndex('F', 2)];
    
    r0Id = newStickerIds[getGlobalIndex('R', 0)];
    r1Id = newStickerIds[getGlobalIndex('R', 1)];
    r2Id = newStickerIds[getGlobalIndex('R', 2)];
    
    b0Id = newStickerIds[getGlobalIndex('B', 0)];
    b1Id = newStickerIds[getGlobalIndex('B', 1)];
    b2Id = newStickerIds[getGlobalIndex('B', 2)];
    
    l0Id = newStickerIds[getGlobalIndex('L', 0)];
    l1Id = newStickerIds[getGlobalIndex('L', 1)];
    l2Id = newStickerIds[getGlobalIndex('L', 2)];
  }
  
  // 循環移動: F → L → B → R → F (時計回り)
  // F面の上段 → L面の上段
  newStickers[getGlobalIndex('L', 0)] = f0;
  newStickers[getGlobalIndex('L', 1)] = f1;
  newStickers[getGlobalIndex('L', 2)] = f2;
  
  // L面の上段 → B面の上段
  newStickers[getGlobalIndex('B', 0)] = l0;
  newStickers[getGlobalIndex('B', 1)] = l1;
  newStickers[getGlobalIndex('B', 2)] = l2;
  
  // B面の上段 → R面の上段
  newStickers[getGlobalIndex('R', 0)] = b0;
  newStickers[getGlobalIndex('R', 1)] = b1;
  newStickers[getGlobalIndex('R', 2)] = b2;
  
  // R面の上段 → F面の上段
  newStickers[getGlobalIndex('F', 0)] = r0;
  newStickers[getGlobalIndex('F', 1)] = r1;
  newStickers[getGlobalIndex('F', 2)] = r2;
  
  // IDの循環移動
  if (newStickerIds) {
    // F面の上段 → L面の上段
    newStickerIds[getGlobalIndex('L', 0)] = f0Id!;
    newStickerIds[getGlobalIndex('L', 1)] = f1Id!;
    newStickerIds[getGlobalIndex('L', 2)] = f2Id!;
    
    // L面の上段 → B面の上段
    newStickerIds[getGlobalIndex('B', 0)] = l0Id!;
    newStickerIds[getGlobalIndex('B', 1)] = l1Id!;
    newStickerIds[getGlobalIndex('B', 2)] = l2Id!;
    
    // B面の上段 → R面の上段
    newStickerIds[getGlobalIndex('R', 0)] = b0Id!;
    newStickerIds[getGlobalIndex('R', 1)] = b1Id!;
    newStickerIds[getGlobalIndex('R', 2)] = b2Id!;
    
    // R面の上段 → F面の上段
    newStickerIds[getGlobalIndex('F', 0)] = r0Id!;
    newStickerIds[getGlobalIndex('F', 1)] = r1Id!;
    newStickerIds[getGlobalIndex('F', 2)] = r2Id!;
  }
  
  return { stickers: newStickers, stickerIds: newStickerIds };
};

/**
 * F回転 (前面を時計回りに90度回転)
 * 前面を正面から見て時計回り
 * 
 * 影響を受ける面:
 * - F面: 時計回りに回転
 * - U面の下段 → R面の左列
 * - R面の左列 → D面の上段
 * - D面の上段 → L面の右列
 * - L面の右列 → U面の下段
 */
export const rotateF = (cubeState: CubeState): CubeState => {
  const newStickers = [...cubeState.stickers];
  const newStickerIds = cubeState.stickerIds ? [...cubeState.stickerIds] : undefined;
  
  // F面を時計回りに回転
  const fFaceStart = getGlobalIndex('F', 0);
  const fFace = newStickers.slice(fFaceStart, fFaceStart + 9);
  const fFaceIds = newStickerIds ? newStickerIds.slice(fFaceStart, fFaceStart + 9) : undefined;
  
  const { rotatedFace, rotatedIds } = rotateFaceWithIds(fFace, fFaceIds);
  
  for (let i = 0; i < 9; i++) {
    newStickers[fFaceStart + i] = rotatedFace[i];
    if (newStickerIds && rotatedIds) {
      newStickerIds[fFaceStart + i] = rotatedIds[i];
    }
  }
  
  // 隣接面のステッカー移動
  // 循環移動のため、一時保存が必要
  const u6 = newStickers[getGlobalIndex('U', 6)];
  const u7 = newStickers[getGlobalIndex('U', 7)];
  const u8 = newStickers[getGlobalIndex('U', 8)];
  
  const r0 = newStickers[getGlobalIndex('R', 0)];
  const r3 = newStickers[getGlobalIndex('R', 3)];
  const r6 = newStickers[getGlobalIndex('R', 6)];
  
  const d0 = newStickers[getGlobalIndex('D', 0)];
  const d1 = newStickers[getGlobalIndex('D', 1)];
  const d2 = newStickers[getGlobalIndex('D', 2)];
  
  const l2 = newStickers[getGlobalIndex('L', 2)];
  const l5 = newStickers[getGlobalIndex('L', 5)];
  const l8 = newStickers[getGlobalIndex('L', 8)];
  
  // IDの一時保存
  let u6Id: number | undefined, u7Id: number | undefined, u8Id: number | undefined;
  let r0Id: number | undefined, r3Id: number | undefined, r6Id: number | undefined;
  let d0Id: number | undefined, d1Id: number | undefined, d2Id: number | undefined;
  let l2Id: number | undefined, l5Id: number | undefined, l8Id: number | undefined;
  
  if (newStickerIds) {
    u6Id = newStickerIds[getGlobalIndex('U', 6)];
    u7Id = newStickerIds[getGlobalIndex('U', 7)];
    u8Id = newStickerIds[getGlobalIndex('U', 8)];
    
    r0Id = newStickerIds[getGlobalIndex('R', 0)];
    r3Id = newStickerIds[getGlobalIndex('R', 3)];
    r6Id = newStickerIds[getGlobalIndex('R', 6)];
    
    d0Id = newStickerIds[getGlobalIndex('D', 0)];
    d1Id = newStickerIds[getGlobalIndex('D', 1)];
    d2Id = newStickerIds[getGlobalIndex('D', 2)];
    
    l2Id = newStickerIds[getGlobalIndex('L', 2)];
    l5Id = newStickerIds[getGlobalIndex('L', 5)];
    l8Id = newStickerIds[getGlobalIndex('L', 8)];
  }
  
  // 循環移動: U → R → D → L → U (時計回り)
  // U面の下段 → R面の左列
  newStickers[getGlobalIndex('R', 0)] = u6;
  newStickers[getGlobalIndex('R', 3)] = u7;
  newStickers[getGlobalIndex('R', 6)] = u8;
  
  // R面の左列 → D面の上段 (逆順)
  newStickers[getGlobalIndex('D', 2)] = r0;
  newStickers[getGlobalIndex('D', 1)] = r3;
  newStickers[getGlobalIndex('D', 0)] = r6;
  
  // D面の上段 → L面の右列
  newStickers[getGlobalIndex('L', 2)] = d0;
  newStickers[getGlobalIndex('L', 5)] = d1;
  newStickers[getGlobalIndex('L', 8)] = d2;
  
  // L面の右列 → U面の下段 (逆順)
  newStickers[getGlobalIndex('U', 8)] = l2;
  newStickers[getGlobalIndex('U', 7)] = l5;
  newStickers[getGlobalIndex('U', 6)] = l8;
  
  // IDの循環移動
  if (newStickerIds) {
    // U面の下段 → R面の左列
    newStickerIds[getGlobalIndex('R', 0)] = u6Id!;
    newStickerIds[getGlobalIndex('R', 3)] = u7Id!;
    newStickerIds[getGlobalIndex('R', 6)] = u8Id!;
    
    // R面の左列 → D面の上段 (逆順)
    newStickerIds[getGlobalIndex('D', 2)] = r0Id!;
    newStickerIds[getGlobalIndex('D', 1)] = r3Id!;
    newStickerIds[getGlobalIndex('D', 0)] = r6Id!;
    
    // D面の上段 → L面の右列
    newStickerIds[getGlobalIndex('L', 2)] = d0Id!;
    newStickerIds[getGlobalIndex('L', 5)] = d1Id!;
    newStickerIds[getGlobalIndex('L', 8)] = d2Id!;
    
    // L面の右列 → U面の下段 (逆順)
    newStickerIds[getGlobalIndex('U', 8)] = l2Id!;
    newStickerIds[getGlobalIndex('U', 7)] = l5Id!;
    newStickerIds[getGlobalIndex('U', 6)] = l8Id!;
  }
  
  return { stickers: newStickers, stickerIds: newStickerIds };
};

/**
 * 逆回転と2回転の実装
 */
export const rotateRPrime = (cubeState: CubeState): CubeState => {
  // R'は R を3回実行と同じ
  let result = cubeState;
  for (let i = 0; i < 3; i++) {
    result = rotateR(result);
  }
  return result;
};

export const rotateUPrime = (cubeState: CubeState): CubeState => {
  let result = cubeState;
  for (let i = 0; i < 3; i++) {
    result = rotateU(result);
  }
  return result;
};

export const rotateFPrime = (cubeState: CubeState): CubeState => {
  let result = cubeState;
  for (let i = 0; i < 3; i++) {
    result = rotateF(result);
  }
  return result;
};

export const rotateR2 = (cubeState: CubeState): CubeState => {
  return rotateR(rotateR(cubeState));
};

export const rotateU2 = (cubeState: CubeState): CubeState => {
  return rotateU(rotateU(cubeState));
};

export const rotateF2 = (cubeState: CubeState): CubeState => {
  return rotateF(rotateF(cubeState));
};

/**
 * 手順文字列から対応する回転関数を取得
 */
export const getMoveFunction = (move: string): ((state: CubeState) => CubeState) | null => {
  const moveMap: Record<string, (state: CubeState) => CubeState> = {
    'R': rotateR,
    "R'": rotateRPrime,
    'R2': rotateR2,
    'U': rotateU,
    "U'": rotateUPrime,
    'U2': rotateU2,
    'F': rotateF,
    "F'": rotateFPrime,
    'F2': rotateF2
  };
  
  return moveMap[move] || null;
};