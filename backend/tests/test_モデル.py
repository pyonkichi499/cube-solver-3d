"""Tests for Pydantic models."""
import pytest
from pydantic import ValidationError
from models.cube import CubeState, CubeSize, SolveRequest, ScrambleResponse


class TestCubeState:
    """Tests for CubeState model."""

    def test_正しい3x3状態の作成が成功する(self, solved_state):
        state = CubeState(size=CubeSize.SIZE_3X3, state=solved_state)
        assert state.state == solved_state
        assert state.size == CubeSize.SIZE_3X3

    def test_不正な長さの状態がバリデーションエラーを返す(self):
        with pytest.raises(ValidationError):
            CubeState(size=CubeSize.SIZE_3X3, state="UUUU")

    def test_デフォルトサイズは3x3(self, solved_state):
        state = CubeState(state=solved_state)
        assert state.size == CubeSize.SIZE_3X3


class TestSolveRequest:
    """Tests for SolveRequest model."""

    def test_デフォルトソルバーはkociemba(self, solved_state):
        request = SolveRequest(
            cube_state=CubeState(state=solved_state)
        )
        assert request.solver_type == "kociemba"

    def test_カスタムソルバーの指定が成功する(self, solved_state):
        request = SolveRequest(
            cube_state=CubeState(state=solved_state),
            solver_type="custom"
        )
        assert request.solver_type == "custom"


class TestScrambleResponse:
    """Tests for ScrambleResponse model."""

    def test_スクランブルレスポンスの作成が成功する(self):
        response = ScrambleResponse(
            scramble=["R", "U", "R'"],
            scramble_string="R U R'",
            cube_size=CubeSize.SIZE_3X3
        )
        assert len(response.scramble) == 3
        assert response.scramble_string == "R U R'"
