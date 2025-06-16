import { useState } from 'react';
import './App.css';
import { Cube3D } from './components/Cube3D';
import * as CubeTypes from './types/cube';
import { createSolvedCube, cubeStateToString, applyMoves, stringToCubeState } from './utils/cubeUtils';
import { cubeApi } from './api/cubeApi';

type CubeState = CubeTypes.CubeState;
type Color = CubeTypes.Color;

function App() {
  const [cubeState, setCubeState] = useState<CubeState>(createSolvedCube());
  const [solution, setSolution] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScramble = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Temporary mock scramble while backend is not running
      const mockScramble = ["R", "U", "R'", "U'", "F", "D", "F'", "D'"];
      
      // For now, just randomize the colors since applyMoves is not implemented
      const colors: Color[] = ['white', 'yellow', 'orange', 'red', 'green', 'blue'];
      const scrambledStickers: Color[] = [];
      
      // Create a somewhat scrambled state (not a real scramble, just for visualization)
      for (let i = 0; i < 54; i++) {
        const faceIndex = Math.floor(i / 9);
        // Keep some structure but add randomness
        if (Math.random() > 0.3) {
          scrambledStickers.push(colors[faceIndex]);
        } else {
          scrambledStickers.push(colors[Math.floor(Math.random() * 6)]);
        }
      }
      
      setCubeState({ stickers: scrambledStickers });
      setSolution([]);
    } catch (err) {
      setError('Failed to generate scramble');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSolve = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Mock solution while backend is not running
      setTimeout(() => {
        setSolution(["R", "U", "R'", "U'", "R", "U", "R'", "U'"]);
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to solve cube');
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCubeState(createSolvedCube());
    setSolution([]);
    setError(null);
  };

  return (
    <div className="App">
      <h1>3D Cube Solver</h1>
      
      <div className="cube-container">
        <Cube3D cubeState={cubeState} />
      </div>

      <div className="controls">
        <button onClick={handleReset} disabled={isLoading}>
          Reset
        </button>
        <button onClick={handleScramble} disabled={isLoading}>
          Scramble
        </button>
        <button onClick={handleSolve} disabled={isLoading}>
          Solve
        </button>
      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {solution.length > 0 && (
        <div className="solution">
          <h3>Solution ({solution.length} moves):</h3>
          <p>{solution.join(' ')}</p>
        </div>
      )}

      {isLoading && <div className="loading">Loading...</div>}
    </div>
  );
}

export default App;
