# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

3D Rubik's Cube solver with web-based visualization. Users can view, manipulate, and solve 3x3x3 cubes with automatic solving capabilities.

## Development Status

**Current State**: Full API integration completed with fallback support
- ✅ Frontend: React + TypeScript + Three.js for 3D cube display
- ✅ Backend: Python FastAPI with Kociemba solver
- ✅ 3D rendering with proper lighting and materials
- ✅ Full cube rotation logic (all faces: R, L, U, D, F, B with prime and double moves)
- ✅ Undo/Redo functionality
- ✅ Frontend-backend API integration fully connected
- ✅ Solve functionality connected to Kociemba solver
- ✅ Scramble generation using backend API
- ✅ Fallback to mock functions when API unavailable
- ✅ Debug mode with sticker tracking
- ✅ API health check and status display
- ✅ Error handling and loading states
- ❌ Rotation animations not implemented
- ❌ Manual cube manipulation (click/drag to rotate faces)

## Key Architecture Decisions

1. **Frontend**: React + TypeScript + Three.js
   - Component-based architecture
   - 3D rendering with react-three-fiber
   - State management with React hooks

2. **Backend**: Python + FastAPI
   - RESTful API design
   - Pluggable solver architecture via abstract base class
   - Kociemba algorithm as default solver

3. **Data Flow**:
   - Cube state represented as 54-character string (UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB)
   - API communication via JSON
   - Moves in standard notation (R, U, R', U', etc.)

## Development Commands

### Backend
```bash
cd backend
rye sync  # Install dependencies
rye run uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev  # Development server on http://localhost:5173
npm run build  # Production build
```

### Running Both
```bash
# Terminal 1 - Backend
cd backend && rye run uvicorn main:app --reload

# Terminal 2 - Frontend
cd frontend && npm run dev
```

## Project Structure

```
cube-solver-3d/
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # React components (Cube3D.tsx)
│   │   ├── types/         # TypeScript type definitions
│   │   ├── utils/         # Utility functions
│   │   └── api/           # API client
│   └── package.json
├── backend/               # Python backend
│   ├── main.py           # FastAPI application
│   ├── models/           # Pydantic models
│   └── solver/           # Solver implementations
│       ├── base.py       # Abstract solver interface
│       └── kociemba_solver.py
└── README.md
```

## API Endpoints

- `GET /` - API info
- `POST /solve` - Solve a cube state
- `GET /scramble/{cube_size}` - Generate scramble
- `GET /solvers` - List available solvers
- `GET /health` - Health check

## Adding New Solvers

Implement the `CubeSolver` interface in `backend/solver/`:
```python
from solver.base import CubeSolver

class CustomSolver(CubeSolver):
    def solve(self, cube_state: str) -> List[str]:
        # Implementation
    
    def validate_state(self, cube_state: str) -> bool:
        # Implementation
```