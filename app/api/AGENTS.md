# API Area Rules

この規約は `app/api/` 以下に適用し、ルート `AGENTS.md` を補足する。

- Route Handler は transport と入力検証に集中させ、DynamoDB/Cognito連携は `app/lib/` の既存境界を追う。
- method、path、request/response shape、status code、呼び出す `app/lib` symbol を変更前に検索する。
- API は現在 middleware の認証対象外である。新規・変更 route では認証・認可の要否を明示的に確認する。
- client入力を信用せず、required、型、列挙値、形式、範囲を境界で検証する。
- 内部情報やsecretをresponse/errorへ露出しない。外部サービスの失敗は意図したstatusと安全なmessageへ変換する。
- Fast validation の後、正常系、欠落/不正入力、外部サービス失敗を確認し、完了前に Full validation を行う。
