import { useState, useEffect } from 'react';
import './App.css';
import { Cube3D } from './components/Cube3D';
import { DebugPanel } from './components/DebugPanel';
import { RotationTracker } from './components/RotationTracker';
import * as CubeTypes from './types/cube';
import { createSolvedCube, cubeStateToString, applyMoves } from './utils/cubeUtils';
import { cubeApi, mockFunctions } from './api/cubeApi';
import { getSimplifiedMovesDisplay, getLastMoveGroup } from './utils/moveSimplifier';

// テスト関数を読み込み（ブラウザコンソールで使用可能にする）
import './utils/cubeTests';
import './utils/cubeDebug';
import './utils/debugRotations';
import './utils/debugURotation';
import './utils/debugFaceOrder';

type CubeState = CubeTypes.CubeState;

function App() {
  const [cubeState, setCubeState] = useState<CubeState>(createSolvedCube());
  const [solution, setSolution] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastScramble, setLastScramble] = useState<string[]>([]);
  const [debugMode, setDebugMode] = useState(false);
  const [scrambleInput, setScrambleInput] = useState<string>('');
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);

  // Undo/Redo用の履歴管理
  const [history, setHistory] = useState<CubeState[]>([createSolvedCube()]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // APIの状態をチェック
  useEffect(() => {
    const checkApiStatus = async () => {
      const isAvailable = await cubeApi.isApiAvailable();
      setApiAvailable(isAvailable);
    };
    checkApiStatus();
  }, []);

  // 新しい状態を履歴に追加
  const addToHistory = (newState: CubeState) => {
    // 現在のインデックス以降の履歴を削除（新しい分岐を作る）
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCubeState(newState);
  };

  // Undo機能
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCubeState(history[newIndex]);

      // 最後の手順を削除
      if (lastScramble.length > 0) {
        setLastScramble(lastScramble.slice(0, -1));
      }
    }
  };

  // Redo機能
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCubeState(history[newIndex]);
    }
  };

  const handleScramble = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let response;
      if (apiAvailable) {
        // Try to get scramble from backend API
        try {
          response = await cubeApi.getScramble(20);
          console.log('Scramble from API:', response.scramble.join(' '));
        } catch (apiError) {
          console.error('API error:', apiError);
          // Fall back to mock scramble
          response = mockFunctions.generateMockScramble(20);
          console.log('Using mock scramble:', response.scramble.join(' '));
        }
      } else {
        // Use mock scramble if API is not available
        response = mockFunctions.generateMockScramble(20);
        console.log('Using mock scramble (API unavailable):', response.scramble.join(' '));
      }

      const scrambleMoves = response.scramble;

      // Apply scramble moves to solved cube
      const scrambledState = applyMoves(createSolvedCube(), scrambleMoves);
      addToHistory(scrambledState);
      setLastScramble(scrambleMoves);
      setSolution([]); // Clear solution
    } catch (err) {
      setError('スクランブルの生成に失敗しました');
      console.error('Scramble error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSolve = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Convert cube state to API format
      const cubeStateString = cubeStateToString(cubeState);
      console.log('Sending cube state to API:', cubeStateString);

      let response;
      if (apiAvailable) {
        // Try to call solve API
        try {
          response = await cubeApi.solve(cubeStateString);
          console.log('Solution from API:', response.solution.join(' '));
          console.log('Move count:', response.move_count);
          console.log('Solver used:', response.solver_used);
        } catch (apiError) {
          console.error('API error:', apiError);
          // Fall back to mock solution
          response = mockFunctions.generateMockSolution(cubeStateString);
          console.log('Using mock solution:', response.solution.join(' '));
        }
      } else {
        // Use mock solution if API is not available
        response = mockFunctions.generateMockSolution(cubeStateString);
        console.log('Using mock solution (API unavailable):', response.solution.join(' '));
      }

      setSolution(response.solution);
    } catch (err) {
      setError('解法の算出に失敗しました');
      console.error('Solve error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    const solvedState = createSolvedCube();
    setHistory([solvedState]);
    setHistoryIndex(0);
    setCubeState(solvedState);
    setSolution([]);
    setLastScramble([]);
    setError(null);
  };

  // テスト用：指定した手順を適用
  const applyTestScramble = (moves: string[]) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Applying test moves:', moves.join(' '));
      // 現在の状態に手順を追加適用
      const newState = applyMoves(cubeState, moves);
      addToHistory(newState);

      // 手順を追記
      const combinedMoves = [...lastScramble, ...moves];
      setLastScramble(combinedMoves);
      setSolution([]);
    } catch (err) {
      setError('Failed to apply test moves');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 複合手順
  const complexMoves = [
    {
      name: "Sexy Move",
      moves: ["R", "U", "R'", "U'"]
    },
    {
      name: "Sledgehammer",
      moves: ["R'", "F", "R", "F'"]
    },
    {
      name: "T-Perm",
      moves: ["R", "U", "R'", "U'", "R'", "F", "R2", "U'", "R'", "U'", "R", "U", "R'", "F'"]
    },
    {
      name: "Y-Perm",
      moves: ["F", "R", "U'", "R'", "U'", "R", "U", "R'", "F'", "R", "U", "R'", "U'", "R'", "F", "R", "F'"]
    }
  ];

  // スクランブル文字列を適用
  const applyScrambleString = () => {
    try {
      setError(null);

      // 入力を解析
      const moves = scrambleInput.trim().split(/\s+/).filter(move => move.length > 0);

      if (moves.length === 0) {
        setError('スクランブルを入力してください');
        return;
      }

      // 有効な手順かチェック
      const validMoves = ["R", "R'", "R2", "U", "U'", "U2", "F", "F'", "F2",
        "D", "D'", "D2", "L", "L'", "L2", "B", "B'", "B2"];
      const invalidMoves = moves.filter(move => !validMoves.includes(move));

      if (invalidMoves.length > 0) {
        setError(`無効な手順: ${invalidMoves.join(', ')}`);
        return;
      }

      console.log('Applying scramble:', moves.join(' '));

      // 完成状態から適用
      const scrambledState = applyMoves(createSolvedCube(), moves);
      setHistory([createSolvedCube(), scrambledState]);
      setHistoryIndex(1);
      setCubeState(scrambledState);
      setLastScramble(moves);
      setSolution([]);
      setScrambleInput(''); // 入力をクリア
    } catch (err) {
      setError('スクランブルの適用に失敗しました');
      console.error(err);
    }
  };

  return (
    <div className="App">
      <h1>3D Cube Solver</h1>

      {/* API状態バナー */}
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
        <button onClick={handleReset} disabled={isLoading}>
          Reset (完成状態)
        </button>
        <button onClick={handleScramble} disabled={isLoading}>
          Random Scramble
        </button>
        <button onClick={handleSolve} disabled={isLoading}>
          Solve
        </button>
        <button onClick={() => setDebugMode(!debugMode)} className={debugMode ? 'active' : ''}>
          {debugMode ? 'デバッグモードOFF' : 'デバッグモードON'}
        </button>
      </div>

      <div className="controls">
        <button
          onClick={handleUndo}
          disabled={isLoading || historyIndex === 0}
          className="undo-button"
        >
          ← Undo
        </button>
        <span className="history-info">
          {historyIndex + 1} / {history.length}
        </span>
        <button
          onClick={handleRedo}
          disabled={isLoading || historyIndex === history.length - 1}
          className="redo-button"
        >
          Redo →
        </button>
      </div>

      <div className="scramble-input-container">
        <h3>スクランブル入力</h3>
        <div className="scramble-input-row">
          <input
            type="text"
            value={scrambleInput}
            onChange={(e) => setScrambleInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                applyScrambleString();
              }
            }}
            placeholder="例: R U R' U' R U2 R'"
            className="scramble-input"
            disabled={isLoading}
          />
          <button onClick={applyScrambleString} disabled={isLoading || !scrambleInput.trim()}>
            適用
          </button>
        </div>
        <div className="scramble-help">
          <small>
            使用可能: R, L, U, D, F, B (各面の時計回り)、
            ' (反時計回り)、2 (180度回転)
          </small>
        </div>
      </div>

      <div className="test-controls">
        <h3>基本回転 (現在の状態に追加適用)</h3>
        <div className="move-grid">
          {/* 1行目: R, L, U, D, F, B */}
          <div className="move-row">
            <button onClick={() => applyTestScramble(["R"])} disabled={isLoading} className="test-button basic-move">R</button>
            <button onClick={() => applyTestScramble(["L"])} disabled={isLoading} className="test-button basic-move">L</button>
            <button onClick={() => applyTestScramble(["U"])} disabled={isLoading} className="test-button basic-move">U</button>
            <button onClick={() => applyTestScramble(["D"])} disabled={isLoading} className="test-button basic-move">D</button>
            <button onClick={() => applyTestScramble(["F"])} disabled={isLoading} className="test-button basic-move">F</button>
            <button onClick={() => applyTestScramble(["B"])} disabled={isLoading} className="test-button basic-move">B</button>
          </div>
          {/* 2行目: R', L', U', D', F', B' */}
          <div className="move-row">
            <button onClick={() => applyTestScramble(["R'"])} disabled={isLoading} className="test-button basic-move">R'</button>
            <button onClick={() => applyTestScramble(["L'"])} disabled={isLoading} className="test-button basic-move">L'</button>
            <button onClick={() => applyTestScramble(["U'"])} disabled={isLoading} className="test-button basic-move">U'</button>
            <button onClick={() => applyTestScramble(["D'"])} disabled={isLoading} className="test-button basic-move">D'</button>
            <button onClick={() => applyTestScramble(["F'"])} disabled={isLoading} className="test-button basic-move">F'</button>
            <button onClick={() => applyTestScramble(["B'"])} disabled={isLoading} className="test-button basic-move">B'</button>
          </div>
          {/* 3行目: R2, L2, U2, D2, F2, B2 */}
          <div className="move-row">
            <button onClick={() => applyTestScramble(["R2"])} disabled={isLoading} className="test-button basic-move">R2</button>
            <button onClick={() => applyTestScramble(["L2"])} disabled={isLoading} className="test-button basic-move">L2</button>
            <button onClick={() => applyTestScramble(["U2"])} disabled={isLoading} className="test-button basic-move">U2</button>
            <button onClick={() => applyTestScramble(["D2"])} disabled={isLoading} className="test-button basic-move">D2</button>
            <button onClick={() => applyTestScramble(["F2"])} disabled={isLoading} className="test-button basic-move">F2</button>
            <button onClick={() => applyTestScramble(["B2"])} disabled={isLoading} className="test-button basic-move">B2</button>
          </div>
        </div>
      </div>

      <div className="test-controls">
        <h3>複合手順</h3>
        <div className="test-buttons">
          {complexMoves.map((move, index) => (
            <button
              key={index}
              onClick={() => applyTestScramble(move.moves)}
              disabled={isLoading}
              className="test-button complex-move"
            >
              {move.name}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {lastScramble.length > 0 && (() => {
        const { original, simplified, count } = getSimplifiedMovesDisplay(lastScramble);
        const lastGroup = getLastMoveGroup(lastScramble);

        return (
          <div className="scramble-info">
            <h3>適用済み手順:</h3>

            {/* 統合表示 */}
            <div className="moves-display">
              <div className="simplified-moves">
                <strong>統合表示 ({count} moves):</strong>
                <p className="scramble-sequence simplified">{simplified || '(なし)'}</p>
              </div>

              {/* 詳細表示 */}
              <details className="detailed-moves">
                <summary>詳細表示 ({lastScramble.length} moves)</summary>
                <div className="original-moves">
                  <p className="scramble-sequence original">{original}</p>

                  {lastGroup.length > 1 && (
                    <div className="last-group-info">
                      <small>
                        最後のグループ: <span className="highlight">{lastGroup.join(' ')}</span>
                        {lastGroup.length > 1 && ` → ${getSimplifiedMovesDisplay(lastGroup).simplified}`}
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
