"""Kociemba algorithm solver implementation."""
import kociemba
from typing import List
from .base import CubeSolver


class KociembaSolver(CubeSolver):
    """Solver using Kociemba's two-phase algorithm for optimal solutions."""
    
    def solve(self, cube_state: str) -> List[str]:
        """
        Solve the cube using Kociemba algorithm.
        
        Args:
            cube_state: 54-character string representing the cube state
                       Order: UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB
        
        Returns:
            List of moves to solve the cube
        """
        try:
            # Kociemba returns a string like "R U R' U'"
            solution = kociemba.solve(cube_state)
            if not solution:
                return []
            return solution.split()
        except Exception as e:
            raise ValueError(f"Failed to solve cube: {str(e)}")
    
    def validate_state(self, cube_state: str) -> bool:
        """
        Validate if the given cube state is valid and solvable.
        
        Args:
            cube_state: 54-character string representing the cube state
        
        Returns:
            True if the state is valid and solvable
        """
        # Basic validation
        if len(cube_state) != 54:
            return False
        
        # Check if all characters are valid face colors
        valid_colors = set('URFDLB')
        if not all(c in valid_colors for c in cube_state):
            return False
        
        # Check if we have exactly 9 of each color
        for color in valid_colors:
            if cube_state.count(color) != 9:
                return False
        
        # Try to solve it to verify it's solvable
        try:
            kociemba.solve(cube_state)
            return True
        except:
            return False