import * as CubeTypes from '../types/cube';
import { rotateU } from './cubeRotations';
import { createSolvedCube } from './cubeUtils';

type CubeState = CubeTypes.CubeState;

export const debugUFaceRotation = () => {
  console.log('=== U面の回転デバッグ ===');
  
  // 初期状態
  const cube = createSolvedCube();
  console.log('初期状態のU面:');
  console.log('ステッカーID:', cube.stickerIds?.slice(0, 9));
  console.log('色:', cube.stickers.slice(0, 9));
  
  // U回転実行
  const rotatedCube = rotateU(cube);
  console.log('\nU回転後のU面:');
  console.log('ステッカーID:', rotatedCube.stickerIds?.slice(0, 9));
  console.log('色:', rotatedCube.stickers.slice(0, 9));
  
  // 期待値との比較
  console.log('\n期待値: [6, 3, 0, 7, 4, 1, 8, 5, 2]');
  console.log('実際: ', rotatedCube.stickerIds?.slice(0, 9));
  
  // 各位置の詳細
  console.log('\n各位置の詳細:');
  for (let i = 0; i < 9; i++) {
    const expectedSources = [6, 3, 0, 7, 4, 1, 8, 5, 2];
    console.log(`位置${i}: 期待=${expectedSources[i]}, 実際=${rotatedCube.stickerIds?.[i]}`);
  }
};

// ブラウザコンソールで使用可能にする
(window as any).debugUFaceRotation = debugUFaceRotation;