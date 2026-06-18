import { describe, it, expect } from 'vitest';
import { mockFunctions } from '../cubeApi';

describe('mockFunctions', () => {
  describe('generateMockScramble', () => {
    it('デフォルトの長さが20である', () => {
      const result = mockFunctions.generateMockScramble();
      expect(result.scramble).toHaveLength(20);
    });

    it('カスタムlengthパラメータが動作する', () => {
      const result5 = mockFunctions.generateMockScramble(5);
      expect(result5.scramble).toHaveLength(5);

      const result10 = mockFunctions.generateMockScramble(10);
      expect(result10.scramble).toHaveLength(10);

      const result0 = mockFunctions.generateMockScramble(0);
      expect(result0.scramble).toHaveLength(0);
    });

    it('有効なScrambleResponse構造を返す', () => {
      const result = mockFunctions.generateMockScramble();

      expect(result).toHaveProperty('scramble');
      expect(result).toHaveProperty('scramble_string');
      expect(result).toHaveProperty('cube_size');

      expect(Array.isArray(result.scramble)).toBe(true);
      expect(typeof result.scramble_string).toBe('string');
      expect(result.cube_size).toBe('3x3');
    });

    it('各ムーブが正しいパターンに従う', () => {
      const result = mockFunctions.generateMockScramble(100);
      const movePattern = /^[RLUDFB]['2]?$/;

      for (const move of result.scramble) {
        expect(move).toMatch(movePattern);
      }
    });

    it('scramble_stringがscramble配列をスペースで結合した値である', () => {
      const result = mockFunctions.generateMockScramble(10);
      expect(result.scramble_string).toBe(result.scramble.join(' '));
    });
  });

  describe('generateMockSolution', () => {
    it('有効なSolveResponse構造を返す', () => {
      const result = mockFunctions.generateMockSolution('UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB');

      expect(result).toHaveProperty('solution');
      expect(result).toHaveProperty('move_count');
      expect(result).toHaveProperty('solver_used');

      expect(Array.isArray(result.solution)).toBe(true);
      expect(typeof result.move_count).toBe('number');
      expect(typeof result.solver_used).toBe('string');
    });

    it('期待されるムーブ配列を返す', () => {
      const result = mockFunctions.generateMockSolution('any-state');
      const expectedMoves = ['R', 'U', "R'", "U'", 'R', 'U2', "R'", 'U'];

      expect(result.solution).toEqual(expectedMoves);
    });

    it('move_countがsolution配列の長さと一致する', () => {
      const result = mockFunctions.generateMockSolution('any-state');
      expect(result.move_count).toBe(result.solution.length);
    });

    it('solver_usedにmockが含まれる', () => {
      const result = mockFunctions.generateMockSolution('any-state');
      expect(result.solver_used.toLowerCase()).toContain('mock');
    });
  });
});
