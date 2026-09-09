# kakeibo

モバイル向けのシンプルな家計簿アプリです。収支明細と日付ごとのメモを月単位で管理します。

## 現在の状態

Next.js の画面、Amazon Cognito ログイン、DynamoDB を利用する明細・メモ API が実装されています。サマリー画面は現在サンプルデータ表示です。詳細は [CURRENT.md](CURRENT.md) を参照してください。

## ローカル起動

1. Node.js と npm を用意する
2. `npm install` を実行する
3. `.env.example` を参考に `.env.local` を作成する
4. Cognito、DynamoDB、AWS 認証情報を設定する
5. `npm run dev` を実行し、表示された URL を開く

環境変数と AWS 側の前提は [OPERATIONS.md](OPERATIONS.md) にまとめています。秘密情報はコミットしないでください。

## ドキュメント

- [CURRENT.md](CURRENT.md): 現在地、実装済み・未実装、次の候補
- [ARCHITECTURE.md](ARCHITECTURE.md): 現在のシステム構成とデータフロー
- [CODEMAP.md](CODEMAP.md): 機能から主要コードへ到達するための地図
- [TESTING.md](TESTING.md): 現在利用できる検証方法
- [OPERATIONS.md](OPERATIONS.md): 起動、環境変数、外部サービス、運用
- [AGENTS.md](AGENTS.md): AI エージェント向け作業ルール
- [decisions/](decisions/README.md): 重要な設計判断の記録方法
- [sessions/](sessions/README.md): 短い作業記録の残し方

ドキュメントと実装が矛盾する場合は、コードと設定を確認したうえで、不一致をドキュメントへ反映してください。
