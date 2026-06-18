"""Tests for the Kociemba solver."""
import pytest
from solver.kociemba_solver import KociembaSolver


class TestKociembaSolver:
    """Tests for the KociembaSolver implementation."""

    @pytest.fixture
    def solver(self):
        return KociembaSolver()

    def test_完成状態のバリデーションが成功する(self, solver, solved_state):
        assert solver.validate_state(solved_state) is True

    def test_不正な長さの状態を拒否する(self, solver):
        assert solver.validate_state("UUUU") is False

    def test_不正な文字を含む状態を拒否する(self, solver, invalid_state):
        assert solver.validate_state(invalid_state) is False

    def test_色の数が不正な状態を拒否する(self, solver):
        # 10 U's and 8 R's
        state = "UUUUUUUUUURRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB"
        assert solver.validate_state(state) is False

    def test_完成状態を解くとリストを返す(self, solver, solved_state):
        """Kociemba library may return identity moves for already-solved state."""
        result = solver.solve(solved_state)
        assert isinstance(result, list)

    def test_validate_and_solveが完成状態でリストを返す(self, solver, solved_state):
        result = solver.validate_and_solve(solved_state)
        assert result is not None
        assert isinstance(result, list)

    def test_validate_and_solveが不正な長さでNoneを返す(self, solver):
        result = solver.validate_and_solve("UUUU")
        assert result is None

    def test_validate_and_solveが不正な文字でNoneを返す(self, solver, invalid_state):
        result = solver.validate_and_solve(invalid_state)
        assert result is None

    def test_validate_and_solveが色数不正でNoneを返す(self, solver):
        # 10 U's and 8 R's
        state = "UUUUUUUUUURRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB"
        result = solver.validate_and_solve(state)
        assert result is None

    def test_ソルバー情報を取得できる(self, solver):
        info = solver.get_info()
        assert "name" in info
        assert info["name"] == "KociembaSolver"
        assert "description" in info
