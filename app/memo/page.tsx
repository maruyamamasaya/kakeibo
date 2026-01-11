"use client";

import sampleData from "../../data/sample-data.json";

import BottomNav from "../components/BottomNav";
import { useLoginGuard } from "../hooks/useLoginGuard";

type MemoEntry = {
  date: string;
  title: string;
  body: string;
  tag: "info" | "alert";
};

const { month } = sampleData as { month: string };

const memoEntries: MemoEntry[] = [
  {
    date: `${month}-02`,
    title: "特売メモ",
    body: "食材のまとめ買いを実施。来週の献立に反映。",
    tag: "info",
  },
  {
    date: `${month}-09`,
    title: "振込の確認",
    body: "精算分の振込を確認。次回は早めに共有する。",
    tag: "info",
  },
  {
    date: `${month}-18`,
    title: "外食多め",
    body: "家族ディナーが重なったので来週は自炊多めに調整。",
    tag: "alert",
  },
];

export default function MemoPage() {
  const { isReady } = useLoginGuard();

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
            <h2>今月のメモ</h2>
            <p className="muted">日付単位でメモを追加・閲覧する想定。</p>
          </div>
          <button className="ghost">新しいメモ</button>
        </div>
        <div className="memo-list">
          {memoEntries.map((entry) => (
            <div key={entry.date} className="memo-entry">
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
          ))}
        </div>
      </section>

      <BottomNav />
    </main>
  );
}
