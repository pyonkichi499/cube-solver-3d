import { describe, it, expect } from 'vitest';
import { createSolvedCube, cubeStateToString, stringToCubeState, applyMove, applyMoves } from '../cubeUtils';

describe('cubeUtils', () => {
  describe('createSolvedCube', () => {
    it('完成状態を正しく生成する', () => {
      const cube = createSolvedCube();
      expect(cube.stickers).toBeDefined();
      expect(cube.stickers.length).toBe(54);
    });

    it('各面に9個ずつ同じ色のステッカーが配置される', () => {
      const cube = createSolvedCube();
      // フロントエンド格納順: U(0-8), F(9-17), L(18-26), B(27-35), R(36-44), D(45-53)
      // U面: white
      for (let i = 0; i < 9; i++) {
        expect(cube.stickers[i]).toBe('white');
      }
      // F面: green
      for (let i = 9; i < 18; i++) {
        expect(cube.stickers[i]).toBe('green');
      }
      // L面: orange
      for (let i = 18; i < 27; i++) {
        expect(cube.stickers[i]).toBe('orange');
      }
      // B面: blue
      for (let i = 27; i < 36; i++) {
        expect(cube.stickers[i]).toBe('blue');
      }
      // R面: red
      for (let i = 36; i < 45; i++) {
        expect(cube.stickers[i]).toBe('red');
      }
      // D面: yellow
      for (let i = 45; i < 54; i++) {
        expect(cube.stickers[i]).toBe('yellow');
      }
    });

    it('stickerIdsが0から53まで連番で生成される', () => {
      const cube = createSolvedCube();
      expect(cube.stickerIds).toBeDefined();
      expect(cube.stickerIds!.length).toBe(54);
      for (let i = 0; i < 54; i++) {
        expect(cube.stickerIds![i]).toBe(i);
      }
    });
  });

  describe('cubeStateToString', () => {
    it('完成状態から正しい54文字の文字列を生成する', () => {
      const cube = createSolvedCube();
      const result = cubeStateToString(cube);
      expect(result.length).toBe(54);
      // バックエンド形式: U(9) R(9) F(9) D(9) L(9) B(9)
      expect(result).toBe('UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB');
    });

    it('各面の文字が正しい順序で配置される', () => {
      const cube = createSolvedCube();
      const result = cubeStateToString(cube);
      // U面: 最初の9文字
      expect(result.substring(0, 9)).toBe('UUUUUUUUU');
      // R面: 次の9文字
      expect(result.substring(9, 18)).toBe('RRRRRRRRR');
      // F面: 次の9文字
      expect(result.substring(18, 27)).toBe('FFFFFFFFF');
      // D面: 次の9文字
      expect(result.substring(27, 36)).toBe('DDDDDDDDD');
      // L面: 次の9文字
      expect(result.substring(36, 45)).toBe('LLLLLLLLL');
      // B面: 最後の9文字
      expect(result.substring(45, 54)).toBe('BBBBBBBBB');
    });
  });

  describe('stringToCubeState', () => {
    it('完成状態の文字列から正しいCubeStateを生成する', () => {
      const solvedString = 'UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB';
      const cube = stringToCubeState(solvedString);
      expect(cube.stickers).toBeDefined();
      expect(cube.stickers.length).toBe(54);
      // U面: white (0-8)
      for (let i = 0; i < 9; i++) {
        expect(cube.stickers[i]).toBe('white');
      }
      // F面: green (9-17)
      for (let i = 9; i < 18; i++) {
        expect(cube.stickers[i]).toBe('green');
      }
      // L面: orange (18-26)
      for (let i = 18; i < 27; i++) {
        expect(cube.stickers[i]).toBe('orange');
      }
      // B面: blue (27-35)
      for (let i = 27; i < 36; i++) {
        expect(cube.stickers[i]).toBe('blue');
      }
      // R面: red (36-44)
      for (let i = 36; i < 45; i++) {
        expect(cube.stickers[i]).toBe('red');
      }
      // D面: yellow (45-53)
      for (let i = 45; i < 54; i++) {
        expect(cube.stickers[i]).toBe('yellow');
      }
    });

    it('cubeStateToStringとの往復変換で元の状態に戻る', () => {
      const solvedCube = createSolvedCube();
      const stateString = cubeStateToString(solvedCube);
      const restored = stringToCubeState(stateString);
      expect(restored.stickers).toEqual(solvedCube.stickers);
    });

    it('スクランブル状態でも往復変換が成立する', () => {
      const cube = applyMoves(createSolvedCube(), ['R', 'U', 'F']);
      const stateString = cubeStateToString(cube);
      const restored = stringToCubeState(stateString);
      expect(restored.stickers).toEqual(cube.stickers);
    });

    it('54文字の入力でstickerIdsが0-53の連番になる', () => {
      const solvedString = 'UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB';
      const cube = stringToCubeState(solvedString);
      expect(cube.stickerIds).toBeDefined();
      expect(cube.stickerIds!.length).toBe(54);
      for (let i = 0; i < 54; i++) {
        expect(cube.stickerIds![i]).toBe(i);
      }
    });

    it('不正な長さの入力でエラーをスローする', () => {
      expect(() => stringToCubeState('')).toThrow();
      expect(() => stringToCubeState('UUUUUUUUU')).toThrow();
    });
  });

  describe('applyMove', () => {
    it('未知の手順を適用しても状態が変わらない', () => {
      const cube = createSolvedCube();
      const result = applyMove(cube, 'X');
      expect(result.stickers).toEqual(cube.stickers);
    });

    it('R手順を適用するとキューブの状態が変わる', () => {
      const cube = createSolvedCube();
      const result = applyMove(cube, 'R');
      expect(result.stickers).not.toEqual(cube.stickers);
    });
  });

  describe('applyMoves', () => {
    it('空の手順リストを適用しても状態が変わらない', () => {
      const cube = createSolvedCube();
      const result = applyMoves(cube, []);
      expect(result.stickers).toEqual(cube.stickers);
    });

    it('複数の手順を順番に適用できる', () => {
      const cube = createSolvedCube();
      const result = applyMoves(cube, ['R', 'U', 'F']);
      expect(result.stickers).not.toEqual(cube.stickers);
    });
  });
});
