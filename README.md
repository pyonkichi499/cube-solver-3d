# 3Dキューブソルバー

Webベースの3Dルービックキューブソルバーとビジュアライゼーション。

## 機能

- ルービックキューブの3Dビジュアライゼーション
- インタラクティブな回転と操作
- Kociembaアルゴリズムを使用した自動解決（プラグ可能なソルバーアーキテクチャ）
- 3x3x3キューブのサポート（他のサイズにも拡張可能）

## 技術スタック

- **フロントエンド**: React + TypeScript + Three.js
- **バックエンド**: Python + FastAPI
- **ソルバー**: Kociembaアルゴリズム（置換可能）
- **環境管理**: Rye (Python), npm (Node.js)

## セットアップ

### バックエンド

```bash
# Ryeがインストールされていない場合は、先にインストールしてください
# https://rye-up.com/guide/installation/

cd backend
rye sync  # 依存関係のインストール
rye run uvicorn main:app --reload
```

### フロントエンド

```bash
cd frontend
npm install
npm run dev
```

## 開発

このプロジェクトは、解決アルゴリズムを簡単に置き換えられるように構成されています。独自の解決アルゴリズムを追加するには、`backend/solver/`内の`CubeSolver`インターフェースを実装してください。

## ライセンス

MIT
