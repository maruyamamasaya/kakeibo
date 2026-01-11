"use client";

import Link from "next/link";

import sampleData from "../../data/sample-data.json";

import BottomNav from "../components/BottomNav";
import { useLoginGuard } from "../hooks/useLoginGuard";

type CategorySummary = {
  name: string;
  amount: string;
  rate: string;
};

const { categorySummary, month } = sampleData as {
  month: string;
  categorySummary: CategorySummary[];
};

const [yearText, monthText] = month.split("-");
const monthLabel = `${yearText}年${Number(monthText)}月`;

export default function SummaryPage() {
  const { isReady } = useLoginGuard();

  if (!isReady) {
    return null;
  }

  return (
    <main className="screen">
      <header className="hero">
        <div className="hero-top">
          <div>
            <p className="eyebrow">家計簿サマリー</p>
            <h1>{monthLabel}の収支</h1>
          </div>
          <div className="month-switch">
            <button className="ghost" aria-label="前の月">
              ◀
            </button>
            <span>{month}</span>
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
          <Link href="/details" className="ghost button-link">
            日別へ切替
          </Link>
        </div>
        <div className="chart-area">
          <div className="chart-ring">
            <span>支出全体</span>
          </div>
          <div className="chart-legend">
            {categorySummary.map((category) => (
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

      <BottomNav />
    </main>
  );
}
