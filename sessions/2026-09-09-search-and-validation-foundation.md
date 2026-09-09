# Session: Search and validation foundation

Date: 2026-09-09

## Request

少ないコンテキストで対象コードへ到達し、標準手順で検証できるようAI開発基盤を強化する。

## Investigation

既存AI文書、npm scripts、設定、責務境界を確認。CURRENTの履歴混在、CODEMAP形式、検索方式、Fast/Full検証、lint設定の不足を特定した。

## Changes

検索優先・段階的コンテキスト取得をルート規約化し、API境界だけ子規約を追加。CURRENTを現在地に限定し、CODEMAPをfeature別検索入口へ整理。lint設定とFast/Full verify scriptsを追加した。

## Validation

文書リンク、JSON構文、npm script展開、`git diff --check`、コード参照先を確認。`npm run verify:fast` は標準入口からlintを起動したが、依存未導入のため `next is not recognized` で終了。Full validationも同じ前提が不足するため未実施。

## Result

探索と標準検証の入口を整備し、文書の役割重複を縮小した。

## Remaining Issues

依存導入後のFull validation、lockfile、各種自動テスト、CI/CD、semantic indexの導入可否は未確認。
