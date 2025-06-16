import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
};