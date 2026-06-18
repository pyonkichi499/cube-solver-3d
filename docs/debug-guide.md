# デバッグ実行ガイド

Backend + Frontend を同時起動して動作確認する手順です。

## 前提条件

- Python 3.11 + [Rye](https://rye.astral.sh/) インストール済み
- Node.js 18+ + npm インストール済み

## 1. Backend 起動

```bash
cd backend
rye sync
rye run uvicorn main:app --reload --port 8000
```

起動後、以下で動作確認:

```bash
# ヘルスチェック
curl http://localhost:8000/health
# 期待: {"status":"healthy"}

# ソルバー一覧
curl http://localhost:8000/solvers

# スクランブル生成
curl http://localhost:8000/scramble/3x3

# 解法テスト（完成状態）
curl -X POST http://localhost:8000/solve \
  -H "Content-Type: application/json" \
  -d '{"cube_state":{"state":"UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB"}}'
```

## 2. Frontend 起動（別ターミナル）

```bash
cd frontend
npm install
npm run dev
```

ブラウザで http://localhost:5173 を開く。

## 3. 動作確認チェックリスト

### 基本動作

- [ ] ページが表示される（3Dキューブが見える）
- [ ] API接続バナーが「🟢 バックエンドAPI接続済み」と表示される
- [ ] マウスドラッグでキューブを回転できる（OrbitControls）
- [ ] スクロールでズームイン/アウトできる

### ボタン操作

- [ ] **Reset** → 完成状態に戻る（全面同色）
- [ ] **Random Scramble** → キューブがバラバラになる
- [ ] **Solve** → 解法手順が表示される（例: `R U R' U'...`）
- [ ] **Undo / Redo** → 直前の状態に戻る/進む
- [ ] 履歴カウンター（`1 / 3` など）が正しく更新される

### 基本回転ボタン

- [ ] **R** ボタン → 右面が時計回りに回転する
- [ ] **R'** ボタン → R の逆（反時計回り）
- [ ] **R2** ボタン → 右面が180度回転
- [ ] 他の面（L, U, D, F, B）も同様に動作する
- [ ] **R → R' → R → R'** で元に戻ることを確認（4回で一周ではなく、2回で打ち消し）

### 複合手順

- [ ] **Sexy Move** (R U R' U') → 6回繰り返すと元に戻る
- [ ] **T-Perm** / **Y-Perm** → 2回繰り返すと元に戻る

### スクランブル入力

- [ ] テキストボックスに `R U R' U'` と入力して「適用」 → キューブに反映
- [ ] Enter キーでも適用される
- [ ] 無効な手順（例: `X Y Z`）→ エラーメッセージ表示
- [ ] 空入力で「適用」 → エラーメッセージ表示

### デバッグモード

- [ ] **デバッグモードON** → キューブの各ステッカーに番号が表示される
- [ ] 下部に「デバッグパネル」と「エッジピース追跡」が表示される
- [ ] デバッグパネルの6面表示が正しい色で表示される
- [ ] **デバッグモードOFF** → 番号とパネルが消える

### API フォールバック

Backend を停止した状態で:

- [ ] API接続バナーが「🟡 フロントエンドのみモード」に変わる
- [ ] **Random Scramble** → モック機能で動作する（エラーにならない）
- [ ] **Solve** → モック解法が表示される（実際の解ではないが動作する）

### 手順の統合表示

- [ ] 手順適用後、「適用済み手順」セクションが表示される
- [ ] 「統合表示」で R + R が R2 に、R + R + R が R' に統合される
- [ ] 「詳細表示」を開くと元の手順列が見える

## 4. テスト実行

```bash
# Backend テスト（31テスト）
cd backend
rye run pytest tests/ -v

# Frontend テスト（127テスト）
cd frontend
npx vitest run

# Frontend ビルド確認
npm run build
```

## 5. 今回の変更で確認すべきポイント

### セキュリティ修正

```bash
# scramble length バリデーション
curl "http://localhost:8000/scramble/3x3?length=0"    # 422 エラー
curl "http://localhost:8000/scramble/3x3?length=101"  # 422 エラー
curl "http://localhost:8000/scramble/3x3?length=1"    # 成功（1手順）
curl "http://localhost:8000/scramble/3x3?length=100"  # 成功（100手順）

# エラーメッセージに内部情報が含まれないこと
curl -X POST http://localhost:8000/solve \
  -H "Content-Type: application/json" \
  -d '{"cube_state":{"state":"INVALID"}}'
# 期待: "Invalid or unsolvable cube state"（内部スタックトレースが漏れない）
```

### リファクタリング後の動作

- [ ] cubeRotations リファクタリング: 全回転が以前と同一の結果を返す
  - R×4 = 元に戻る
  - R + R' = 元に戻る
  - これは自動テスト (38テスト) でカバー済み
- [ ] App.tsx hooks 抽出: UI の動作が以前と完全に同一
- [ ] Cube3D.tsx リファクタリング: 3D表示が以前と同一
- [ ] バンドル分割: ページ読み込みが高速化されている（DevTools Network タブで確認）

### バンドル分割の確認

ブラウザの DevTools > Network タブで:

- [ ] `index-*.js` (約54KB) が最初にロードされる
- [ ] `react-vendor-*.js` (約307KB) が別チャンクとしてロードされる
- [ ] `three-vendor-*.js` (約750KB) が別チャンクとしてロードされる
- [ ] 2回目以降のアクセスではベンダーチャンクがキャッシュされる

## トラブルシューティング

### Backend が起動しない

```bash
cd backend
rye sync  # 依存関係を再インストール
```

### Frontend ビルドエラー

```bash
cd frontend
rm -rf node_modules
npm install
npm run build
```

### ポートが使用中

```bash
# 8000番ポートを使用しているプロセスを確認
lsof -i :8000
# 5173番ポートを使用しているプロセスを確認
lsof -i :5173
```
