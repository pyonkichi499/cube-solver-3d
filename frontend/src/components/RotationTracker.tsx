import React from 'react';
import * as CubeTypes from '../types/cube';

interface RotationTrackerProps {
  cubeState: CubeTypes.CubeState;
  moves: string[];
}

export const RotationTracker: React.FC<RotationTrackerProps> = ({ cubeState, moves }) => {
  // 重要なエッジピースの位置
  const edges = [
    { name: 'UF', positions: [7, 19], labels: ['U7', 'F1'] },
    { name: 'UR', positions: [5, 10], labels: ['U5', 'R1'] },
    { name: 'UB', positions: [1, 46], labels: ['U1', 'B1'] },
    { name: 'UL', positions: [3, 37], labels: ['U3', 'L1'] }
  ];
  
  const colorEmoji = {
    white: '⬜',
    yellow: '🟨', 
    orange: '🟧',
    red: '🟥',
    green: '🟩',
    blue: '🟦'
  };
  
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#e8f4f8',
      borderRadius: '8px',
      marginTop: '20px',
      border: '2px solid #2196F3'
    }}>
      <h3>エッジピース追跡</h3>
      <p style={{ fontSize: '14px', color: '#666' }}>
        適用された手順: {moves.length > 0 ? moves.join(' ') : '(なし)'}
      </p>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '15px',
        marginTop: '15px'
      }}>
        {edges.map(edge => (
          <div
            key={edge.name}
            style={{
              padding: '10px',
              backgroundColor: 'white',
              borderRadius: '6px',
              border: '1px solid #ddd'
            }}
          >
            <h4 style={{ margin: '0 0 10px 0', color: '#1976D2' }}>{edge.name}エッジ</h4>
            <div style={{ display: 'flex', gap: '20px', fontSize: '14px' }}>
              <div>
                <strong>{edge.labels[0]}:</strong>{' '}
                {colorEmoji[cubeState.stickers[edge.positions[0]] as keyof typeof colorEmoji]}{' '}
                ({cubeState.stickers[edge.positions[0]]})
              </div>
              <div>
                <strong>{edge.labels[1]}:</strong>{' '}
                {colorEmoji[cubeState.stickers[edge.positions[1]] as keyof typeof colorEmoji]}{' '}
                ({cubeState.stickers[edge.positions[1]]})
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#FFF9C4', borderRadius: '6px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#F57C00' }}>期待される動き（U回転時）</h4>
        <p style={{ margin: '5px 0', fontSize: '14px' }}>
          • UF → UL （緑→オレンジ）<br/>
          • UR → UF （赤→緑）<br/>
          • UB → UR （青→赤）<br/>
          • UL → UB （オレンジ→青）
        </p>
      </div>
    </div>
  );
};