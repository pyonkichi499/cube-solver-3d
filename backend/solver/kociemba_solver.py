"""Kociemba algorithm solver implementation."""
import kociemba
from typing import List, Optional
from .base import CubeSolver

VALID_COLORS = frozenset('URFDLB')
EXPECTED_STICKER_COUNT = 54
STICKERS_PER_FACE = 9


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

        Note:
            Kociemba library may return non-empty moves even for an already-solved state.
        """
        try:
            solution = kociemba.solve(cube_state)
            if not solution:
                return []
            return solution.split()
        except ValueError as e:
            raise ValueError(f"Failed to solve cube: {e}")

    def validate_state(self, cube_state: str) -> bool:
        """
        Validate if the given cube state is valid and solvable.

        Args:
            cube_state: 54-character string representing the cube state

        Returns:
            True if the state is valid and solvable
        """
        if not self._validate_format(cube_state):
            return False

        # Try to solve it to verify it's solvable (catches parity errors)
        try:
            kociemba.solve(cube_state)
            return True
        except Exception:
            return False

    def validate_and_solve(self, cube_state: str) -> Optional[List[str]]:
        """
        Validate and solve in one pass to avoid calling kociemba.solve() twice.

        Returns:
            List of moves if valid and solvable, None otherwise
        """
        if not self._validate_format(cube_state):
            return None

        try:
            solution = kociemba.solve(cube_state)
            if not solution:
                return []
            return solution.split()
        except Exception:
            return None

    @staticmethod
    def _validate_format(cube_state: str) -> bool:
        """Validate string format without attempting to solve."""
        if len(cube_state) != EXPECTED_STICKER_COUNT:
            return False

        if not all(c in VALID_COLORS for c in cube_state):
            return False

        for color in VALID_COLORS:
            if cube_state.count(color) != STICKERS_PER_FACE:
                return False

        return True