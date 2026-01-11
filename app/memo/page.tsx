"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import BottomNav from "../components/BottomNav";
import { useLoginGuard } from "../hooks/useLoginGuard";

type MemoEntry = {
  id: string;
  date: string;
  title: string;
  body: string;
  tag: "info" | "alert";
};

export default function MemoPage() {
  const { isReady } = useLoginGuard();
  const today = new Date();
  const initialMonth = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}`;
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const [memoEntries, setMemoEntries] = useState<MemoEntry[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formState, setFormState] = useState({
    date: `${initialMonth}-01`,
    title: "",
    body: "",
    tag: "info",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const monthLabel = useMemo(() => {
    const [yearText, monthText] = currentMonth.split("-");
    return `${yearText}年${Number(monthText)}月`;
  }, [currentMonth]);

  useEffect(() => {
    if (!isReady) {
      return;
    }
    let isActive = true;
    setErrorMessage(null);

    const fetchMemos = async () => {
      const response = await fetch(`/api/memos?month=${currentMonth}`);
      if (!response.ok) {
        throw new Error("メモの取得に失敗しました。");
      }
      const payload = (await response.json()) as {
        memos: MemoEntry[];
      };
      if (isActive) {
        setMemoEntries(payload.memos);
      }
    };

    fetchMemos().catch((error: unknown) => {
      if (isActive) {
        setErrorMessage(
          error instanceof Error ? error.message : "メモの取得に失敗しました。",
        );
      }
    });

    return () => {
      isActive = false;
    };
  }, [currentMonth, isReady]);

  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      date: `${currentMonth}-01`,
    }));
  }, [currentMonth]);

  const shiftMonth = useCallback(
    (delta: number) => {
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
    },
    [currentMonth],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const payload = {
      date: formState.date,
      title: formState.title.trim(),
      body: formState.body.trim(),
      tag: formState.tag as MemoEntry["tag"],
    };

    try {
      const response = await fetch("/api/memos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("メモの登録に失敗しました。");
      }
      const result = (await response.json()) as { memo: MemoEntry };
      setMemoEntries((prev) => [result.memo, ...prev]);
      setFormState((prev) => ({
        ...prev,
        title: "",
        body: "",
      }));
      setIsFormOpen(false);
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : "メモの登録に失敗しました。",
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
          <p className="eyebrow">メモ管理</p>
          <h1>日付ごとのメモ</h1>
          <p className="hero-note">記録したい気づきは日付ごとに整理。</p>
        </div>
      </header>

      <section className="card">
        <div className="section-header">
          <div>
            <h2>{monthLabel}のメモ</h2>
            <p className="muted">日付単位でメモを追加・閲覧。</p>
          </div>
          <div className="calendar-actions">
            <button type="button" className="ghost" onClick={() => shiftMonth(-1)}>
              前月
            </button>
            <button type="button" className="ghost" onClick={() => shiftMonth(1)}>
              翌月
            </button>
            <button
              type="button"
              className="ghost"
              onClick={() => setIsFormOpen((prev) => !prev)}
            >
              新しいメモ
            </button>
          </div>
        </div>
        {isFormOpen ? (
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
                <span className="form-label">タグ</span>
                <select
                  value={formState.tag}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      tag: event.target.value,
                    }))
                  }
                >
                  <option value="info">共有</option>
                  <option value="alert">要調整</option>
                </select>
              </label>
              <label className="form-field form-field-full">
                <span className="form-label">タイトル</span>
                <input
                  type="text"
                  value={formState.title}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      title: event.target.value,
                    }))
                  }
                  required
                />
              </label>
            </div>
            <label className="form-field">
              <span className="form-label">メモ内容</span>
              <textarea
                value={formState.body}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    body: event.target.value,
                  }))
                }
                rows={3}
                required
              />
            </label>
            {errorMessage ? (
              <p className="form-error">{errorMessage}</p>
            ) : null}
            <button type="submit" className="primary" disabled={isSubmitting}>
              {isSubmitting ? "登録中..." : "メモを登録"}
            </button>
          </form>
        ) : null}
        {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
        <div className="memo-list">
          {memoEntries.length === 0 ? (
            <p className="empty">この月のメモはまだありません。</p>
          ) : (
            memoEntries.map((entry) => (
              <div key={entry.id} className="memo-entry">
                <div className="memo-entry-header">
                  <div>
                    <p className="memo-date">{entry.date}</p>
                    <p className="memo-title">{entry.title}</p>
                  </div>
                  <span className={`memo-tag ${entry.tag}`}>
                    {entry.tag === "alert" ? "要調整" : "共有"}
                  </span>
                </div>
                <div className="memo-box">
                  <p className="memo-content">{entry.body}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <BottomNav />
    </main>
  );
}
