import { useState, useCallback } from 'react';
import type { CubeState } from '../types/cube';
import { createSolvedCube } from '../utils/cubeUtils';

interface UseCubeHistoryReturn {
  cubeState: CubeState;
  lastScramble: string[];
  canUndo: boolean;
  canRedo: boolean;
  historyIndex: number;
  historyLength: number;
  addToHistory: (newState: CubeState) => void;
  handleUndo: () => void;
  handleRedo: () => void;
  reset: () => void;
  setLastScramble: React.Dispatch<React.SetStateAction<string[]>>;
}

export const useCubeHistory = (): UseCubeHistoryReturn => {
  const [cubeState, setCubeState] = useState<CubeState>(createSolvedCube());
  const [history, setHistory] = useState<CubeState[]>([createSolvedCube()]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [lastScramble, setLastScramble] = useState<string[]>([]);

  const addToHistory = useCallback((newState: CubeState) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newState);
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
    setCubeState(newState);
  }, [historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCubeState(history[newIndex]);
      setLastScramble(prev => prev.length > 0 ? prev.slice(0, -1) : prev);
    }
  }, [historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCubeState(history[newIndex]);
    }
  }, [historyIndex, history]);

  const reset = useCallback(() => {
    const solvedState = createSolvedCube();
    setHistory([solvedState]);
    setHistoryIndex(0);
    setCubeState(solvedState);
    setLastScramble([]);
  }, []);

  return {
    cubeState,
    lastScramble,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    historyIndex,
    historyLength: history.length,
    addToHistory,
    handleUndo,
    handleRedo,
    reset,
    setLastScramble,
  };
};
