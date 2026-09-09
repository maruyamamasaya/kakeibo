# Operations

## Local Development

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

`.env.local` を実環境に合わせて編集する。依存 lockfile は現在ない。Node.js の対応バージョンはリポジトリで固定されていない。

## Environment Variables

秘密値は `.env.local` やデプロイ基盤の secret store へ設定し、コミットしない。

| Variable | Required / Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_LOGIN_REDIRECT_PATH` | optional, `/summary` | ログイン後の遷移先。外部 URL も許可される |
| `NEXT_PUBLIC_COGNITO_DOMAIN` | Cognito 利用時必須 | Hosted UI domain。コード側が `https://` を付与するため host 名のみ |
| `NEXT_PUBLIC_COGNITO_CLIENT_ID` | 必須 | Cognito app client ID |
| `NEXT_PUBLIC_COGNITO_REDIRECT_URI` | 必須 | Cognito に登録済みの callback URI |
| `COGNITO_CLIENT_SECRET` | token 交換時必須 | サーバー専用の app client secret |
| `AWS_REGION` | optional, `ap-northeast-1` | DynamoDB region |
| `DYNAMODB_TRANSACTIONS_TABLE` | 明細 API に必須 | 明細 table 名 |
| `DYNAMODB_MEMOS_TABLE` | メモ API に必須 | メモ table 名 |
| `DYNAMODB_PARTITION_KEY` | optional, `month` | partition key 属性名 |
| `DYNAMODB_SORT_KEY` | optional, `entryId` | sort key 属性名 |
| `DYNAMODB_RECORD_TYPE_KEY` | optional, `recordType` | record type 属性名 |

`NEXT_PUBLIC_*` はブラウザへ公開される。secret を入れてはいけない。

## Database Setup

コードが前提とする各 DynamoDB table の key schema は次のとおり。

- partition key: String、既定属性名 `month`
- sort key: String、既定属性名 `entryId`
- `recordType` 相当の String 属性を保存

実際のテーブル名、作成手順、IAM policy、capacity mode、backup はリポジトリ外で管理されている可能性があり未確認。アプリ実行環境には対象 table の `Query` と `PutItem` 相当の権限が必要。

AWS SDK は明示 credential をコードから渡さず、標準 credential provider chain を利用する。ローカルでは安全な AWS profile 等、実行環境では role の利用を優先する。

## Cognito Setup

- Cognito app client の callback URL と `NEXT_PUBLIC_COGNITO_REDIRECT_URI` を一致させる。
- Authorization code grant、scope `openid email profile`、PKCE S256 を許可する。
- 現コードは client secret を token request に送るため、対応する app client 設定が必要。
- Hosted UI domain は protocol を除いて設定する。

ログアウト URL、refresh、token expiry、server-side token verification は未実装。

## Build and Start

```powershell
npm run build
npm run start
```

production 起動前に `TESTING.md` の検証を行い、Cognito login と DynamoDB の read/write を対象環境で確認する。

## Deployment

CI/CD、Dockerfile、クラウド向け manifest、IaC はリポジトリにないため、正式なデプロイ方法は未確認。`.env.example` の `sslip.io` URL だけから配備先を断定しない。方式を決定したら、必要な runtime、secret 注入、AWS IAM、HTTPS、rollback 手順をここへ追記する。

## Troubleshooting

- `next is not recognized`: `node_modules` がない。依存をインストールする。
- `Cognito の設定が不足しています。`: 3つの `NEXT_PUBLIC_COGNITO_*` と server の `COGNITO_CLIENT_SECRET` を確認する。
- `DynamoDB table name is not configured.`: 対象の `DYNAMODB_*_TABLE` を確認する。
- API が 500: response body の error、AWS region/credentials/IAM、table 名と key schema を確認する。
- callback で認証状態不一致: login を開始した同一 browser session か、Cognito callback URL が一致するか確認する。
