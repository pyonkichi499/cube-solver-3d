import React from 'react';
import type { CubeState, Color, Face } from '../types/cube';
import { COLOR_EMOJI, FACE_NAMES } from '../types/cube';

interface DebugPanelProps {
  cubeState: CubeState;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ cubeState }) => {
  const faces: readonly Face[] = ['U', 'F', 'L', 'B', 'R', 'D'] as const;
  
  const renderFace = (face: typeof faces[number], startIndex: number) => {
    const faceStickers = [];
    for (let i = 0; i < 9; i++) {
      const globalIndex = startIndex + i;
      const color = cubeState.stickers[globalIndex];
      const stickerId = cubeState.stickerIds ? cubeState.stickerIds[globalIndex] : globalIndex;
      faceStickers.push(
        <div
          key={i}
          style={{
            display: 'inline-block',
            width: '40px',
            height: '40px',
            border: '1px solid #ccc',
            textAlign: 'center',
            lineHeight: '20px',
            fontSize: '12px',
            fontWeight: 'bold',
            margin: '1px',
            paddingTop: '4px'
          }}
        >
          <div>{COLOR_EMOJI[color as Color] || color.charAt(0).toUpperCase()}</div>
          <div style={{ fontSize: '10px', color: '#666' }}>{stickerId}</div>
        </div>
      );
    }
    
    return (
      <div style={{ marginBottom: '20px' }}>
        <h4>{FACE_NAMES[face]}</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 44px)', gap: '0' }}>
          {faceStickers}
        </div>
      </div>
    );
  };
  
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      marginTop: '20px'
    }}>
      <h3>デバッグパネル - ステッカー配置</h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px'
      }}>
        {faces.map((face, index) => renderFace(face, index * 9))}
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p>※ 各セルには色の絵文字とステッカーID（元の位置）が表示されています</p>
        <p>⬜ = 白, 🟨 = 黄, 🟧 = オレンジ, 🟥 = 赤, 🟩 = 緑, 🟦 = 青</p>
      </div>
    </div>
  );
};