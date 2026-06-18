import './App.css';
import { Cube3D } from './components/Cube3D';
import { DebugPanel } from './components/DebugPanel';
import { RotationTracker } from './components/RotationTracker';
import { useState } from 'react';
import { applyMoves, createSolvedCube } from './utils/cubeUtils';
import { getSimplifiedMovesDisplay, getLastMoveGroup } from './utils/moveSimplifier';
import { useCubeHistory } from './hooks/useCubeHistory';
import { useCubeApi } from './hooks/useCubeApi';

// デバッグユーティリティは開発時のみ読み込み
if (import.meta.env.DEV) {
  import('./utils/cubeTests');
  import('./utils/cubeDebug');
  import('./utils/debugRotations');
  import('./utils/debugURotation');
  import('./utils/debugFaceOrder');
}

// 複合手順定義
const COMPLEX_MOVES = [
  { name: "Sexy Move", moves: ["R", "U", "R'", "U'"] },
  { name: "Sledgehammer", moves: ["R'", "F", "R", "F'"] },
  { name: "T-Perm", moves: ["R", "U", "R'", "U'", "R'", "F", "R2", "U'", "R'", "U'", "R", "U", "R'", "F'"] },
  { name: "Y-Perm", moves: ["F", "R", "U'", "R'", "U'", "R", "U", "R'", "F'", "R", "U", "R'", "U'", "R'", "F", "R", "F'"] },
] as const;

const VALID_MOVES = [
  "R", "R'", "R2", "U", "U'", "U2", "F", "F'", "F2",
  "D", "D'", "D2", "L", "L'", "L2", "B", "B'", "B2",
];

function App() {
  const {
    cubeState, lastScramble, canUndo, canRedo,
    historyIndex, historyLength,
    addToHistory, handleUndo, handleRedo, reset, setLastScramble,
  } = useCubeHistory();

  const {
    apiAvailable, isLoading, error, solution,
    handleScramble, handleSolve, setError, setSolution,
  } = useCubeApi();

  const [debugMode, setDebugMode] = useState(false);
  const [scrambleInput, setScrambleInput] = useState('');

  const onScramble = () => {
    handleScramble((scrambleMoves, scrambledState) => {
      addToHistory(scrambledState);
      setLastScramble(scrambleMoves);
    });
  };

  const onSolve = () => handleSolve(cubeState);

  const onReset = () => {
    reset();
    setSolution([]);
    setError(null);
  };

  const applyTestScramble = (moves: string[]) => {
    try {
      setError(null);
      if (import.meta.env.DEV) console.log('Applying test moves:', moves.join(' '));
      const newState = applyMoves(cubeState, moves);
      addToHistory(newState);
      setLastScramble(prev => [...prev, ...moves]);
      setSolution([]);
    } catch (err) {
      setError('手順の適用に失敗しました');
      if (import.meta.env.DEV) console.error(err);
    }
  };

  const applyScrambleString = () => {
    try {
      setError(null);
      const moves = scrambleInput.trim().split(/\s+/).filter(move => move.length > 0);

      if (moves.length === 0) {
        setError('スクランブルを入力してください');
        return;
      }

      const invalidMoves = moves.filter(move => !VALID_MOVES.includes(move));
      if (invalidMoves.length > 0) {
        setError(`無効な手順: ${invalidMoves.join(', ')}`);
        return;
      }

      if (import.meta.env.DEV) console.log('Applying scramble:', moves.join(' '));
      const scrambledState = applyMoves(createSolvedCube(), moves);
      addToHistory(scrambledState);
      setLastScramble(moves);
      setSolution([]);
      setScrambleInput('');
    } catch (err) {
      setError('スクランブルの適用に失敗しました');
      if (import.meta.env.DEV) console.error(err);
    }
  };

  return (
    <div className="App">
      <h1>3D Cube Solver</h1>

      {apiAvailable !== null && (
        <div className={`api-status ${apiAvailable ? 'api-available' : 'api-unavailable'}`}>
          {apiAvailable ? (
            <span>🟢 バックエンドAPI接続済み - 完全機能利用可能</span>
          ) : (
            <span>🟡 フロントエンドのみモード - 基本機能のみ利用可能（スクランブル・解法はモック機能）</span>
          )}
        </div>
      )}

      <div className="cube-container">
        <Cube3D cubeState={cubeState} debugMode={debugMode} />
      </div>

      <div className="controls">
        <button onClick={onReset} disabled={isLoading}>Reset (完成状態)</button>
        <button onClick={onScramble} disabled={isLoading}>Random Scramble</button>
        <button onClick={onSolve} disabled={isLoading}>Solve</button>
        <button onClick={() => setDebugMode(!debugMode)} className={debugMode ? 'active' : ''}>
          {debugMode ? 'デバッグモードOFF' : 'デバッグモードON'}
        </button>
      </div>

      <div className="controls">
        <button onClick={handleUndo} disabled={isLoading || !canUndo} className="undo-button">← Undo</button>
        <span className="history-info">{historyIndex + 1} / {historyLength}</span>
        <button onClick={handleRedo} disabled={isLoading || !canRedo} className="redo-button">Redo →</button>
      </div>

      <div className="scramble-input-container">
        <h3>スクランブル入力</h3>
        <div className="scramble-input-row">
          <input
            type="text"
            value={scrambleInput}
            onChange={(e) => setScrambleInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') applyScrambleString(); }}
            placeholder="例: R U R' U' R U2 R'"
            className="scramble-input"
            disabled={isLoading}
          />
          <button onClick={applyScrambleString} disabled={isLoading || !scrambleInput.trim()}>適用</button>
        </div>
        <div className="scramble-help">
          <small>使用可能: R, L, U, D, F, B (各面の時計回り)、' (反時計回り)、2 (180度回転)</small>
        </div>
      </div>

      <div className="test-controls">
        <h3>基本回転 (現在の状態に追加適用)</h3>
        <div className="move-grid">
          {(['', "'", '2'] as const).map(suffix => (
            <div className="move-row" key={suffix}>
              {(['R', 'L', 'U', 'D', 'F', 'B'] as const).map(face => {
                const move = `${face}${suffix}`;
                return (
                  <button key={move} onClick={() => applyTestScramble([move])} disabled={isLoading} className="test-button basic-move">
                    {move}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="test-controls">
        <h3>複合手順</h3>
        <div className="test-buttons">
          {COMPLEX_MOVES.map((move) => (
            <button key={move.name} onClick={() => applyTestScramble([...move.moves])} disabled={isLoading} className="test-button complex-move">
              {move.name}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {lastScramble.length > 0 && (() => {
        const { original, simplified, count } = getSimplifiedMovesDisplay(lastScramble);
        const lastGroup = getLastMoveGroup(lastScramble);
        return (
          <div className="scramble-info">
            <h3>適用済み手順:</h3>
            <div className="moves-display">
              <div className="simplified-moves">
                <strong>統合表示 ({count} moves):</strong>
                <p className="scramble-sequence simplified">{simplified || '(なし)'}</p>
              </div>
              <details className="detailed-moves">
                <summary>詳細表示 ({lastScramble.length} moves)</summary>
                <div className="original-moves">
                  <p className="scramble-sequence original">{original}</p>
                  {lastGroup.length > 1 && (
                    <div className="last-group-info">
                      <small>
                        最後のグループ: <span className="highlight">{lastGroup.join(' ')}</span>
                        {` → ${getSimplifiedMovesDisplay(lastGroup).simplified}`}
                      </small>
                    </div>
                  )}
                </div>
              </details>
            </div>
          </div>
        );
      })()}

      {solution.length > 0 && (
        <div className="solution">
          <h3>Solution ({solution.length} moves):</h3>
          <p>{solution.join(' ')}</p>
        </div>
      )}

      {isLoading && <div className="loading">Loading...</div>}

      {debugMode && (
        <>
          <RotationTracker cubeState={cubeState} moves={lastScramble} />
          <DebugPanel cubeState={cubeState} />
        </>
      )}
    </div>
  );
}

export default App;
