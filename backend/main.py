"""Main FastAPI application for the cube solver backend."""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any

from models.cube import SolveRequest, SolveResponse, CubeSize, ScrambleResponse
from solver import CubeSolver, KociembaSolver
import random

app = FastAPI(
    title="3D Cube Solver API",
    description="API for solving Rubik's cubes and similar puzzles",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Solver instances
solvers: Dict[str, CubeSolver] = {
    "kociemba": KociembaSolver()
}


@app.get("/")
async def root():
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
async def solve_cube(request: SolveRequest):
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
    
    # Validate the state
    if not solver.validate_state(request.cube_state.state):
        raise HTTPException(
            status_code=400,
            detail="Invalid or unsolvable cube state"
        )
    
    try:
        # Solve the cube
        solution = solver.solve(request.cube_state.state)
        
        return SolveResponse(
            solution=solution,
            move_count=len(solution),
            solver_used=request.solver_type
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to solve cube: {str(e)}"
        )


@app.get("/scramble/{cube_size}", response_model=ScrambleResponse)
async def generate_scramble(cube_size: CubeSize = CubeSize.SIZE_3X3, length: int = 20):
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
async def list_solvers():
    """List available solving algorithms."""
    return {
        "solvers": {
            name: solver.get_info() 
            for name, solver in solvers.items()
        },
        "default": "kociemba"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}