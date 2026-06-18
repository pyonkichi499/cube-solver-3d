import { describe, it, expect } from 'vitest';
import {
  FACE_INDICES,
  getGlobalIndex,
  getFaceAndPosition,
  getVisibleStickers,
} from '../cubeMapping';

describe('cubeMapping', () => {
  describe('FACE_INDICES', () => {
    it('全6面の値が正しく定義されている', () => {
      expect(FACE_INDICES.U).toBe(0);
      expect(FACE_INDICES.F).toBe(1);
      expect(FACE_INDICES.L).toBe(2);
      expect(FACE_INDICES.B).toBe(3);
      expect(FACE_INDICES.R).toBe(4);
      expect(FACE_INDICES.D).toBe(5);
    });
  });

  describe('getGlobalIndex', () => {
    it('U面のposition0は0、position8は8を返す', () => {
      expect(getGlobalIndex('U', 0)).toBe(0);
      expect(getGlobalIndex('U', 8)).toBe(8);
    });

    it('F面のposition0は9、position8は17を返す', () => {
      expect(getGlobalIndex('F', 0)).toBe(9);
      expect(getGlobalIndex('F', 8)).toBe(17);
    });

    it('L面のposition0は18を返す', () => {
      expect(getGlobalIndex('L', 0)).toBe(18);
    });

    it('B面のposition0は27を返す', () => {
      expect(getGlobalIndex('B', 0)).toBe(27);
    });

    it('R面のposition0は36を返す', () => {
      expect(getGlobalIndex('R', 0)).toBe(36);
    });

    it('D面のposition0は45を返す', () => {
      expect(getGlobalIndex('D', 0)).toBe(45);
    });
  });

  describe('getFaceAndPosition', () => {
    it('インデックス0はU面のposition0を返す', () => {
      const result = getFaceAndPosition(0);
      expect(result).toEqual({ face: 'U', position: 0 });
    });

    it('インデックス8はU面のposition8を返す', () => {
      const result = getFaceAndPosition(8);
      expect(result).toEqual({ face: 'U', position: 8 });
    });

    it('インデックス9はF面のposition0を返す', () => {
      const result = getFaceAndPosition(9);
      expect(result).toEqual({ face: 'F', position: 0 });
    });

    it('インデックス53はD面のposition8を返す', () => {
      const result = getFaceAndPosition(53);
      expect(result).toEqual({ face: 'D', position: 8 });
    });

    it('全インデックス0-53の往復変換が一致する', () => {
      for (let i = 0; i < 54; i++) {
        const { face, position } = getFaceAndPosition(i);
        const roundtrip = getGlobalIndex(face, position);
        expect(roundtrip).toBe(i);
      }
    });
  });

  describe('getVisibleStickers', () => {
    it('コーナー位置(1,1,1)は3つのステッカーを返す（U, R, F面）', () => {
      const stickers = getVisibleStickers({ x: 1, y: 1, z: 1 });
      expect(stickers).toHaveLength(3);
      const faces = stickers.map(s => s.face).sort();
      expect(faces).toEqual(['F', 'R', 'U']);
    });

    it('エッジ位置(0,1,1)は2つのステッカーを返す（U, F面）', () => {
      const stickers = getVisibleStickers({ x: 0, y: 1, z: 1 });
      expect(stickers).toHaveLength(2);
      const faces = stickers.map(s => s.face).sort();
      expect(faces).toEqual(['F', 'U']);
    });

    it('センター位置(0,1,0)は1つのステッカーを返す（U面）', () => {
      const stickers = getVisibleStickers({ x: 0, y: 1, z: 0 });
      expect(stickers).toHaveLength(1);
      expect(stickers[0].face).toBe('U');
    });

    it('内部位置(0,0,0)は0個のステッカーを返す', () => {
      const stickers = getVisibleStickers({ x: 0, y: 0, z: 0 });
      expect(stickers).toHaveLength(0);
    });

    it('各ステッカーのface文字が正しい面名である', () => {
      const validFaces = ['U', 'R', 'F', 'D', 'L', 'B'];
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          for (let z = -1; z <= 1; z++) {
            const stickers = getVisibleStickers({ x, y, z });
            for (const s of stickers) {
              expect(validFaces).toContain(s.face);
            }
          }
        }
      }
    });

    it('各ステッカーのpositionが0-8の範囲内である', () => {
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          for (let z = -1; z <= 1; z++) {
            const stickers = getVisibleStickers({ x, y, z });
            for (const s of stickers) {
              expect(s.position).toBeGreaterThanOrEqual(0);
              expect(s.position).toBeLessThanOrEqual(8);
            }
          }
        }
      }
    });

    it('各ステッカーのglobalIndexが0-53の範囲内である', () => {
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          for (let z = -1; z <= 1; z++) {
            const stickers = getVisibleStickers({ x, y, z });
            for (const s of stickers) {
              expect(s.globalIndex).toBeGreaterThanOrEqual(0);
              expect(s.globalIndex).toBeLessThanOrEqual(53);
            }
          }
        }
      }
    });
  });
});
