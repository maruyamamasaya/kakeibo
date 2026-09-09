# Current State

最終確認日: 2026-09-09

## Current Phase

開発休止中。MVP の主要画面と Cognito/DynamoDB 接続コードは実装済みだが、依存導入後のビルド、実環境での疎通、自動テスト、デプロイ手順は未確立。構造の詳細は `ARCHITECTURE.md` を参照する。

## Implemented

- ログイン、サマリー、日別明細、メモの各画面。
- Cognito Authorization Code + PKCE の開始と token 交換。
- DynamoDB による月別明細・メモの取得と登録。
- 詳細・メモ画面の月移動と共通ナビゲーション。
- Fast/Full validation の npm script と AI 開発文書。

## In Progress

機能開発は進行していない。`main` のアプリ本体は `origin/main` と一致している。AI開発文書、検証script、`.env.example` の改善はworking treeにあり、まだコミットされていない。

## Known Issues

- サマリーは固定 JSON で、月移動ボタンも未接続。
- API に認証・認可検証がなく、ページ側も自己設定可能な cookie の存在のみを確認する。
- token は `localStorage` に保存されるがデータ API で検証・利用されない。
- update/delete、logout、ユーザー別データ分離がない。
- unit/integration/E2E、CI/CD、デプロイ定義、lockfile がない。
- Cognito/DynamoDB の実環境構成、デプロイ先、Node.js標準バージョンは未確認。

## Next Actions

再開時は次の順で進める。

1. `git status` と本ファイルを確認し、working treeの文書変更をレビューしてコミットする。
2. Node.js/npmを確認して依存を導入し、`npm run verify:fast`、`npm run verify` を実行する。
3. `.env.example` を基にCognito/DynamoDB設定を照合し、ログイン、明細、メモを実環境で確認する。
4. APIのserver-side token検証とユーザー単位の認可境界を設計する。
5. 自動テストとCI/CDを追加してから、サマリーの実データ接続へ進む。
