"""Tests for health check and root endpoints."""
import pytest


class TestHealthCheck:
    """Health check endpoint tests."""

    async def test_ヘルスチェックが正常に応答する(self, client):
        response = await client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"


class TestRootEndpoint:
    """Root endpoint tests."""

    async def test_ルートエンドポイントがAPI情報を返す(self, client):
        response = await client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "version" in data
        assert "endpoints" in data
