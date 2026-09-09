# Testing

このファイルを検証方法の正本とする。現状は自動テストがなく、lint、typecheck、build が利用可能。AWS連携の動作確認には別途 `OPERATIONS.md` の環境が必要。

## Standard Commands

### Fast Validation

実装中の短いフィードバック用。

```powershell
npm run verify:fast
```

`lint` と `typecheck` を順に実行する。

### Full Validation

作業完了前の標準入口。

```powershell
npm run verify
```

Fast validation に加えて production build を実行する。unit/integration/E2E は未導入のため含まれない。

## Individual Checks

```powershell
npm run lint
npm run typecheck
npm run build
```

- Lint: Next.js の `core-web-vitals` preset。
- Typecheck: strict TypeScript、no emit。
- Build: Next.js production build。成功してもAWS疎通は保証しない。
- Format check、unit、integration、E2E、migration/security専用check: 未導入。

## Change-to-Validation Map

| Change type | Required validation |
| --- | --- |
| 文書のみ | `git diff --check`、リンクとコード参照先の確認 |
| UI / CSS | Fast + 対象画面の手動確認。完了前に Full |
| API / shared logic | Fast + 正常/異常入力の確認。完了前に Full |
| Cognito | Full + login/callback/state不一致/失敗応答の実環境確認 |
| DynamoDB | Full + テスト用AWS環境でQuery/Putとkey schemaを確認 |
| 依存・構成 | Full + 主要フローの手動確認 |

対象テストが存在するようになったら Fast では関連テスト、Full では全自動テストを実行するよう npm scripts を更新する。

## Prerequisites and Baseline

先に `npm install` が必要。lockfile がないため依存解決は完全には再現可能でない。2026-09-09 の環境では `node_modules` がなく、`npm run verify:fast` と `npm run build` は `next is not recognized` で開始できなかった。
