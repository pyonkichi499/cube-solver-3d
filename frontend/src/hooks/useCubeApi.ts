import { useState, useEffect, useCallback } from 'react';
import type { CubeState } from '../types/cube';
import { cubeStateToString, createSolvedCube, applyMoves } from '../utils/cubeUtils';
import { cubeApi, mockFunctions } from '../api/cubeApi';

interface UseCubeApiReturn {
  apiAvailable: boolean | null;
  isLoading: boolean;
  error: string | null;
  solution: string[];
  handleScramble: (onSuccess: (scrambleMoves: string[], scrambledState: CubeState) => void) => Promise<void>;
  handleSolve: (cubeState: CubeState) => Promise<void>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setSolution: React.Dispatch<React.SetStateAction<string[]>>;
}

export const useCubeApi = (): UseCubeApiReturn => {
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [solution, setSolution] = useState<string[]>([]);

  useEffect(() => {
    const checkApiStatus = async () => {
      const isAvailable = await cubeApi.isApiAvailable();
      setApiAvailable(isAvailable);
    };
    checkApiStatus();
  }, []);

  const handleScramble = useCallback(async (
    onSuccess: (scrambleMoves: string[], scrambledState: CubeState) => void,
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      let response;
      if (apiAvailable) {
        try {
          response = await cubeApi.getScramble(20);
          if (import.meta.env.DEV) console.log('Scramble from API:', response.scramble.join(' '));
        } catch (apiError) {
          if (import.meta.env.DEV) console.error('API error:', apiError);
          response = mockFunctions.generateMockScramble(20);
          if (import.meta.env.DEV) console.log('Using mock scramble:', response.scramble.join(' '));
        }
      } else {
        response = mockFunctions.generateMockScramble(20);
        if (import.meta.env.DEV) console.log('Using mock scramble (API unavailable):', response.scramble.join(' '));
      }

      const scrambleMoves = response.scramble;
      const scrambledState = applyMoves(createSolvedCube(), scrambleMoves);
      onSuccess(scrambleMoves, scrambledState);
      setSolution([]);
    } catch (err) {
      setError('スクランブルの生成に失敗しました');
      if (import.meta.env.DEV) console.error('Scramble error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [apiAvailable]);

  const handleSolve = useCallback(async (cubeState: CubeState) => {
    try {
      setIsLoading(true);
      setError(null);

      const cubeStateString = cubeStateToString(cubeState);
      if (import.meta.env.DEV) console.log('Sending cube state to API:', cubeStateString);

      let response;
      if (apiAvailable) {
        try {
          response = await cubeApi.solve(cubeStateString);
          if (import.meta.env.DEV) {
            console.log('Solution from API:', response.solution.join(' '));
            console.log('Move count:', response.move_count);
            console.log('Solver used:', response.solver_used);
          }
        } catch (apiError) {
          if (import.meta.env.DEV) console.error('API error:', apiError);
          response = mockFunctions.generateMockSolution(cubeStateString);
          if (import.meta.env.DEV) console.log('Using mock solution:', response.solution.join(' '));
        }
      } else {
        response = mockFunctions.generateMockSolution(cubeStateString);
        if (import.meta.env.DEV) console.log('Using mock solution (API unavailable):', response.solution.join(' '));
      }

      setSolution(response.solution);
    } catch (err) {
      setError('解法の算出に失敗しました');
      if (import.meta.env.DEV) console.error('Solve error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [apiAvailable]);

  return {
    apiAvailable,
    isLoading,
    error,
    solution,
    handleScramble,
    handleSolve,
    setError,
    setSolution,
  };
};
