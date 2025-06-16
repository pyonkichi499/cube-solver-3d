import { createSolvedCube } from './cubeUtils';
import { getGlobalIndex } from './cubeMapping';
import * as CubeTypes from '../types/cube';

export const debugFaceOrder = () => {
  console.log('=== 面の順番デバッグ ===');
  
  const cube = createSolvedCube();
  
  console.log('完成状態のキューブ:');
  console.log('ステッカー配列:', cube.stickers);
  console.log('ステッカーID配列:', cube.stickerIds);
  
  console.log('\n各面の色:');
  const faces = ['U', 'F', 'L', 'B', 'R', 'D'] as const;
  faces.forEach((face, index) => {
    const startIdx = index * 9;
    const endIdx = startIdx + 9;
    const faceColors = cube.stickers.slice(startIdx, endIdx);
    const uniqueColors = [...new Set(faceColors)];
    console.log(`${face}面 (${startIdx}-${endIdx-1}): ${uniqueColors.join(', ')}`);
  });
  
  console.log('\n期待される色:');
  console.log('U面: white');
  console.log('F面: green');
  console.log('L面: orange');
  console.log('B面: blue');
  console.log('R面: red');
  console.log('D面: yellow');
};

// ブラウザコンソールで使用可能にする
(window as any).debugFaceOrder = debugFaceOrder;