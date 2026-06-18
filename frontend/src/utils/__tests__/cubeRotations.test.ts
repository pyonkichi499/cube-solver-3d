import { describe, it, expect } from 'vitest';
import { rotateR, rotateRPrime, rotateU, rotateUPrime, rotateF, rotateFPrime, rotateL, rotateLPrime, rotateD, rotateDPrime, rotateB, rotateBPrime, getMoveFunction } from '../cubeRotations';
import { createSolvedCube } from '../cubeUtils';
import type { CubeState, Color } from '../../types/cube';

// キューブの妥当性を検証するヘルパー関数
// 完成状態のキューブには各色が9個ずつ存在する
const isValidCube = (cube: CubeState): boolean => {
  const colorCounts: Record<Color, number> = {
    'white': 0,
    'yellow': 0,
    'orange': 0,
    'red': 0,
    'green': 0,
    'blue': 0,
  };
  for (const sticker of cube.stickers) {
    colorCounts[sticker]++;
  }
  return Object.values(colorCounts).every(count => count === 9);
};

describe('cubeRotations', () => {
  describe('R回転', () => {
    it('R回転を4回適用すると元の状態に戻る', () => {
      const solved = createSolvedCube();
      let cube = solved;
      for (let i = 0; i < 4; i++) {
        cube = rotateR(cube);
      }
      expect(cube.stickers).toEqual(solved.stickers);
    });

    it("RとR'が互いに打ち消し合う", () => {
      const solved = createSolvedCube();
      const afterR = rotateR(solved);
      const afterRPrime = rotateRPrime(afterR);
      expect(afterRPrime.stickers).toEqual(solved.stickers);
    });

    it('R回転後もキューブの妥当性が保たれる', () => {
      const solved = createSolvedCube();
      const result = rotateR(solved);
      expect(isValidCube(result)).toBe(true);
    });
  });

  describe('U回転', () => {
    it('U回転を4回適用すると元の状態に戻る', () => {
      const solved = createSolvedCube();
      let cube = solved;
      for (let i = 0; i < 4; i++) {
        cube = rotateU(cube);
      }
      expect(cube.stickers).toEqual(solved.stickers);
    });

    it("UとU'が互いに打ち消し合う", () => {
      const solved = createSolvedCube();
      const afterU = rotateU(solved);
      const afterUPrime = rotateUPrime(afterU);
      expect(afterUPrime.stickers).toEqual(solved.stickers);
    });

    it('U回転後もキューブの妥当性が保たれる', () => {
      const solved = createSolvedCube();
      const result = rotateU(solved);
      expect(isValidCube(result)).toBe(true);
    });
  });

  describe('F回転', () => {
    it('F回転を4回適用すると元の状態に戻る', () => {
      const solved = createSolvedCube();
      let cube = solved;
      for (let i = 0; i < 4; i++) {
        cube = rotateF(cube);
      }
      expect(cube.stickers).toEqual(solved.stickers);
    });

    it("FとF'が互いに打ち消し合う", () => {
      const solved = createSolvedCube();
      const afterF = rotateF(solved);
      const afterFPrime = rotateFPrime(afterF);
      expect(afterFPrime.stickers).toEqual(solved.stickers);
    });

    it('F回転後もキューブの妥当性が保たれる', () => {
      const solved = createSolvedCube();
      const result = rotateF(solved);
      expect(isValidCube(result)).toBe(true);
    });
  });

  describe('L回転', () => {
    it('L回転を4回適用すると元の状態に戻る', () => {
      const solved = createSolvedCube();
      let cube = solved;
      for (let i = 0; i < 4; i++) {
        cube = rotateL(cube);
      }
      expect(cube.stickers).toEqual(solved.stickers);
    });

    it("LとL'が互いに打ち消し合う", () => {
      const solved = createSolvedCube();
      const afterL = rotateL(solved);
      const afterLPrime = rotateLPrime(afterL);
      expect(afterLPrime.stickers).toEqual(solved.stickers);
    });

    it('L回転後もキューブの妥当性が保たれる', () => {
      const solved = createSolvedCube();
      const result = rotateL(solved);
      expect(isValidCube(result)).toBe(true);
    });
  });

  describe('D回転', () => {
    it('D回転を4回適用すると元の状態に戻る', () => {
      const solved = createSolvedCube();
      let cube = solved;
      for (let i = 0; i < 4; i++) {
        cube = rotateD(cube);
      }
      expect(cube.stickers).toEqual(solved.stickers);
    });

    it("DとD'が互いに打ち消し合う", () => {
      const solved = createSolvedCube();
      const afterD = rotateD(solved);
      const afterDPrime = rotateDPrime(afterD);
      expect(afterDPrime.stickers).toEqual(solved.stickers);
    });

    it('D回転後もキューブの妥当性が保たれる', () => {
      const solved = createSolvedCube();
      const result = rotateD(solved);
      expect(isValidCube(result)).toBe(true);
    });
  });

  describe('B回転', () => {
    it('B回転を4回適用すると元の状態に戻る', () => {
      const solved = createSolvedCube();
      let cube = solved;
      for (let i = 0; i < 4; i++) {
        cube = rotateB(cube);
      }
      expect(cube.stickers).toEqual(solved.stickers);
    });

    it("BとB'が互いに打ち消し合う", () => {
      const solved = createSolvedCube();
      const afterB = rotateB(solved);
      const afterBPrime = rotateBPrime(afterB);
      expect(afterBPrime.stickers).toEqual(solved.stickers);
    });

    it('B回転後もキューブの妥当性が保たれる', () => {
      const solved = createSolvedCube();
      const result = rotateB(solved);
      expect(isValidCube(result)).toBe(true);
    });
  });

  describe('getMoveFunction', () => {
    it('有効な手順文字列に対して関数を返す', () => {
      expect(getMoveFunction('R')).not.toBeNull();
      expect(getMoveFunction("R'")).not.toBeNull();
      expect(getMoveFunction('R2')).not.toBeNull();
      expect(getMoveFunction('U')).not.toBeNull();
      expect(getMoveFunction('F')).not.toBeNull();
      expect(getMoveFunction('L')).not.toBeNull();
      expect(getMoveFunction('D')).not.toBeNull();
      expect(getMoveFunction('B')).not.toBeNull();
    });

    it('無効な手順文字列に対してnullを返す', () => {
      expect(getMoveFunction('X')).toBeNull();
      expect(getMoveFunction('Z')).toBeNull();
      expect(getMoveFunction('')).toBeNull();
    });
  });

  describe('全回転の妥当性チェック', () => {
    const moves = ['R', "R'", 'R2', 'U', "U'", 'U2', 'F', "F'", 'F2', 'L', "L'", 'L2', 'D', "D'", 'D2', 'B', "B'", 'B2'];

    moves.forEach((move) => {
      it(move + '回転後もキューブの色の数が正しい', () => {
        const solved = createSolvedCube();
        const moveFunc = getMoveFunction(move);
        expect(moveFunc).not.toBeNull();
        const result = moveFunc!(solved);
        expect(isValidCube(result)).toBe(true);
      });
    });
  });
});
