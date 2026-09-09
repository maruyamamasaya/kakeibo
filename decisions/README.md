# Architecture Decision Records

将来の作業者がコードだけでは理由を復元しにくい、重要で長期的な設計判断を記録する。すべての変更に ADR は不要。

## Naming

`NNNN-short-title.md`。番号は既存の最大値に 1 を加える。

## Template

```markdown
# NNNN: Title

Date: YYYY-MM-DD
Status: proposed | accepted | superseded

## Context

何が問題で、どの制約があるか。

## Decision

何を選ぶか。

## Reason

なぜ選ぶか。

## Alternatives

検討した他案。

## Consequences

良い影響、負担、移行や見直し条件。
```

現時点では、過去の実装理由を十分に裏付ける設計文書がないため、既存構成を後付けで ADR 化していない。
