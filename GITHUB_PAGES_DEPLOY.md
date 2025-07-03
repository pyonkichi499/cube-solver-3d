# GitHub Pages公開手順

## 🚀 フロントエンドのみ公開（現在）

### 1. リポジトリの設定

1. **GitHubリポジトリの設定**
   - リポジトリの **Settings** に移動
   - 左サイドバーの **Pages** をクリック
   - **Source** を **GitHub Actions** に設定

2. **コードをプッシュ**
   ```bash
   git add .
   git commit -m "Add GitHub Pages deployment"
   git push origin main
   ```

3. **自動デプロイ完了**
   - GitHub Actionsが自動実行
   - 数分後に https://[ユーザー名].github.io/cube-solver-3d/ でアクセス可能

### 2. 現在利用可能な機能

✅ **動作する機能**:
- 3D キューブ可視化
- 手動回転操作（R, L, U, D, F, B）
- スクランブル入力
- Undo/Redo機能
- デバッグモード

🟡 **制限付き機能**:
- スクランブル生成（モック機能）
- キューブ解法（モック機能）

## 🔧 後からバックエンドを追加する方法

### 選択肢1: GitHub Actionsでクラウドサービスに自動デプロイ

**Railway の場合**:
```yaml
# .github/workflows/deploy-backend.yml
name: Deploy Backend to Railway

on:
  push:
    branches: [main]
    paths: ['backend/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Railway
        uses: railway-io/github-action@v2
        with:
          api_key: ${{ secrets.RAILWAY_API_KEY }}
          service_name: cube-solver-backend
```

**必要な設定**:
1. Railway アカウント作成
2. API Key を GitHub Secrets に設定
3. バックエンドを Railway にデプロイ
4. フロントエンドの API URL を更新

### 選択肢2: Vercel Functions

**Vercel の場合**:
```bash
# バックエンドをVercel Functionsに移植
cd backend
npm init -y
npm install @vercel/python
# API コードを /api/*.py に移動
```

### 選択肢3: Netlify Functions

**Netlify の場合**:
```bash
# バックエンドをNetlify Functionsに移植
cd backend
# Lambda関数形式に変換
```

## 🎯 推奨アプローチ

1. **今すぐ**: フロントエンドのみ公開（基本機能利用可能）
2. **後から**: Railway + GitHub Actions で完全自動化
3. **最終的**: フロントエンド（GitHub Pages）+ バックエンド（Railway）

## 📝 現在のURL

開発環境: http://localhost:5173  
本番環境: https://[ユーザー名].github.io/cube-solver-3d/

## 💡 メリット

- **完全無料**: GitHub Pages は無料
- **自動デプロイ**: コードプッシュで自動公開
- **段階的改善**: 後からバックエンドを追加可能
- **モック機能**: バックエンドなしでも基本動作確認可能 
