# GitHub Pages公開手順

## 🌿 推奨ブランチ戦略

### ブランチ構成
```
main (stable)
├── develop (開発用)
├── feature/github-pages-deployment (機能開発)
├── gh-pages-source (公開用ソースコード)
└── gh-pages (GitHub Pages デプロイ先)
```

### ブランチの役割
- **main**: 安定版・本番環境
- **develop**: 開発版・統合環境
- **feature/***: 機能開発用
- **gh-pages-source**: GitHub Pages公開用のソースコード
- **gh-pages**: GitHub Pages が読み込むビルド済みファイル（自動生成）

## 🚀 フロントエンドのみ公開手順

### 1. 機能ブランチで作業完了後

現在の状態：
```bash
# 現在のブランチを確認
git branch
# * feature/github-pages-deployment

# 作業完了後、developにマージ
git checkout develop
git merge feature/github-pages-deployment
git push origin develop
```

### 2. 公開準備：gh-pages-sourceブランチを作成

```bash
# develop から gh-pages-source ブランチを作成
git checkout develop
git checkout -b gh-pages-source

# GitHub Pages用設定の最終確認
# （必要に応じて調整）

# gh-pages-sourceブランチをプッシュ
git push origin gh-pages-source
```

### 3. GitHub リポジトリの設定

1. **リポジトリの Settings** に移動
2. **Pages** をクリック
3. **Source** を **Deploy from a branch** に設定
4. **Branch** を **gh-pages** / **/ (root)** に設定
5. **Custom domain** (オプション): 独自ドメインを設定可能

> **注意**: GitHub Actions が自動的に `gh-pages` ブランチを作成するので、最初は空のブランチが表示される場合があります。デプロイが完了してから設定してください。

### 4. 自動デプロイ開始

```bash
# gh-pages-sourceブランチに何かプッシュするとデプロイされる
git checkout gh-pages-source
git push origin gh-pages-source
```

## 📋 今後の更新フロー

### 機能追加時の推奨フロー

1. **feature ブランチで開発**
   ```bash
   git checkout develop
   git checkout -b feature/new-feature
   # 開発作業
   git add .
   git commit -m "新機能を追加"
   ```

2. **develop にマージ**
   ```bash
   git checkout develop
   git merge feature/new-feature
   git push origin develop
   ```

3. **公開準備完了時**
   ```bash
   git checkout gh-pages-source
   git merge develop
   git push origin gh-pages-source  # 自動デプロイ開始
   ```

### 緊急修正時の簡単フロー

```bash
# 緊急修正の場合
git checkout gh-pages-source
# 修正作業
git add .
git commit -m "緊急修正: XXXを修正"
git push origin gh-pages-source  # 即座に公開
```

## 🔧 現在の状況

✅ **完了済み**:
- `feature/github-pages-deployment` ブランチで機能開発完了
- Docker環境構築完了
- モック API 実装完了
- GitHub Actions 設定完了

🔄 **次のステップ**:
1. `develop` ブランチにマージ
2. `gh-pages-source` ブランチを作成
3. 公開設定を完了

## 🎯 推奨アプローチ

### 選択肢1: 段階的公開（推奨）

```bash
# 1. developにマージして統合テスト
git checkout develop
git merge feature/github-pages-deployment
git push origin develop

# 2. 確認後、gh-pages-sourceで公開
git checkout -b gh-pages-source
git push origin gh-pages-source
```

### 選択肢2: 即座公開

```bash
# 現在のブランチを直接gh-pages-sourceに変更
git branch -m gh-pages-source
git push origin gh-pages-source
```

## 🌐 公開後のURL

- **本番環境**: https://[ユーザー名].github.io/cube-solver-3d/
- **開発環境**: http://localhost:5173 (Docker経由)

## 💡 ブランチ戦略のメリット

- **安全性**: main ブランチを保護
- **柔軟性**: 機能ごとに独立した開発
- **公開制御**: gh-pages ブランチで公開タイミング制御
- **チーム開発**: 複数人での並行開発が可能

---

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
   git push origin gh-pages-source
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
