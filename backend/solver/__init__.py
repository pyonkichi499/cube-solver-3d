"""Solver module for cube solving algorithms."""
from .base import CubeSolver
from .kociemba_solver import KociembaSolver

__all__ = ['CubeSolver', 'KociembaSolver']