import { describe, it, expect } from 'vitest';
import { DEFAULT_COLORS, faceToColor, colorToFace } from '../cube';
import type { Face, Color } from '../cube';

describe('DEFAULT_COLORS', () => {
  it('全6面のキーが存在する', () => {
    const faces: Face[] = ['U', 'D', 'L', 'R', 'F', 'B'];
    for (const face of faces) {
      expect(DEFAULT_COLORS).toHaveProperty(face);
    }
    expect(Object.keys(DEFAULT_COLORS)).toHaveLength(6);
  });

  it('各面が正しい色にマッピングされている', () => {
    expect(DEFAULT_COLORS.U).toBe('white');
    expect(DEFAULT_COLORS.D).toBe('yellow');
    expect(DEFAULT_COLORS.L).toBe('orange');
    expect(DEFAULT_COLORS.R).toBe('red');
    expect(DEFAULT_COLORS.F).toBe('green');
    expect(DEFAULT_COLORS.B).toBe('blue');
  });
});

describe('faceToColor', () => {
  it('Uはwhiteを返す', () => {
    expect(faceToColor('U')).toBe('white');
  });

  it('Dはyellowを返す', () => {
    expect(faceToColor('D')).toBe('yellow');
  });

  it('Lはorangeを返す', () => {
    expect(faceToColor('L')).toBe('orange');
  });

  it('Rはredを返す', () => {
    expect(faceToColor('R')).toBe('red');
  });

  it('Fはgreenを返す', () => {
    expect(faceToColor('F')).toBe('green');
  });

  it('Bはblueを返す', () => {
    expect(faceToColor('B')).toBe('blue');
  });

  it('不明な面文字はデフォルトでwhiteを返す', () => {
    expect(faceToColor('X')).toBe('white');
    expect(faceToColor('Z')).toBe('white');
    expect(faceToColor('1')).toBe('white');
  });

  it('空文字はwhiteを返す', () => {
    expect(faceToColor('')).toBe('white');
  });
});

describe('colorToFace', () => {
  it('whiteはUを返す', () => {
    expect(colorToFace('white')).toBe('U');
  });

  it('yellowはDを返す', () => {
    expect(colorToFace('yellow')).toBe('D');
  });

  it('orangeはLを返す', () => {
    expect(colorToFace('orange')).toBe('L');
  });

  it('redはRを返す', () => {
    expect(colorToFace('red')).toBe('R');
  });

  it('greenはFを返す', () => {
    expect(colorToFace('green')).toBe('F');
  });

  it('blueはBを返す', () => {
    expect(colorToFace('blue')).toBe('B');
  });

  it('全面でラウンドトリップ変換が成立する', () => {
    const faces: Face[] = ['U', 'D', 'L', 'R', 'F', 'B'];
    for (const face of faces) {
      const color = faceToColor(face);
      const result = colorToFace(color as Color);
      expect(result).toBe(face);
    }
  });
});
