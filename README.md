# 3D Cube Solver

Webベースの3Dルービックキューブソルバーとビジュアライゼーション。

## 現在の実装状況

### ✅ 実装済み
- **3Dビジュアライゼーション**: Three.jsによるリアルタイム3D表示
- **基本UI**: Reset、Scramble、Solveボタン
- **ドラッグ操作**: マウスドラッグによる視点回転（OrbitControls）
- **バックエンドAPI**: FastAPI + Kociembaソルバー
- **色配置**: white=U面、green=F面、standard配色

### 🚧 一部実装済み（モック）
- **スクランブル機能**: ランダムな色配置（実際のキューブ回転ではない）
- **解法表示**: モック解答を表示（バックエンド未接続）

### ❌ 未実装
- **実際のキューブ回転**: 数学的な状態変更ロジック
- **手動操作**: クリック・ドラッグによるキューブ回転
- **アニメーション**: 回転時の滑らかな動き
- **フロントエンド↔バックエンド連携**: API通信

## 技術スタック

- **フロントエンド**: React + TypeScript + Three.js (react-three-fiber)
- **バックエンド**: Python + FastAPI + Kociemba
- **3D描画**: Three.js + react-three-drei
- **状態管理**: React hooks

## セットアップ

### バックエンド

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### フロントエンド

```bash
cd frontend
npm install
npm run dev  # http://localhost:5173
```

### 両方同時実行

```bash
# ターミナル1（バックエンド）
cd backend && uvicorn main:app --reload

# ターミナル2（フロントエンド） 
cd frontend && npm run dev
```

## キューブの色配置

標準的なルービックキューブの配色:
- **U面（上）**: white
- **F面（前）**: green  
- **R面（右）**: red
- **D面（下）**: yellow
- **L面（左）**: orange
- **B面（後）**: blue

## API仕様

### エンドポイント
- `GET /` - API情報
- `POST /solve` - キューブ状態を解く
- `GET /scramble/3x3` - スクランブル生成
- `GET /solvers` - 利用可能ソルバー一覧
- `GET /health` - ヘルスチェック

### データ形式
キューブ状態は54文字の文字列で表現:
```
UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB
```

## 今後の開発予定

1. **キューブ回転ロジック**: 実際の状態変更の実装
2. **手動操作**: マウス操作でのキューブ回転
3. **API連携**: フロントエンド・バックエンド接続
4. **アニメーション**: 滑らかな回転エフェクト
5. **他サイズ対応**: 2x2, 4x4, 5x5キューブ
6. **目隠し機能**: 記憶法に特化した表示

## 開発者向け

### 新しいソルバーの追加

`backend/solver/`で`CubeSolver`インターフェースを実装:

```python
from solver.base import CubeSolver

class CustomSolver(CubeSolver):
    def solve(self, cube_state: str) -> List[str]:
        # 実装
        pass
    
    def validate_state(self, cube_state: str) -> bool:
        # 実装
        pass
```

## ライセンス

MIT
