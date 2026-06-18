"""Main FastAPI application for the cube solver backend."""
import logging
import os
import random
from typing import Dict, Any, List

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from models.cube import SolveRequest, SolveResponse, CubeSize, ScrambleResponse
from solver import CubeSolver, KociembaSolver

logger = logging.getLogger(__name__)

app = FastAPI(
    title="3D Cube Solver API",
    description="API for solving Rubik's cubes and similar puzzles",
    version="1.0.0"
)

# Configure CORS
ALLOWED_ORIGINS = os.environ.get(
    "CORS_ORIGINS",
    "http://localhost:3000,http://localhost:5173"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)

# Solver instances
solvers: Dict[str, CubeSolver] = {
    "kociemba": KociembaSolver()
}


@app.get("/")
async def root() -> Dict[str, Any]:
    """Root endpoint."""
    return {
        "message": "3D Cube Solver API",
        "version": "1.0.0",
        "endpoints": {
            "solve": "/solve",
            "scramble": "/scramble",
            "solvers": "/solvers"
        }
    }


@app.post("/solve", response_model=SolveResponse)
async def solve_cube(request: SolveRequest) -> SolveResponse:
    """Solve a cube given its current state."""
    # Currently only 3x3 is supported
    if request.cube_state.size != CubeSize.SIZE_3X3:
        raise HTTPException(
            status_code=400,
            detail=f"Size {request.cube_state.size} is not yet supported. Only 3x3 is currently available."
        )

    # Get the solver
    solver = solvers.get(request.solver_type)
    if not solver:
        raise HTTPException(
            status_code=400,
            detail=f"Solver '{request.solver_type}' not found. Available: {list(solvers.keys())}"
        )

    try:
        solution = solver.validate_and_solve(request.cube_state.state)
        if solution is None:
            raise HTTPException(
                status_code=400,
                detail="Invalid or unsolvable cube state"
            )

        return SolveResponse(
            solution=solution,
            move_count=len(solution),
            solver_used=request.solver_type
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to solve cube: %s", e)
        raise HTTPException(
            status_code=500,
            detail="An internal error occurred while solving the cube"
        )


@app.get("/scramble/{cube_size}", response_model=ScrambleResponse)
async def generate_scramble(
    cube_size: CubeSize = CubeSize.SIZE_3X3,
    length: int = Query(default=20, ge=1, le=100),
) -> ScrambleResponse:
    """Generate a random scramble for the specified cube size."""
    # Currently only 3x3 is supported
    if cube_size != CubeSize.SIZE_3X3:
        raise HTTPException(
            status_code=400,
            detail=f"Size {cube_size} is not yet supported. Only 3x3 is currently available."
        )
    
    # Basic scramble generation for 3x3
    moves = ["U", "D", "L", "R", "F", "B"]
    modifiers = ["", "'", "2"]
    
    scramble = []
    last_move = None
    
    for _ in range(length):
        # Avoid same face twice in a row
        available_moves = [m for m in moves if m != last_move]
        move = random.choice(available_moves)
        modifier = random.choice(modifiers)
        
        scramble.append(f"{move}{modifier}")
        last_move = move
    
    return ScrambleResponse(
        scramble=scramble,
        scramble_string=" ".join(scramble),
        cube_size=cube_size
    )


@app.get("/solvers")
async def list_solvers() -> Dict[str, Any]:
    """List available solving algorithms."""
    return {
        "solvers": {
            name: solver.get_info() 
            for name, solver in solvers.items()
        },
        "default": "kociemba"
    }


@app.get("/health")
async def health_check() -> Dict[str, str]:
    """Health check endpoint."""
    return {"status": "healthy"}