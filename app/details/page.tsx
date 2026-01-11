"use client";

import { useMemo, useState } from "react";

import sampleData from "../../data/sample-data.json";

import BottomNav from "../components/BottomNav";
import { useLoginGuard } from "../hooks/useLoginGuard";

type Transaction = {
  id: string;
  date: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  note: string;
  payer: string;
};

const { transactions, month } = sampleData as {
  month: string;
  transactions: Transaction[];
};

const [yearText, monthText] = month.split("-");
const monthLabel = `${yearText}年${Number(monthText)}月`;
const daysInMonth = new Date(Number(yearText), Number(monthText), 0).getDate();
const calendarDays = Array.from({ length: daysInMonth }, (_, index) => {
  const day = index + 1;
  const date = `${month}-${String(day).padStart(2, "0")}`;

  return { day, date };
});

export default function DetailsPage() {
  const { isReady } = useLoginGuard();
  const defaultDate = transactions[0]?.date ?? `${month}-01`;
  const [selectedDate, setSelectedDate] = useState(defaultDate);

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
  }, [transactions]);

  const selectedTransactions = useMemo(
    () => transactions.filter((item) => item.date === selectedDate),
    [selectedDate, transactions],
  );

  const selectedTotals = totalsByDate[selectedDate] ?? {
    income: 0,
    expense: 0,
  };

  if (!isReady) {
    return null;
  }

  return (
    <main className="screen">
      <header className="hero hero-compact">
        <div>
          <p className="eyebrow">家計簿の詳細</p>
          <h1>{monthLabel}の明細</h1>
          <p className="hero-note">日付をタップして、その日の入力を追加。</p>
        </div>
      </header>

      <section className="card">
        <div className="calendar-header">
          <div>
            <h2>{monthLabel}</h2>
            <p className="caption">日を選ぶと下で入力イメージを表示。</p>
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
              <p className="caption">選択した日に新規登録できます。</p>
            </div>
            <div className="day-detail-total">
              <span>支出</span>
              <strong>¥{selectedTotals.expense.toLocaleString()}</strong>
              <small>収入 +¥{selectedTotals.income.toLocaleString()}</small>
            </div>
          </div>
          <div className="day-detail-actions">
            <button type="button" className="primary">
              この日に新規登録
            </button>
            <p className="hint">タップ後に入力フォームを開く想定。</p>
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

      <BottomNav />
    </main>
  );
}
