# AI Agent Guide

コードを実装事実の正本とし、仕様・設計判断・不具合とは区別する。不明点を推測で固定しない。

## Navigation and Context Budget

必要な情報だけを段階的に読む。

```text
Task → AGENTS.md + CURRENT.md
     → 関連する ARCHITECTURE.md / CODEMAP.md
     → search results → target files
     → dependencies / references / tests
```

最初から全ファイルを順番に読まない。対象ディレクトリに子 `AGENTS.md` があれば、ルート規約への追加ルールとして読む。

## Search-first Workflow

1. `CURRENT.md` で現在地を確認する。
2. `CODEMAP.md` から feature の入口と検索語を得る。構造の理解が必要な場合だけ `ARCHITECTURE.md` を読む。
3. symbol 名が不明なら、利用可能な semantic/repository search で概念を探す。
4. 名前が判明したら exact/symbol search、references search へ切り替える。
5. definition、references、tests、configuration、data dependencies を確認する。
6. 対象と依存する箇所だけを読む。
7. 小さく変更し、`TESTING.md` に従って Fast、完了前に Full validation を行う。

検索機能がなければ `rg`、`git grep`、IDE/LSP検索を使う。ツール名ではなく「検索 → 対象特定 → 必要部分だけ読む」を守る。

## Project-wide Rules

- 既存仕様を尊重し、要求外の rename、リファクタリング、依存更新を避ける。
- 呼び出し元・呼び出し先と関連テストを確認してから変更する。
- 秘密情報、token、AWS credentials を記録・コミットしない。
- API、認証、DB変更ではセキュリティ境界と入力検証を確認する。
- 利用できない検証は、コマンドと理由を session 記録に残す。

## Validation

標準入口は `npm run verify:fast` と `npm run verify`。詳細と変更種別ごとの要件は `TESTING.md` を正本とする。

## Documentation Rules

同じ説明を複製せず、次の正本へリンクする。session に生ログや巨大な diff を残さない。

| 更新先 | 更新条件 |
| --- | --- |
| `CURRENT.md` | 現在のフェーズ、実装状態、既知の問題、次の行動が変わった |
| `ARCHITECTURE.md` | システム構造、データフロー、外部依存が変わった |
| `CODEMAP.md` | 主要 feature の入口、配置、検索語が変わった |
| `TESTING.md` | 検証コマンドやテスト方針が変わった |
| `OPERATIONS.md` | 起動、環境変数、運用、デプロイが変わった |
| `decisions/` | 将来も理由を理解すべき重要判断が発生した |
| `sessions/` | AI作業を終了した |

README は人間向け利用方法、AGENTS は作業規約、CURRENT は現在地、ARCHITECTURE は構造、CODEMAP は検索入口に限定する。
