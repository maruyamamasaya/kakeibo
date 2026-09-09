# Session Records

AI 作業の終了時に、次の作業者が現在地と未完了事項を短時間で把握できる長さで記録する。コマンドの生ログや会話全文は残さない。

## Naming

`YYYY-MM-DD-short-topic.md`。同日に同名がある場合は末尾へ連番を付ける。

## Template

```markdown
# Session: Topic

Date: YYYY-MM-DD

## Request

依頼の要約。

## Investigation

確認した入口、検索語、判明事項。

## Changes

変更内容と判断。

## Files Changed

主要ファイル。

## Validation

実行結果と、未実施なら理由。

## Result

完了状態。

## Remaining Issues

次回へ渡す事項。なければ `None`。
```
