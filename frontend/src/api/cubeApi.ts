import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5秒でタイムアウト
});

export interface SolveRequest {
  cube_state: {
    size: '3x3';
    state: string;
  };
  solver_type?: string;
}

export interface SolveResponse {
  solution: string[];
  move_count: number;
  solver_used: string;
}

export interface ScrambleResponse {
  scramble: string[];
  scramble_string: string;
  cube_size: string;
}

// モック機能とフォールバック用の関数
export const mockFunctions = {
  // モックスクランブル生成
  generateMockScramble: (length: number = 20): ScrambleResponse => {
    const moves = ['R', 'L', 'U', 'D', 'F', 'B'];
    const modifiers = ['', '\'', '2'];
    const scramble: string[] = [];

    for (let i = 0; i < length; i++) {
      const move = moves[Math.floor(Math.random() * moves.length)];
      const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
      scramble.push(move + modifier);
    }

    return {
      scramble,
      scramble_string: scramble.join(' '),
      cube_size: '3x3'
    };
  },

  // モック解法生成
  generateMockSolution: (_cubeState: string): SolveResponse => {
    // 簡単なモック解法（実際の解法ではありません）
    const mockSolution = ['R', 'U', 'R\'', 'U\'', 'R', 'U2', 'R\'', 'U'];

    return {
      solution: mockSolution,
      move_count: mockSolution.length,
      solver_used: 'mock-solver (フロントエンドのみモード)'
    };
  },

  // API利用可能性をチェック
  isApiAvailable: async (): Promise<boolean> => {
    try {
      await api.get('/health');
      return true;
    } catch (error) {
      return false;
    }
  }
};

export const cubeApi = {
  // Solve a cube
  solve: async (cubeState: string, solverType: string = 'kociemba'): Promise<SolveResponse> => {
    const response = await api.post<SolveResponse>('/solve', {
      cube_state: {
        size: '3x3',
        state: cubeState,
      },
      solver_type: solverType,
    });
    return response.data;
  },

  // Generate a scramble
  getScramble: async (length: number = 20): Promise<ScrambleResponse> => {
    const response = await api.get<ScrambleResponse>(`/scramble/3x3?length=${length}`);
    return response.data;
  },

  // Get available solvers
  getSolvers: async () => {
    const response = await api.get('/solvers');
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  },

  // API利用可能性をチェック
  isApiAvailable: mockFunctions.isApiAvailable,
};
