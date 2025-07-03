FROM node:18-alpine

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm ci

# アプリケーションファイルをコピー
COPY . .

# ポートを公開
EXPOSE 5173

# 開発サーバーを起動（外部からアクセス可能にする）
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
