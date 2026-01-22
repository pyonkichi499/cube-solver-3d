# 3D Cube Solver

Webベースの3Dルービックキューブソルバーとビジュアライゼーション。

## 現在の実装状況

### ✅ 実装済み
- **3Dビジュアライゼーション**: Three.jsによるリアルタイム3D表示
- **全面キューブ回転ロジック**: R, L, U, D, F, B回転とその逆・2回転の完全実装
- **デバッグモード**: ステッカーID表示、全面配置可視化、エッジピース追跡
- **スクランブル入力**: 文字列での手順入力（例: R U R' U' R U2 R'）
- **回転ボタン**: 基本回転と複合手順（T-Perm, Y-Perm等）
- **手順表示**: 適用済み手順の履歴と統合表示（RR→R2）
- **Undo/Redo機能**: 回転操作の取り消し・やり直し
- **ドラッグ操作**: マウスドラッグによる視点回転（OrbitControls）
- **バックエンドAPI**: FastAPI + Kociembaソルバー
- **APIクライアント**: フロントエンドのAPI通信ライブラリ実装済み
- **色配置**: white=U面、green=F面、スピードキューブ標準配色

### 🚧 一部実装済み
- **解法表示**: モック解答を表示（バックエンドAPI未接続）
- **スクランブル生成**: ランダム生成（バックエンドAPI未接続）

### ❌ 未実装
- **手動操作**: クリック・ドラッグによるキューブ回転
- **アニメーション**: 回転時の滑らかな動き
- **フロントエンド↔バックエンド連携**: 実際のAPI通信接続

## 技術スタック

- **フロントエンド**: React + TypeScript + Three.js (react-three-fiber)
- **バックエンド**: Python + FastAPI + Kociemba
- **3D描画**: Three.js + react-three-drei
- **状態管理**: React hooks

## セットアップ

### 🚀 簡単起動（Docker）

```bash
# ワンコマンドで両方起動
docker-compose up --build

# または簡単起動スクリプト
./docker-start.sh
```

### 🌐 GitHub Pages公開

フロントエンドのみをGitHub Pagesで公開:

1. リポジトリの **Settings** → **Pages** → **Source**: GitHub Actions
2. コードをプッシュ: `git push origin main`
3. 自動デプロイ完了: `https://pyonkichi499.github.io/cube-solver-3d/`

詳細は [`GITHUB_PAGES_DEPLOY.md`](GITHUB_PAGES_DEPLOY.md) を参照。

### 🔧 手動起動

**バックエンド**:
```bash
cd backend
rye sync  # 依存関係のインストール
rye run uvicorn main:app --reload --port 8000
```

**フロントエンド**:
```bash
cd frontend
npm install
npm run dev  # http://localhost:5173
```

**両方同時実行**:
```bash
# ターミナル1（バックエンド）
cd backend && rye run uvicorn main:app --reload

# ターミナル2（フロントエンド） 
cd frontend && npm run dev
```

## キューブの色配置

スピードキューブ標準の配色:
- **U面（上）**: white（白）
- **F面（前）**: green（緑）  
- **R面（右）**: red（赤）
- **D面（下）**: yellow（黄）
- **L面（左）**: orange（オレンジ）
- **B面（後）**: blue（青）

## 操作方法

### 基本操作
- **マウスドラッグ**: 3Dビューの回転
- **スクロール**: ズームイン/アウト
- **Reset**: 完成状態に戻す
- **Random Scramble**: ランダムスクランブル生成
- **デバッグモード**: ステッカーIDと詳細情報表示

### スクランブル入力
テキストフィールドに標準記法で手順を入力（スペース区切り）:
- 基本回転: R, L, U, D, F, B
- 逆回転: R', L', U', D', F', B'
- 180度回転: R2, L2, U2, D2, F2, B2

例: `R U R' U' R U2 R'`

### デバッグ機能
デバッグモードONで以下が表示:
- 各ステッカーの元の位置ID（0-53）
- 全6面のステッカー配置パネル
- 重要なエッジピースの追跡パネル

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

1. **API連携**: フロントエンド・バックエンド接続（Solve/Scramble機能）
2. **アニメーション**: 滑らかな回転エフェクト
3. **手動操作**: マウス操作でのキューブ回転
4. **他サイズ対応**: 2x2, 4x4, 5x5キューブ
5. **目隠し機能**: 記憶法に特化した表示
6. **タイマー機能**: スピードソルビング用計測

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
