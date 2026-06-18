import { describe, it, expect } from 'vitest';
import { moveElements, moveStickersWithIds, rotateFaceWithIds } from '../rotationHelper';
import type { Color, CubeState } from '../../types/cube';

describe('moveElements', () => {
  it('配列間で要素を正しく移動する', () => {
    const source = ['a', 'b', 'c', 'd'];
    const target = ['x', 'x', 'x', 'x'];
    moveElements(source, [0, 1, 2], target, [3, 2, 1]);
    expect(target).toEqual(['x', 'c', 'b', 'a']);
  });

  it('単一要素の移動を正しく処理する', () => {
    const source = [10, 20, 30];
    const target = [0, 0, 0];
    moveElements(source, [1], target, [2]);
    expect(target).toEqual([0, 0, 20]);
  });

  it('複数要素の移動を正しく処理する', () => {
    const source = ['w', 'x', 'y', 'z'];
    const target = ['_', '_', '_', '_'];
    moveElements(source, [0, 1, 2, 3], target, [1, 2, 3, 0]);
    expect(target).toEqual(['z', 'w', 'x', 'y']);
  });
});

describe('moveStickersWithIds', () => {
  const colors: Color[] = [
    'white', 'red', 'green', 'blue',
    'yellow', 'orange', 'white', 'red',
    'green',
  ];

  it('ステッカーを正しい位置に移動する', () => {
    const state: CubeState = { stickers: [...colors] };
    const result = moveStickersWithIds(state, [
      { from: 0, to: 2 },
      { from: 2, to: 4 },
      { from: 4, to: 6 },
      { from: 6, to: 0 },
    ]);
    expect(result.stickers[2]).toBe('white');
    expect(result.stickers[4]).toBe('green');
    expect(result.stickers[6]).toBe('yellow');
    expect(result.stickers[0]).toBe('white');
  });

  it('stickerIdsが存在する場合ステッカーと一緒に移動する', () => {
    const state: CubeState = {
      stickers: [...colors],
      stickerIds: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    };
    const result = moveStickersWithIds(state, [
      { from: 0, to: 1 },
      { from: 1, to: 0 },
    ]);
    expect(result.stickers[1]).toBe('white');
    expect(result.stickers[0]).toBe('red');
    expect(result.stickerIds![1]).toBe(0);
    expect(result.stickerIds![0]).toBe(1);
  });

  it('stickerIdsがundefinedの場合も正しく動作する', () => {
    const state: CubeState = { stickers: [...colors] };
    const result = moveStickersWithIds(state, [
      { from: 0, to: 1 },
    ]);
    expect(result.stickers[1]).toBe('white');
    expect(result.stickerIds).toBeUndefined();
  });

  it('元のstateがミューテーションされない（イミュータブル）', () => {
    const originalStickers: Color[] = [...colors];
    const originalIds = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const state: CubeState = {
      stickers: [...originalStickers],
      stickerIds: [...originalIds],
    };
    moveStickersWithIds(state, [
      { from: 0, to: 8 },
      { from: 8, to: 0 },
    ]);
    expect(state.stickers).toEqual(originalStickers);
    expect(state.stickerIds).toEqual(originalIds);
  });
});

describe('rotateFaceWithIds', () => {
  const baseFace: Color[] = [
    'white', 'red', 'green',
    'blue', 'yellow', 'orange',
    'white', 'red', 'green',
  ];

  it('時計回り90度回転: [0,1,2,3,4,5,6,7,8] -> [6,3,0,7,4,1,8,5,2]', () => {
    const face: Color[] = [
      'white', 'red', 'green',
      'blue', 'yellow', 'orange',
      'white', 'red', 'green',
    ];
    const { rotatedFace } = rotateFaceWithIds(face);
    expect(rotatedFace).toEqual([
      face[6], face[3], face[0],
      face[7], face[4], face[1],
      face[8], face[5], face[2],
    ]);
  });

  it('4回回転すると元に戻る', () => {
    let face: Color[] = [...baseFace];
    for (let i = 0; i < 4; i++) {
      const { rotatedFace } = rotateFaceWithIds(face);
      face = rotatedFace;
    }
    expect(face).toEqual(baseFace);
  });

  it('中心ステッカー（index 4）は回転後も同じ位置にある', () => {
    const { rotatedFace } = rotateFaceWithIds(baseFace);
    expect(rotatedFace[4]).toBe(baseFace[4]);
  });

  it('面のIDも色と一緒に回転する', () => {
    const face: Color[] = [...baseFace];
    const faceIds = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const { rotatedFace, rotatedIds } = rotateFaceWithIds(face, faceIds);
    expect(rotatedFace).toEqual([
      face[6], face[3], face[0],
      face[7], face[4], face[1],
      face[8], face[5], face[2],
    ]);
    expect(rotatedIds).toEqual([6, 3, 0, 7, 4, 1, 8, 5, 2]);
  });

  it('faceIdsがundefinedの場合rotatedIdsもundefinedになる', () => {
    const { rotatedIds } = rotateFaceWithIds(baseFace);
    expect(rotatedIds).toBeUndefined();
  });

  it('面の長さが9でない場合エラーをスローする', () => {
    const shortFace: Color[] = ['white', 'red', 'green'];
    expect(() => rotateFaceWithIds(shortFace)).toThrow('Face must have exactly 9 stickers');

    const longFace: Color[] = Array(10).fill('white') as Color[];
    expect(() => rotateFaceWithIds(longFace)).toThrow('Face must have exactly 9 stickers');
  });
});
