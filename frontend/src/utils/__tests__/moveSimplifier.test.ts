import { describe, it, expect } from 'vitest';
import { simplifyMoves, getSimplifiedMovesDisplay, getLastMoveGroup } from '../moveSimplifier';

describe('moveSimplifier', () => {
  describe('simplifyMoves', () => {
    it('空の配列を渡すと空の配列を返す', () => {
      expect(simplifyMoves([])).toEqual([]);
    });

    it('同じ手順2回がダブルムーブに統合される', () => {
      // R + R = R2
      expect(simplifyMoves(['R', 'R'])).toEqual(['R2']);
    });

    it('逆手順同士が相殺される', () => {
      // R + R' = nothing (R=1, R'=3, total=4, 4%4=0)
      expect(simplifyMoves(["R", "R'"])).toEqual([]);
    });

    it('3回の同じ手順が逆手順に簡略化される', () => {
      // R + R + R = R' (1+1+1=3)
      expect(simplifyMoves(['R', 'R', 'R'])).toEqual(["R'"]);
    });

    it('4回の同じ手順が相殺される', () => {
      // R + R + R + R = nothing (1+1+1+1=4, 4%4=0)
      expect(simplifyMoves(['R', 'R', 'R', 'R'])).toEqual([]);
    });

    it('異なる面の手順は統合されない', () => {
      expect(simplifyMoves(['R', 'U'])).toEqual(['R', 'U']);
    });

    it('連続しない同じ面の手順は統合されない', () => {
      expect(simplifyMoves(['R', 'U', 'R'])).toEqual(['R', 'U', 'R']);
    });

    it('ダブルムーブ同士が相殺される', () => {
      // R2 + R2 = nothing (2+2=4, 4%4=0)
      expect(simplifyMoves(['R2', 'R2'])).toEqual([]);
    });

    it('ダブルムーブと通常手順が統合される', () => {
      // R2 + R = R' (2+1=3)
      expect(simplifyMoves(['R2', 'R'])).toEqual(["R'"]);
    });

    it('複数の面の手順を個別に簡略化する', () => {
      // R + R + U + U = R2 + U2
      expect(simplifyMoves(['R', 'R', 'U', 'U'])).toEqual(['R2', 'U2']);
    });

    it('単一の手順はそのまま返す', () => {
      expect(simplifyMoves(['R'])).toEqual(['R']);
      expect(simplifyMoves(["U'"])).toEqual(["U'"]);
      expect(simplifyMoves(['F2'])).toEqual(['F2']);
    });
  });

  describe('getSimplifiedMovesDisplay', () => {
    it('元の手順と簡略化された手順を返す', () => {
      const result = getSimplifiedMovesDisplay(['R', 'R', 'U']);
      expect(result.original).toBe('R R U');
      expect(result.simplified).toBe('R2 U');
      expect(result.count).toBe(2);
    });

    it('空の手順リストを正しく処理する', () => {
      const result = getSimplifiedMovesDisplay([]);
      expect(result.original).toBe('');
      expect(result.simplified).toBe('');
      expect(result.count).toBe(0);
    });
  });

  describe('getLastMoveGroup', () => {
    it('空の配列では空の配列を返す', () => {
      expect(getLastMoveGroup([])).toEqual([]);
    });

    it('最後の連続する同じ面の手順グループを返す', () => {
      expect(getLastMoveGroup(['U', 'R', 'R'])).toEqual(['R', 'R']);
    });

    it('最後の手順が単独の場合はその手順だけを返す', () => {
      expect(getLastMoveGroup(['R', 'U'])).toEqual(['U']);
    });

    it('全て同じ面の手順の場合は全て返す', () => {
      expect(getLastMoveGroup(['R', 'R', 'R'])).toEqual(['R', 'R', 'R']);
    });
  });
});
