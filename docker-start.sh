#!/bin/bash

# Docker環境を起動するスクリプト
echo "🚀 3D Cube Solver を起動しています..."

# Docker Composeでサービスを起動
echo "📦 Dockerコンテナをビルドして起動中..."
docker-compose up --build

echo "✅ 起動完了！"
echo "🌐 フロントエンド: http://localhost:5173"
echo "🔧 バックエンドAPI: http://localhost:8000"
echo "📚 API仕様書: http://localhost:8000/docs"
echo ""
echo "停止するには Ctrl+C を押してください"
