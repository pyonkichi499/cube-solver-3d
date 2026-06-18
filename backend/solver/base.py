"""Base solver interface for cube solving algorithms."""
from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional


class CubeSolver(ABC):
    """Abstract base class for cube solving algorithms."""
    
    @abstractmethod
    def solve(self, cube_state: str) -> List[str]:
        """
        Solve the cube from the given state.
        
        Args:
            cube_state: String representation of the cube state
                       Format depends on the specific solver implementation
        
        Returns:
            List of moves to solve the cube (e.g., ["R", "U", "R'", "U'"])
        """
        pass
    
    @abstractmethod
    def validate_state(self, cube_state: str) -> bool:
        """
        Validate if the given cube state is valid and solvable.
        
        Args:
            cube_state: String representation of the cube state
        
        Returns:
            True if the state is valid and solvable, False otherwise
        """
        pass
    
    def validate_and_solve(self, cube_state: str) -> Optional[List[str]]:
        """
        Validate and solve in one pass.

        Default implementation calls validate_state() then solve().
        Subclasses can override for optimization (e.g., to avoid redundant computation).

        Returns:
            List of moves if valid and solvable, None otherwise
        """
        if not self.validate_state(cube_state):
            return None
        try:
            return self.solve(cube_state)
        except Exception:
            return None

    def get_info(self) -> Dict[str, Any]:
        """
        Get information about the solver.
        
        Returns:
            Dictionary containing solver information
        """
        return {
            "name": self.__class__.__name__,
            "description": self.__doc__ or "No description available"
        }