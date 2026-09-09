# Architecture

## System Overview

Next.js App Router の単一アプリケーションが、React UI、Route Handler、認証開始・callback 処理を提供する。永続化先は Amazon DynamoDB、ID プロバイダーは Amazon Cognito。

```text
Browser
  |-- pages / client state
  |-- Cognito Hosted UI <-------- Amazon Cognito
  |          |
  |          +-- code callback --> /login
  |
  +-- /api/auth/token -----------> Cognito /oauth2/token
  |
  +-- /api/transactions --+
  +-- /api/memos ---------+------> DynamoDB
```

## Technology Stack

- Next.js 14.2.5 / React 18.3.1 / TypeScript 5.5.4
- Next.js App Router、Route Handlers、Middleware
- AWS SDK for JavaScript v3 (`@aws-sdk/client-dynamodb`, `@aws-sdk/lib-dynamodb`)
- Amazon Cognito Hosted UI / OAuth 2.0 Authorization Code + PKCE
- Amazon DynamoDB
- CSS は `app/globals.css` の単一ファイル

## Directory Structure

```text
app/
  api/          Route Handlers
  components/   共有 UI
  hooks/        クライアント hook
  lib/          認証・DB の共通処理
  */page.tsx    各画面
data/           サマリー用サンプルデータ
middleware.ts   ページアクセスのログインゲート
```

## Main Components

- `app/layout.tsx`: ルート layout と metadata。
- `app/page.tsx`: `/summary` へリダイレクト。
- `app/summary/page.tsx`: 固定サンプルによるカテゴリ別支出表示。
- `app/details/page.tsx`: 月カレンダー、日別明細、明細登録。
- `app/memo/page.tsx`: 月別メモ一覧と登録。
- `app/login/page.tsx`: PKCE 生成、Cognito 遷移、callback 処理、token 保存。
- `app/components/BottomNav.tsx`: 3画面間のナビゲーション。

## Data Flow

明細・メモ画面はログイン cookie をクライアントで確認後、対象月 `YYYY-MM` を query parameter として API へ送る。Route Handler は `app/lib/dynamodb.ts` を呼び、DynamoDB の Query/Put を実行する。登録成功後は返却された record をクライアント state に追加する。

サマリーだけは API を使わず、build 時に `data/sample-data.json` を import する。

## API Structure

| Method / Path | 入力 | 処理 |
| --- | --- | --- |
| `POST /api/auth/token` | JSON: `code`, `codeVerifier` | Cognito token endpoint へ交換要求 |
| `GET /api/transactions?month=YYYY-MM` | query: `month` | 月別明細を取得 |
| `POST /api/transactions` | date, amount, type, category, note?, payer | 明細を作成 |
| `GET /api/memos?month=YYYY-MM` | query: `month` | 月別メモを取得 |
| `POST /api/memos` | date, title, body, tag | メモを作成 |

全 API は `force-dynamic`、Node.js runtime。API の認証・認可は現在実装されていない。

## Database

テーブル名は `DYNAMODB_TRANSACTIONS_TABLE` と `DYNAMODB_MEMOS_TABLE` から取得する。既定の partition key は `month`、sort key は `entryId`、種別属性は `recordType`。保存形式は概ね次のとおり。

```text
month: YYYY-MM
entryId: YYYY-MM-DD#<UUID>
recordType: transaction | memo
```

月別取得は partition key への Query と `recordType` の FilterExpression を使う。テーブル作成定義、index、capacity、TTL、backup 設定はリポジトリにない。

## Authentication

`/login` で state と PKCE verifier/challenge を生成し、Cognito Hosted UI へ遷移する。callback の code は `/api/auth/token` が client secret と verifier を用いて交換する。返却 token は `localStorage`、state/verifier は `sessionStorage`、ログイン印は通常の cookie に保存される。

`middleware.ts` は `/login`、`/_next`、API、静的ファイルを除くページで cookie の存在を確認する。各主要画面でも `useLoginGuard` が同じ確認を行う。token のサーバー検証はないため、これは完全な認可機構ではない。

## External Services

- Amazon Cognito: Hosted UI の authorize/token endpoints。
- Amazon DynamoDB: AWS SDK のデフォルト credential provider chain を利用。
- GitHub: `origin` は GitHub repository。CI 設定はない。

## Deployment

デプロイ定義はリポジトリに存在しない。`.env.example` の redirect URL は `sslip.io` 経由の IP を示すが、デプロイ基盤や現行稼働環境を確定する根拠にはしない。

## Important Dependencies

依存バージョンは `package.json` に固定記載されているが、lockfile はない。Next.js/React がアプリ基盤、AWS SDK v3 が唯一のデータアクセス依存。外部 UI、validation、test library はない。
