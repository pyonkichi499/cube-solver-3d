/**
 * キューブの状態表現とステッカーマッピングの定義
 * 
 * キューブ状態は54文字の文字列で表現される：
 * UUUUUUUUUFFFFFFFFFLLLLLLLLLBBBBBBBBBRRRRRRRRRDDDDDDDDD
 * 
 * 各面は9個のステッカーを持ち、以下の順序で格納される：
 * 0 1 2
 * 3 4 5
 * 6 7 8
 */

export interface CubiePosition {
  x: number; // -1, 0, 1
  y: number; // -1, 0, 1  
  z: number; // -1, 0, 1
}

export interface StickerInfo {
  face: 'U' | 'R' | 'F' | 'D' | 'L' | 'B';
  position: number; // 0-8 (面内での位置)
  globalIndex: number; // 0-53 (全体での位置)
}

// 面のインデックス定義 (UFLBRD順)
export const FACE_INDICES = {
  U: 0,  // Up (0-8)
  F: 1,  // Front (9-17)
  L: 2,  // Left (18-26)
  B: 3,  // Back (27-35)
  R: 4,  // Right (36-44)
  D: 5   // Down (45-53)
} as const;

// グローバルインデックスを取得
export const getGlobalIndex = (face: keyof typeof FACE_INDICES, position: number): number => {
  return FACE_INDICES[face] * 9 + position;
};

// グローバルインデックスから面と位置を取得
export const getFaceAndPosition = (globalIndex: number): { face: keyof typeof FACE_INDICES; position: number } => {
  const faceIndex = Math.floor(globalIndex / 9);
  const position = globalIndex % 9;
  // UFLBRD順
  const faceOrder: Array<keyof typeof FACE_INDICES> = ['U', 'F', 'L', 'B', 'R', 'D'];
  return { face: faceOrder[faceIndex], position };
};

/**
 * 3D位置から表示されるステッカーを取得
 * 
 * キューブの座標系：
 * - X軸: 左(-1) → 右(+1)
 * - Y軸: 下(-1) → 上(+1) 
 * - Z軸: 奥(-1) → 手前(+1)
 */
export const getVisibleStickers = (cubiePos: CubiePosition): StickerInfo[] => {
  const stickers: StickerInfo[] = [];
  const { x, y, z } = cubiePos;

  // U面 (上面) y = 1
  if (y === 1) {
    // U面の座標系: スピードキューブ標準（F面が下）
    // 左上(0)から右下(8)の順番
    // z=-1(B側)が上段、z=1(F側)が下段
    const position = (z + 1) * 3 + (x + 1);
    stickers.push({
      face: 'U',
      position,
      globalIndex: getGlobalIndex('U', position)
    });
  }

  // D面 (下面) y = -1
  if (y === -1) {
    // D面の座標系: スピードキューブ標準（F面が上）
    // 左上(0)から右下(8)の順番
    // z=1(F側)が上段、z=-1(B側)が下段
    const position = (1 - z) * 3 + (x + 1);
    stickers.push({
      face: 'D',
      position,
      globalIndex: getGlobalIndex('D', position)
    });
  }

  // R面 (右面) x = 1
  if (x === 1) {
    // R面の座標系: 右面を正面から見て
    // 上から下、左から右（F側が左、B側が右）
    const position = (1 - y) * 3 + (1 - z);
    stickers.push({
      face: 'R',
      position,
      globalIndex: getGlobalIndex('R', position)
    });
  }

  // L面 (左面) x = -1
  if (x === -1) {
    // L面の座標系: 左面を正面から見て
    // 上から下、手前から奥（左上0から右下8）
    const position = (1 - y) * 3 + (z + 1);
    stickers.push({
      face: 'L',
      position,
      globalIndex: getGlobalIndex('L', position)
    });
  }

  // F面 (前面) z = 1
  if (z === 1) {
    // F面の座標系: 上から下、左から右
    const position = (1 - y) * 3 + (x + 1);
    stickers.push({
      face: 'F',
      position,
      globalIndex: getGlobalIndex('F', position)
    });
  }

  // B面 (背面) z = -1
  if (z === -1) {
    // B面の座標系: 上から下、右から左（B面を正面から見た場合）
    // 左上(0)から右下(8)の順番
    const position = (1 - y) * 3 + (1 - x);
    stickers.push({
      face: 'B',
      position,
      globalIndex: getGlobalIndex('B', position)
    });
  }

  return stickers;
};

/**
 * デバッグ用: キューブ状態を視覚的に表示
 */
export const visualizeCubeState = (stickers: string[]): string => {
  const lines: string[] = [];
  
  // U面
  lines.push('      U U U');
  lines.push('      U U U');
  lines.push('      U U U');
  lines.push('L L L F F F R R R B B B');
  lines.push('L L L F F F R R R B B B');
  lines.push('L L L F F F R R R B B B');
  lines.push('      D D D');
  lines.push('      D D D');
  lines.push('      D D D');

  // 実際の色を置換 (FACE_INDICESに基づくUFLBRD順)
  const faceSlice = (face: keyof typeof FACE_INDICES): string => {
    const start = FACE_INDICES[face] * 9;
    return stickers.slice(start, start + 9).join(' ').replace(/ /g, '');
  };
  const result = lines.join('\n')
    .replace(/U/g, faceSlice('U'))
    .replace(/F/g, faceSlice('F'))
    .replace(/L/g, faceSlice('L'))
    .replace(/B/g, faceSlice('B'))
    .replace(/R/g, faceSlice('R'))
    .replace(/D/g, faceSlice('D'));

  return result;
};