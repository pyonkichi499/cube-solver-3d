import * as CubeTypes from '../types/cube';
import { getGlobalIndex } from './cubeMapping';

type CubeState = CubeTypes.CubeState;

/**
 * U回転の詳細なデバッグ情報を出力
 */
export const debugURotationDetailed = (cubeState: CubeState) => {
  console.log('=== U回転の詳細デバッグ ===');
  
  // U面の回転前の状態
  console.log('\n【U面の状態】');
  for (let i = 0; i < 9; i++) {
    console.log(`位置 ${i}: ${cubeState.stickers[i]}`);
  }
  
  // 影響を受ける各面の上段
  console.log('\n【影響を受ける面の上段】');
  
  // F面の上段 (0, 1, 2)
  console.log('F面の上段:');
  console.log(`  位置18 (F0): ${cubeState.stickers[18]}`);
  console.log(`  位置19 (F1): ${cubeState.stickers[19]}`);
  console.log(`  位置20 (F2): ${cubeState.stickers[20]}`);
  
  // R面の上段 (0, 1, 2)
  console.log('R面の上段:');
  console.log(`  位置9 (R0): ${cubeState.stickers[9]}`);
  console.log(`  位置10 (R1): ${cubeState.stickers[10]}`);
  console.log(`  位置11 (R2): ${cubeState.stickers[11]}`);
  
  // B面の上段 (0, 1, 2)
  console.log('B面の上段:');
  console.log(`  位置45 (B0): ${cubeState.stickers[45]}`);
  console.log(`  位置46 (B1): ${cubeState.stickers[46]}`);
  console.log(`  位置47 (B2): ${cubeState.stickers[47]}`);
  
  // L面の上段 (0, 1, 2)
  console.log('L面の上段:');
  console.log(`  位置36 (L0): ${cubeState.stickers[36]}`);
  console.log(`  位置37 (L1): ${cubeState.stickers[37]}`);
  console.log(`  位置38 (L2): ${cubeState.stickers[38]}`);
  
  console.log('\n期待される移動:');
  console.log('F → R → B → L → F');
};

/**
 * 特定のエッジピースを追跡
 */
export const trackEdgePiece = (cubeState: CubeState, edgeName: string) => {
  const edges: Record<string, { sticker1: number, sticker2: number }> = {
    'UF': { sticker1: 7, sticker2: 19 },  // U7, F1
    'UR': { sticker1: 5, sticker2: 10 },  // U5, R1
    'UB': { sticker1: 1, sticker2: 46 },  // U1, B1
    'UL': { sticker1: 3, sticker2: 37 },  // U3, L1
  };
  
  const edge = edges[edgeName];
  if (!edge) {
    console.log(`Unknown edge: ${edgeName}`);
    return;
  }
  
  console.log(`\n${edgeName}エッジの状態:`);
  console.log(`  ステッカー1 (位置${edge.sticker1}): ${cubeState.stickers[edge.sticker1]}`);
  console.log(`  ステッカー2 (位置${edge.sticker2}): ${cubeState.stickers[edge.sticker2]}`);
};

// ブラウザコンソールで使用可能にする
(window as any).debugURotationDetailed = debugURotationDetailed;
(window as any).trackEdgePiece = trackEdgePiece;