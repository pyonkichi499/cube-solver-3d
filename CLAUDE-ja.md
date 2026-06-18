# CLAUDE.md

このファイルは、このリポジトリでコードを扱う際のClaude Code (claude.ai/code)へのガイダンスを提供します。

## プロジェクト概要

Webベースの3Dルービックキューブソルバーとビジュアライゼーション。ユーザーは3x3x3キューブを表示、操作、自動解法することができます。

## 開発状況

**現在の状態**: API統合完了、フォールバック対応済み
- ✅ フロントエンド: React + TypeScript + Three.jsによる3Dキューブ表示
- ✅ バックエンド: Python FastAPI + Kociembaソルバー
- ✅ 適切な照明とマテリアルによる3Dレンダリング
- ✅ 全面の回転ロジック（R, L, U, D, F, B + prime/double moves）
- ✅ Undo/Redo機能
- ✅ フロントエンド-バックエンドAPI統合完了
- ✅ Kociembaソルバーへの解法接続
- ✅ バックエンドAPIによるスクランブル生成
- ✅ API未接続時のフォールバック機能
- ✅ デバッグモード（ステッカー追跡）
- ✅ APIヘルスチェックとステータス表示
- ✅ エラーハンドリングとローディング状態
- ❌ マニュアルキューブ操作（クリック/ドラッグによる面の回転）
- ❌ 回転アニメーション（低優先度 - 長期計画に移動）
- ❌ フロントエンド・バックエンドのユニットテスト（高優先度）

## 主要なアーキテクチャの決定事項

1. **フロントエンド**: React + TypeScript + Three.js
   - コンポーネントベースアーキテクチャ
   - react-three-fiberによる3Dレンダリング
   - React hooksによる状態管理

2. **バックエンド**: Python + FastAPI
   - RESTful API設計
   - 抽象基底クラスによるプラガブルソルバーアーキテクチャ
   - デフォルトソルバーとしてKociembaアルゴリズム

3. **データフロー**:
   - キューブ状態は54文字の文字列で表現 (UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB)
   - JSON経由でのAPI通信
   - 標準記法による手順表現 (R, U, R', U', など)

## 開発コマンド

### バックエンド
```bash
cd backend
rye sync  # 依存関係のインストール
rye run uvicorn main:app --reload --port 8000
```

### フロントエンド
```bash
cd frontend
npm install
npm run dev  # 開発サーバー http://localhost:5173
npm run build  # プロダクションビルド
```

### テスト
```bash
# バックエンドテスト
cd backend
rye run pytest tests/ -v

# フロントエンドテスト
cd frontend
npm run test
```

### 両方を同時実行
```bash
# ターミナル1 - バックエンド
cd backend && rye run uvicorn main:app --reload

# ターミナル2 - フロントエンド
cd frontend && npm run dev
```

## プロジェクト構造

```
cube-solver-3d/
├── frontend/              # React フロントエンド
│   ├── src/
│   │   ├── components/    # React コンポーネント（Cube3D.tsx）
│   │   ├── types/         # TypeScript 型定義
│   │   ├── utils/         # ユーティリティ関数
│   │   └── api/           # API クライアント
│   └── package.json
├── backend/               # Python バックエンド
│   ├── main.py           # FastAPI アプリケーション
│   ├── models/           # Pydantic モデル
│   └── solver/           # ソルバー実装
│       ├── base.py       # 抽象ソルバーインターフェース
│       └── kociemba_solver.py
└── README.md
```

## APIエンドポイント

- `GET /` - API 情報
- `POST /solve` - キューブ状態を解く
- `GET /scramble/{cube_size}` - スクランブル生成
- `GET /solvers` - 利用可能ソルバー一覧
- `GET /health` - ヘルスチェック

## 新しいソルバーの追加

`backend/solver/` で `CubeSolver` インターフェースを実装：
```python
from solver.base import CubeSolver

class CustomSolver(CubeSolver):
    def solve(self, cube_state: str) -> List[str]:
        # 実装
    
    def validate_state(self, cube_state: str) -> bool:
        # 実装
```