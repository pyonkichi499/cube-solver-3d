import { getVisibleStickers } from './cubeMapping';
import { createSolvedCube } from './cubeUtils';
import { rotateR, rotateU } from './cubeRotations';

/**
 * 特定の位置のステッカー情報をデバッグ
 */
export const debugCubiePosition = (x: number, y: number, z: number) => {
  console.log(`=== Cubie at position (${x}, ${y}, ${z}) ===`);
  
  const stickers = getVisibleStickers({ x, y, z });
  console.log('Visible stickers:', stickers);
  
  // 解決状態でのステッカー色
  const solvedCube = createSolvedCube();
  stickers.forEach(sticker => {
    const color = solvedCube.stickers[sticker.globalIndex];
    console.log(`${sticker.face} face, position ${sticker.position}, global ${sticker.globalIndex}: ${color}`);
  });
};

/**
 * RU手順のデバッグ（UFエッジに注目）
 */
export const debugRU = () => {
  console.log('=== RU Debug (focusing on UF edge) ===');
  
  // 初期状態
  let cube = createSolvedCube();
  console.log('=== Initial state ===');
  console.log('UF edge (0, 1, 1):');
  debugCubiePosition(0, 1, 1); // UF edge
  console.log('UR edge (1, 1, 0):');
  debugCubiePosition(1, 1, 0); // UR edge
  console.log('UB edge (0, 1, -1):');
  debugCubiePosition(0, 1, -1); // UB edge
  console.log('UL edge (-1, 1, 0):');
  debugCubiePosition(-1, 1, 0); // UL edge
  
  // R回転後
  cube = rotateR(cube);
  console.log('\n=== After R rotation ===');
  console.log('UF edge (0, 1, 1):');
  const ufAfterR = getVisibleStickers({ x: 0, y: 1, z: 1 });
  ufAfterR.forEach(sticker => {
    const color = cube.stickers[sticker.globalIndex];
    console.log(`${sticker.face} face: ${color}`);
  });
  
  // U回転後
  cube = rotateU(cube);
  console.log('\n=== After RU rotations ===');
  console.log('UF edge (0, 1, 1):');
  const ufAfterRU = getVisibleStickers({ x: 0, y: 1, z: 1 });
  ufAfterRU.forEach(sticker => {
    const color = cube.stickers[sticker.globalIndex];
    console.log(`${sticker.face} face: ${color}`);
  });
  
  // 期待値の確認
  console.log('\n=== Expected vs Actual ===');
  console.log('Expected: UF edge should have green (from original UL) and white (U face)');
  console.log('Actual colors shown above');
};

/**
 * U回転のエッジ移動を詳細確認
 */
export const debugURotation = () => {
  console.log('=== U Rotation Edge Movement Debug ===');
  
  let cube = createSolvedCube();
  
  // 初期状態の上面エッジ確認
  console.log('=== Before U rotation ===');
  console.log('UF edge (0, 1, 1): should be white-green');
  console.log('UR edge (1, 1, 0): should be white-red');
  console.log('UB edge (0, 1, -1): should be white-blue');
  console.log('UL edge (-1, 1, 0): should be white-orange');
  
  cube = rotateU(cube);
  
  console.log('\n=== After U rotation ===');
  console.log('UF edge (0, 1, 1): should now be white-red (from UR)');
  const ufStickers = getVisibleStickers({ x: 0, y: 1, z: 1 });
  ufStickers.forEach(sticker => {
    const color = cube.stickers[sticker.globalIndex];
    console.log(`${sticker.face} face: ${color}`);
  });
};

// ブラウザのコンソールで使用可能にする
(window as any).debugCubiePosition = debugCubiePosition;
(window as any).debugRU = debugRU;
(window as any).debugURotation = debugURotation;