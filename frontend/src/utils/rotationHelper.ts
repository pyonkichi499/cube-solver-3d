import * as CubeTypes from '../types/cube';

type CubeState = CubeTypes.CubeState;
type Color = CubeTypes.Color;

/**
 * 配列の要素を指定したインデックスで移動する
 */
export const moveElements = <T>(
  source: T[],
  sourceIndices: number[],
  target: T[],
  targetIndices: number[]
): void => {
  const temp = sourceIndices.map(i => source[i]);
  targetIndices.forEach((targetIndex, i) => {
    target[targetIndex] = temp[i];
  });
};

/**
 * ステッカーとIDを同時に移動する
 */
export const moveStickersWithIds = (
  cubeState: CubeState,
  moves: Array<{ from: number; to: number }>
): CubeState => {
  const newStickers = [...cubeState.stickers];
  const newStickerIds = cubeState.stickerIds ? [...cubeState.stickerIds] : undefined;
  
  // 一時保存用
  const tempStickers = moves.map(m => cubeState.stickers[m.from]);
  const tempIds = newStickerIds ? moves.map(m => newStickerIds[m.from]) : undefined;
  
  // 移動実行
  moves.forEach((move, index) => {
    newStickers[move.to] = tempStickers[index];
    if (newStickerIds && tempIds) {
      newStickerIds[move.to] = tempIds[index];
    }
  });
  
  return {
    stickers: newStickers,
    stickerIds: newStickerIds
  };
};

/**
 * 面を時計回りに90度回転（色とIDの両方）
 * スピードキューブ標準：F面が下、B面が上として見る
 */
export const rotateFaceWithIds = (
  face: Color[], 
  faceIds?: number[]
): { rotatedFace: Color[]; rotatedIds?: number[] } => {
  if (face.length !== 9) {
    throw new Error('Face must have exactly 9 stickers');
  }
  
  // 時計回り90度回転
  // 元の位置:     回転後:
  // 0 1 2        6 3 0
  // 3 4 5   →    7 4 1
  // 6 7 8        8 5 2
  const rotatedFace = [
    face[6], face[3], face[0], // 新しい上段
    face[7], face[4], face[1], // 新しい中段
    face[8], face[5], face[2]  // 新しい下段
  ];
  
  let rotatedIds: number[] | undefined;
  if (faceIds) {
    rotatedIds = [
      faceIds[6], faceIds[3], faceIds[0],
      faceIds[7], faceIds[4], faceIds[1],
      faceIds[8], faceIds[5], faceIds[2]
    ];
  }
  
  return { rotatedFace, rotatedIds };
};