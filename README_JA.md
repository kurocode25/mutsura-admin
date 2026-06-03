# Mutsura Admin

このプロジェクトは、Mutsraブログシステムのための管理画面（ダッシュボード）のフロントエンド実装です。[mutsura-api](https://github.com/kurocode25/mutsura-api)と連動しコンテンツ管理を行います。

現在**開発中**であり、機能の追加や変更が頻繁に行われます。

## 概要

React, TypeScript, Vite を使用して構築された、シンプルで直感的な管理画面です。
記事（Post）、固定ページ（Page）、カテゴリー、タグの管理機能を提供します。

## 主な機能

- **認証**: ログイン機能、JWTトークンベースの認証、自動トークンリフレッシュ。
- **ダッシュボード**: システム全体の統計や概要の表示。
- **記事管理**: Markdownエディタを使用した記事の作成、編集、一覧表示、削除。
- **ページ管理**: 固定ページの一覧表示、作成、編集、削除。
- **カテゴリー管理**: カテゴリーの一覧表示と詳細管理。
- **タグ管理**: タグの一覧表示と詳細管理。

## 技術スタック

- **Frontend**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [Material UI (MUI)](https://mui.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Emotion](https://emotion.sh/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **Markdown Editor**: [EasyMDE](https://github.com/Ionaru/easy-markdown-editor) ([react-simplemde-editor](https://github.com/RIP21/react-simplemde-editor))
- **Utilities**: [date-fns](https://date-fns.org/), [notistack](https://github.com/iamhosseindhv/notistack)

## セットアップ

### 必要条件

- [Node.js](https://nodejs.org/) (LTS推奨)
- npm

### インストール

プロジェクトのルートディレクトリで以下のコマンドを実行してください。

```bash
npm install
```

### 環境設定

`.env` ファイル（または `.env.local`）を作成し、バックエンドAPIのURLを設定してください。

```env
VITE_API_BASE_URL=http://localhost:3000
```

### 開発用サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開くと、開発用サーバーにアクセスできます。

### ビルド

本番環境用のファイルを生成します。

```bash
npm run build
```

## プロジェクト構造

```text
src/
├── api.ts          # APIクライアント定義
├── App.tsx         # ルーティング設定
├── main.tsx        # エントリーポイント
├── theme.ts        # MUIテーマ設定
├── components/     # UIコンポーネント
│   ├── auth/       # 認証関連（ログイン、保護されたルート）
│   ├── posts/      # 記事管理機能
│   ├── pages/      # ページ管理機能
│   ├── categories/ # カテゴリー管理機能
│   └── tags/       # タグ管理機能
└── contexts/       # React Context (AuthContextなど)
```

## ライセンス

[LICENSES](./LICENSE), [THIRD_PARTY_LICENSES.md](./THIRD_PARTY_LICENSES.md) を参照してください。
