"""Cube-related data models."""
from pydantic import BaseModel, Field, validator
from typing import List, Optional, Literal
from enum import Enum


class CubeSize(str, Enum):
    """Supported cube sizes."""
    SIZE_2X2 = "2x2"
    SIZE_3X3 = "3x3"
    SIZE_4X4 = "4x4"
    SIZE_5X5 = "5x5"
    SIZE_6X6 = "6x6"
    SIZE_7X7 = "7x7"


class CubeState(BaseModel):
    """Model for cube state representation."""
    size: CubeSize = Field(default=CubeSize.SIZE_3X3, description="Size of the cube")
    state: str = Field(..., description="String representation of the cube state")
    
    @validator('state')
    def validate_state_length(cls, v, values):
        size = values.get('size', CubeSize.SIZE_3X3)
        expected_length = {
            CubeSize.SIZE_2X2: 24,  # 6 faces * 4 stickers
            CubeSize.SIZE_3X3: 54,  # 6 faces * 9 stickers
            CubeSize.SIZE_4X4: 96,  # 6 faces * 16 stickers
            CubeSize.SIZE_5X5: 150, # 6 faces * 25 stickers
            CubeSize.SIZE_6X6: 216, # 6 faces * 36 stickers
            CubeSize.SIZE_7X7: 294, # 6 faces * 49 stickers
        }
        
        if len(v) != expected_length.get(size, 54):
            raise ValueError(f"Invalid state length for {size} cube")
        return v


class SolveRequest(BaseModel):
    """Request model for solving a cube."""
    cube_state: CubeState
    solver_type: Optional[str] = Field(default="kociemba", description="Type of solver to use")


class SolveResponse(BaseModel):
    """Response model for cube solution."""
    solution: List[str] = Field(..., description="List of moves to solve the cube")
    move_count: int = Field(..., description="Number of moves in the solution")
    solver_used: str = Field(..., description="Name of the solver algorithm used")


class CubeMove(BaseModel):
    """Model for a single cube move."""
    face: Literal["U", "D", "L", "R", "F", "B", "M", "E", "S", "x", "y", "z"]
    direction: Literal["", "'", "2"] = Field(default="", description="Direction of rotation")
    
    @property
    def notation(self) -> str:
        """Get standard notation for the move."""
        return f"{self.face}{self.direction}"


class ScrambleResponse(BaseModel):
    """Response model for generating a scramble."""
    scramble: List[str] = Field(..., description="List of moves for scrambling")
    scramble_string: str = Field(..., description="Scramble as a single string")
    cube_size: CubeSize = Field(..., description="Size of the cube")