"""Tests for API endpoints."""
import pytest


class TestSolveEndpoint:
    """Tests for the /solve endpoint."""

    async def test_完成状態の解法リクエストが成功する(self, client, solved_state):
        response = await client.post("/solve", json={
            "cube_state": {
                "size": "3x3",
                "state": solved_state
            },
            "solver_type": "kociemba"
        })
        assert response.status_code == 200
        data = response.json()
        assert "solution" in data
        assert "move_count" in data
        assert data["solver_used"] == "kociemba"

    async def test_不正なサイズのリクエストが400を返す(self, client, solved_state):
        response = await client.post("/solve", json={
            "cube_state": {
                "size": "2x2",
                "state": "U" * 24
            },
            "solver_type": "kociemba"
        })
        assert response.status_code == 400

    async def test_不正なソルバータイプが400を返す(self, client, solved_state):
        response = await client.post("/solve", json={
            "cube_state": {
                "size": "3x3",
                "state": solved_state
            },
            "solver_type": "nonexistent"
        })
        assert response.status_code == 400

    async def test_不正なキューブ状態が400を返す(self, client):
        response = await client.post("/solve", json={
            "cube_state": {
                "size": "3x3",
                "state": "U" * 54  # Valid length but unsolvable
            },
            "solver_type": "kociemba"
        })
        assert response.status_code == 400


class TestScrambleEndpoint:
    """Tests for the /scramble endpoint."""

    async def test_3x3スクランブルの生成が成功する(self, client):
        response = await client.get("/scramble/3x3")
        assert response.status_code == 200
        data = response.json()
        assert "scramble" in data
        assert "scramble_string" in data
        assert data["cube_size"] == "3x3"
        assert len(data["scramble"]) == 20  # default length

    async def test_カスタム長のスクランブル生成が成功する(self, client):
        response = await client.get("/scramble/3x3?length=10")
        assert response.status_code == 200
        data = response.json()
        assert len(data["scramble"]) == 10

    async def test_未サポートサイズのスクランブルが400を返す(self, client):
        response = await client.get("/scramble/2x2")
        assert response.status_code == 400

    async def test_連続する同じ面の手順が生成されない(self, client):
        response = await client.get("/scramble/3x3?length=50")
        data = response.json()
        scramble = data["scramble"]
        for i in range(1, len(scramble)):
            assert scramble[i][0] != scramble[i-1][0], \
                f"Same face at positions {i-1} and {i}: {scramble[i-1]}, {scramble[i]}"


class TestScrambleLengthValidation:
    """Tests for scramble length boundary validation."""

    async def test_スクランブル生成でlengthが0の場合422を返す(self, client):
        response = await client.get("/scramble/3x3?length=0")
        assert response.status_code == 422

    async def test_スクランブル生成でlengthが101の場合422を返す(self, client):
        response = await client.get("/scramble/3x3?length=101")
        assert response.status_code == 422

    async def test_スクランブル生成でlengthが1の場合成功する(self, client):
        response = await client.get("/scramble/3x3?length=1")
        assert response.status_code == 200
        data = response.json()
        assert len(data["scramble"]) == 1

    async def test_スクランブル生成でlengthが100の場合成功する(self, client):
        response = await client.get("/scramble/3x3?length=100")
        assert response.status_code == 200
        data = response.json()
        assert len(data["scramble"]) == 100


class TestSolversEndpoint:
    """Tests for the /solvers endpoint."""

    async def test_ソルバー一覧の取得が成功する(self, client):
        response = await client.get("/solvers")
        assert response.status_code == 200
        data = response.json()
        assert "solvers" in data
        assert "kociemba" in data["solvers"]
        assert data["default"] == "kociemba"
