"use client";

import {
  useMemo,
  useState,
  useEffect,
  useCallback,
  type FormEvent,
} from "react";

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

export default function DetailsPage() {
  const { isReady } = useLoginGuard();
  const today = new Date();
  const initialMonth = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}`;
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedDate, setSelectedDate] = useState(`${initialMonth}-01`);
  const [formState, setFormState] = useState({
    date: `${initialMonth}-01`,
    amount: "",
    type: "expense",
    category: "",
    note: "",
    payer: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const monthLabel = useMemo(() => {
    const [yearText, monthText] = currentMonth.split("-");
    return `${yearText}年${Number(monthText)}月`;
  }, [currentMonth]);

  const calendarDays = useMemo(() => {
    const [yearText, monthText] = currentMonth.split("-");
    const daysInMonth = new Date(
      Number(yearText),
      Number(monthText),
      0,
    ).getDate();

    return Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      const date = `${currentMonth}-${String(day).padStart(2, "0")}`;

      return { day, date };
    });
  }, [currentMonth]);

  useEffect(() => {
    if (!isReady) {
      return;
    }
    let isActive = true;
    setErrorMessage(null);

    const fetchTransactions = async () => {
      const response = await fetch(`/api/transactions?month=${currentMonth}`);
      if (!response.ok) {
        throw new Error("明細の取得に失敗しました。");
      }
      const payload = (await response.json()) as {
        transactions: Transaction[];
      };
      if (isActive) {
        setTransactions(payload.transactions);
      }
    };

    fetchTransactions().catch((error: unknown) => {
      if (isActive) {
        setErrorMessage(
          error instanceof Error ? error.message : "明細の取得に失敗しました。",
        );
      }
    });

    return () => {
      isActive = false;
    };
  }, [currentMonth, isReady]);

  useEffect(() => {
    const monthPrefix = `${currentMonth}-`;
    if (!selectedDate.startsWith(monthPrefix)) {
      const fallbackDate =
        transactions.find((item) => item.date.startsWith(monthPrefix))
          ?.date ?? `${currentMonth}-01`;
      setSelectedDate(fallbackDate);
    }
  }, [currentMonth, selectedDate, transactions]);

  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      date: selectedDate,
    }));
  }, [selectedDate]);

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

  const shiftMonth = useCallback((delta: number) => {
    const [yearText, monthText] = currentMonth.split("-");
    const nextDate = new Date(
      Number(yearText),
      Number(monthText) - 1 + delta,
      1,
    );
    const nextMonth = `${nextDate.getFullYear()}-${String(
      nextDate.getMonth() + 1,
    ).padStart(2, "0")}`;
    setCurrentMonth(nextMonth);
  }, [currentMonth]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    if (!formState.amount) {
      setErrorMessage("金額を入力してください。");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      date: formState.date,
      amount: Number(formState.amount),
      type: formState.type as Transaction["type"],
      category: formState.category.trim(),
      note: formState.note.trim(),
      payer: formState.payer.trim(),
    };

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("明細の登録に失敗しました。");
      }
      const result = (await response.json()) as { transaction: Transaction };
      setTransactions((prev) => [result.transaction, ...prev]);
      setSelectedDate(result.transaction.date);
      setFormState((prev) => ({
        ...prev,
        amount: "",
        category: "",
        note: "",
        payer: "",
      }));
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "明細の登録に失敗しました。",
      );
    } finally {
      setIsSubmitting(false);
    }
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
            <button type="button" className="ghost" onClick={() => shiftMonth(-1)}>
              前月
            </button>
            <button type="button" className="ghost" onClick={() => shiftMonth(1)}>
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
          <form className="entry-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label className="form-field">
                <span className="form-label">日付</span>
                <input
                  type="date"
                  value={formState.date}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      date: event.target.value,
                    }))
                  }
                  required
                />
              </label>
              <label className="form-field">
                <span className="form-label">種別</span>
                <select
                  value={formState.type}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      type: event.target.value,
                    }))
                  }
                >
                  <option value="expense">支出</option>
                  <option value="income">収入</option>
                </select>
              </label>
              <label className="form-field">
                <span className="form-label">金額</span>
                <input
                  type="number"
                  min="0"
                  value={formState.amount}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      amount: event.target.value,
                    }))
                  }
                  required
                />
              </label>
              <label className="form-field">
                <span className="form-label">カテゴリ</span>
                <input
                  type="text"
                  value={formState.category}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      category: event.target.value,
                    }))
                  }
                  required
                />
              </label>
            </div>
            <label className="form-field">
              <span className="form-label">メモ</span>
              <textarea
                value={formState.note}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    note: event.target.value,
                  }))
                }
                rows={2}
              />
            </label>
            <label className="form-field">
              <span className="form-label">支払者</span>
              <input
                type="text"
                value={formState.payer}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    payer: event.target.value,
                  }))
                }
                required
              />
            </label>
            {errorMessage ? (
              <p className="form-error">{errorMessage}</p>
            ) : null}
            <button type="submit" className="primary" disabled={isSubmitting}>
              {isSubmitting ? "登録中..." : "この日に新規登録"}
            </button>
          </form>
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
