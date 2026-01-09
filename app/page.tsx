"use client";

import { useMemo, useState } from "react";

const categories = ["食費", "交通", "日用品", "住居", "サブスク", "交際"];

const calendarDays = Array.from({ length: 31 }, (_, index) => {
  const day = index + 1;
  const date = `2026-01-${String(day).padStart(2, "0")}`;

  return { day, date };
});

const transactions = [
  {
    id: "tx-001",
    date: "2026-01-02",
    amount: 520,
    type: "expense",
    category: "食費",
    note: "朝食",
    payer: "yui",
  },
  {
    id: "tx-002",
    date: "2026-01-02",
    amount: 1800,
    type: "expense",
    category: "日用品",
    note: "洗剤・ティッシュ",
    payer: "yui",
  },
  {
    id: "tx-003",
    date: "2026-01-03",
    amount: 6500,
    type: "income",
    category: "副収入",
    note: "ポイント還元",
    payer: "kei",
  },
  {
    id: "tx-004",
    date: "2026-01-03",
    amount: 1200,
    type: "expense",
    category: "交通",
    note: "定期券",
    payer: "kei",
  },
  {
    id: "tx-005",
    date: "2026-01-06",
    amount: 3400,
    type: "expense",
    category: "住居",
    note: "共益費",
    payer: "yui",
  },
  {
    id: "tx-006",
    date: "2026-01-09",
    amount: 980,
    type: "expense",
    category: "食費",
    note: "ランチ",
    payer: "kei",
  },
  {
    id: "tx-007",
    date: "2026-01-09",
    amount: 2800,
    type: "income",
    category: "振込",
    note: "精算",
    payer: "yui",
  },
  {
    id: "tx-008",
    date: "2026-01-13",
    amount: 2100,
    type: "expense",
    category: "サブスク",
    note: "動画配信",
    payer: "kei",
  },
  {
    id: "tx-009",
    date: "2026-01-18",
    amount: 4800,
    type: "expense",
    category: "交際",
    note: "家族ディナー",
    payer: "yui",
  },
  {
    id: "tx-010",
    date: "2026-01-25",
    amount: 32000,
    type: "income",
    category: "給与",
    note: "振込",
    payer: "kei",
  },
];

export default function Home() {
  const [selectedDate, setSelectedDate] = useState("2026-01-09");

  const totalsByDate = useMemo(() => {
    return transactions.reduce(
      (acc, transaction) => {
        const current = acc[transaction.date] ?? {
          income: 0,
          expense: 0,
        };
        const updated = {
          income:
            transaction.type === "income"
              ? current.income + transaction.amount
              : current.income,
          expense:
            transaction.type === "expense"
              ? current.expense + transaction.amount
              : current.expense,
        };

        return { ...acc, [transaction.date]: updated };
      },
      {} as Record<string, { income: number; expense: number }>,
    );
  }, []);

  const selectedTransactions = useMemo(
    () => transactions.filter((item) => item.date === selectedDate),
    [selectedDate],
  );

  const selectedTotals = totalsByDate[selectedDate] ?? {
    income: 0,
    expense: 0,
  };

  return (
    <main className="screen">
      <header className="hero" id="summary">
        <div className="hero-top">
          <div>
            <p className="eyebrow">家計簿サマリー</p>
            <h1>2026年1月の収支</h1>
          </div>
          <div className="month-switch">
            <button className="ghost" aria-label="前の月">
              ◀
            </button>
            <span>2026-01</span>
            <button className="ghost" aria-label="次の月">
              ▶
            </button>
          </div>
        </div>
        <div className="meta">
          <span>次回: カレンダーUI確定</span>
          <span>DB: DynamoDB</span>

        </div>
      </header>

      <section className="card">
        <div className="section-header">
          <div>
            <h2>カテゴリ別支出</h2>
            <p className="muted">MVPは円グラフで構成し、詳細画面で深掘り。</p>
          </div>
          <button className="ghost">日別へ切替</button>
        </div>
        <div className="chart-area">
          <div className="chart-ring">
            <span>支出全体</span>
          </div>
          <div className="chart-legend">
            {categories.map((category) => (
              <div key={category.name} className="legend-row">
                <span className="dot" />
                <div>
                  <p className="legend-title">{category.name}</p>
                  <p className="legend-meta">
                    {category.amount} ・ {category.rate}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card">
        <div className="calendar-header">
          <div>
            <h2>2026年1月</h2>
            <p className="caption">都度集計で日別合計を表示</p>
          </div>
          <div className="calendar-actions">
            <button type="button" className="ghost">
              前月
            </button>
            <button type="button" className="ghost">
              翌月
            </button>
          </div>
        </div>
        <div className="calendar-grid">
          {calendarDays.map((day) => {
            const totals = totalsByDate[day.date];
            const isSelected = day.date === selectedDate;

            return (
              <button
                key={day.date}
                type="button"
                className={`calendar-day${isSelected ? " is-selected" : ""}`}
                onClick={() => setSelectedDate(day.date)}
              >
                <span className="day-number">{day.day}</span>
                <span className="day-expense">
                  {totals?.expense
                    ? `¥${totals.expense.toLocaleString()}`
                    : "—"}
                </span>
                <span className="day-income">
                  {totals?.income
                    ? `+¥${totals.income.toLocaleString()}`
                    : ""}
                </span>
              </button>
            );
          })}
        </div>
        <div className="day-detail">
          <div className="day-detail-header">
            <div>
              <h3>{selectedDate} の明細</h3>
              <p className="caption">日をタップすると下に展開</p>
            </div>
            <div className="day-detail-total">
              <span>支出</span>
              <strong>¥{selectedTotals.expense.toLocaleString()}</strong>
              <small>収入 +¥{selectedTotals.income.toLocaleString()}</small>
            </div>
          </div>
          <div className="day-detail-list">
            {selectedTransactions.length === 0 ? (
              <p className="empty">この日の明細はありません。</p>
            ) : (
              selectedTransactions.map((item) => (
                <div key={item.id} className="transaction-row">
                  <div>
                    <p className="transaction-category">{item.category}</p>
                    <p className="transaction-note">{item.note}</p>
                  </div>
                  <div className="transaction-meta">
                    <span className={`badge ${item.type}`}>
                      {item.type === "income" ? "収入" : "支出"}
                    </span>
                    <strong>
                      {item.type === "income" ? "+" : ""}
                      ¥{item.amount.toLocaleString()}
                    </strong>
                    <small>支払: {item.payer}</small>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="card">
        <h2>よく使うカテゴリ</h2>
        <div className="chip-grid">
          {categories.map((category) => (
            <span key={category} className="chip">
              {category}
            </span>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>家族用データ設計（DynamoDB）</h2>
        <div className="schema-block">
          <p className="label">テーブル名</p>
          <p className="schema-title">HouseholdLedger（おすすめ）</p>
          <div className="schema-columns">
            <div>
              <p className="label">PK</p>
              <p>HOUSEHOLD#{"<householdId>"}</p>
            </div>
            <div>
              <p className="label">SK</p>
              <p>PERIOD#2026-01#DATE#2026-01-09#TX#{"<uuid>"}</p>
            </div>
          </div>
          <div className="schema-list">
            <div>
              <p className="label">アイテム例</p>
              <ul>
                <li>PERIOD#2026-01#DATE#2026-01-09#TX#{"<uuid>"}</li>
                <li>PERIOD#2026-01#MEMO</li>
                <li>META#SETTINGS</li>
                <li>META#MEMBER#{"<userId>"}</li>
              </ul>
            </div>
            <div>
              <p className="label">Transaction属性</p>
              <ul>
                <li>date, amount, type (income / expense)</li>
                <li>category, note, payer</li>
                <li>createdAt, updatedAt</li>
              </ul>
            </div>
          </div>
          <p className="caption">
            begins_with(SK, &quot;PERIOD#2026-01#DATE#&quot;)
            で期間内の明細取得が簡単。
          </p>
        </div>
      </section>

      <section className="card cta">
        <div>
          <h2>日別集計の体験を確認</h2>
          <p>祝日は後回し。まずは金額の気持ちよさを優先。</p>
        </div>
      </section>

      <nav className="bottom-nav">
        <a href="#summary" className="active">
          サマリー
        </a>
        <a href="#details">詳細</a>
        <a href="#memo">メモ</a>
      </nav>
    </main>
  );
}
