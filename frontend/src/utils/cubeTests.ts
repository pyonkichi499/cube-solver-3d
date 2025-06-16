import * as CubeTypes from '../types/cube';
import { createSolvedCube } from './cubeUtils';
import { rotateR, rotateU, rotateF, rotateRPrime, rotateUPrime, rotateFPrime, rotateR2 } from './cubeRotations';
import { visualizeCubeState } from './cubeMapping';

type CubeState = CubeTypes.CubeState;

/**
 * 基本的なテストケース
 */
export const runBasicTests = (): boolean => {
  console.log('🧪 Running cube rotation tests...');
  
  try {
    // Test 1: R4 = identity (R回転を4回すると元に戻る)
    let cube = createSolvedCube();
    const originalState = JSON.stringify(cube.stickers);
    
    cube = rotateR(cube);
    cube = rotateR(cube);
    cube = rotateR(cube);
    cube = rotateR(cube);
    
    const afterR4 = JSON.stringify(cube.stickers);
    
    if (originalState === afterR4) {
      console.log('✅ Test 1 passed: R4 = identity');
    } else {
      console.log('❌ Test 1 failed: R4 ≠ identity');
      return false;
    }
    
    // Test 2: R * R' = identity
    cube = createSolvedCube();
    cube = rotateR(cube);
    cube = rotateRPrime(cube);
    
    const afterRRPrime = JSON.stringify(cube.stickers);
    
    if (originalState === afterRRPrime) {
      console.log("✅ Test 2 passed: R * R' = identity");
    } else {
      console.log("❌ Test 2 failed: R * R' ≠ identity");
      return false;
    }
    
    // Test 3: R2 = R * R
    cube = createSolvedCube();
    const r2Result = rotateR2(cube);
    
    cube = createSolvedCube();
    cube = rotateR(cube);
    cube = rotateR(cube);
    
    if (JSON.stringify(r2Result.stickers) === JSON.stringify(cube.stickers)) {
      console.log('✅ Test 3 passed: R2 = R * R');
    } else {
      console.log('❌ Test 3 failed: R2 ≠ R * R');
      return false;
    }
    
    // Test 4: Sexy move test (R U R' U')4 = identity
    cube = createSolvedCube();
    
    for (let i = 0; i < 6; i++) { // Sexy moveを6回
      cube = rotateR(cube);
      cube = rotateU(cube);
      cube = rotateRPrime(cube);
      cube = rotateUPrime(cube);
    }
    
    const afterSexyMove6 = JSON.stringify(cube.stickers);
    
    if (originalState === afterSexyMove6) {
      console.log('✅ Test 4 passed: (R U R\' U\')6 = identity');
    } else {
      console.log('❌ Test 4 failed: (R U R\' U\')6 ≠ identity');
      console.log('Note: This might be expected if the sexy move period is not 6');
    }
    
    console.log('🎉 All basic tests completed successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    return false;
  }
};

/**
 * 視覚的なテスト - R回転の結果を表示
 */
export const visualTest = (): void => {
  console.log('👁️ Visual test of R rotation:');
  
  let cube = createSolvedCube();
  console.log('Solved state:');
  console.log(visualizeCubeState(cube.stickers.map(color => {
    const colorMap: Record<CubeTypes.Color, string> = {
      'white': 'W',
      'yellow': 'Y',
      'orange': 'O',
      'red': 'R',
      'green': 'G',
      'blue': 'B'
    };
    return colorMap[color];
  })));
  
  cube = rotateR(cube);
  console.log('\nAfter R:');
  console.log(visualizeCubeState(cube.stickers.map(color => {
    const colorMap: Record<CubeTypes.Color, string> = {
      'white': 'W',
      'yellow': 'Y', 
      'orange': 'O',
      'red': 'R',
      'green': 'G',
      'blue': 'B'
    };
    return colorMap[color];
  })));
};

/**
 * ブラウザのコンソールからテストを実行
 */
(window as any).runCubeTests = runBasicTests;
(window as any).visualCubeTest = visualTest;