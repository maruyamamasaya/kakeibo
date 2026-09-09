# Code Map

コード一覧ではなく検索開始点を示す。概念検索から入り、名前が判明したら exact/symbol/references search へ移る。探索方式の詳細は `AGENTS.md` を参照する。

## Application Shell and Navigation

Primary paths:
- `app/layout.tsx`
- `app/page.tsx`
- `app/components/`
- `app/globals.css`

Search keywords: `RootLayout`, `redirect("/summary")`, `NAV_ITEMS`, `bottom-nav`

Key entry points: `RootLayout`, `Home`, `BottomNav`

Related tests: none

## Summary

Primary paths:
- `app/summary/`
- `data/sample-data.json`

Search keywords: `SummaryPage`, `categorySummary`, `sampleData`, `month-switch`

Key entry points: `SummaryPage`

Related tests: none

## Transactions

Primary paths:
- `app/details/`
- `app/api/transactions/`
- `app/lib/dynamodb.ts`

Search keywords: `/api/transactions`, `TransactionRecord`, `totalsByDate`, `createTransaction`, `listTransactionsByMonth`

Key entry points: `DetailsPage`, transaction `GET`/`POST`, `createTransaction`, `listTransactionsByMonth`

Related tests: none

## Memos

Primary paths:
- `app/memo/`
- `app/api/memos/`
- `app/lib/dynamodb.ts`

Search keywords: `/api/memos`, `MemoRecord`, `createMemo`, `listMemosByMonth`

Key entry points: `MemoPage`, memo `GET`/`POST`, `createMemo`, `listMemosByMonth`

Related tests: none

## Authentication

Primary paths:
- `app/login/`
- `app/api/auth/`
- `app/lib/auth.ts`
- `app/hooks/useLoginGuard.ts`
- `middleware.ts`

Search keywords: `/api/auth/token`, `AUTH_COOKIE_KEY`, `TOKEN_STORAGE_KEY`, `codeVerifier`, `oauth2/token`, `kakeibo:auth`

Key entry points: `LoginPage`, auth token `POST`, `buildCognitoAuthorizeUrl`, `useLoginGuard`, `middleware`

Related tests: none

## Database

Primary paths:
- `app/lib/dynamodb.ts`
- `app/api/transactions/`
- `app/api/memos/`

Search keywords: `DynamoDBDocumentClient`, `QueryCommand`, `PutCommand`, `DYNAMODB_`, `recordType`, `entryId`

Key entry points: `queryByMonth`, `createTransaction`, `createMemo`

Related tests: none

## Configuration and Validation

Primary paths:
- `package.json`
- `tsconfig.json`
- `next.config.js`
- `.eslintrc.json`
- `.env.example`

Search keywords: `process.env`, `NEXT_PUBLIC_`, `COGNITO_`, `AWS_REGION`, `DYNAMODB_`, `verify:fast`, `verify`

Key entry points: npm scripts; environment-variable reads in `app/lib/` and `app/api/auth/`

Related tests: none; commands are documented in `TESTING.md`

## Exact Search Examples

```powershell
rg "symbol-or-string"
git grep "symbol-or-string"
rg "TODO|FIXME"
rg "process\.env"
git log -S "symbol-or-string" --oneline
```
