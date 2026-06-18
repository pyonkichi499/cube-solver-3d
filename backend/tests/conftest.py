"""Shared test fixtures for the cube solver backend."""
import pytest
from httpx import AsyncClient, ASGITransport
from main import app


@pytest.fixture
async def client():
    """Create an async test client for the FastAPI app."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client


@pytest.fixture
def solved_state() -> str:
    """Return a solved cube state string."""
    return "UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB"


@pytest.fixture
def invalid_state() -> str:
    """Return an invalid cube state string."""
    return "XXXXXXXXXRRRRRRRRR FFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB"
