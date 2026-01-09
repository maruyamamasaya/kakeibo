const kpis = [
  { label: "支出合計", value: "¥128,400", hint: "固定費含む" },
  { label: "収入合計", value: "¥210,000", hint: "給与・その他" },
  { label: "差額", value: "¥81,600", hint: "収入-支出" },
  { label: "固定費合計", value: "¥76,000", hint: "家賃・サブスク" },
];

const categories = [
  { name: "食費", amount: "¥38,200", rate: "30%" },
  { name: "住居", amount: "¥62,000", rate: "48%" },
  { name: "交通", amount: "¥9,800", rate: "8%" },
  { name: "日用品", amount: "¥8,400", rate: "7%" },
  { name: "交際", amount: "¥6,000", rate: "5%" },
  { name: "サブスク", amount: "¥4,000", rate: "2%" },
];

const transactions = [
  {
    date: "01/05",
    type: "支出",
    category: "食費",
    amount: "¥2,450",
    note: "スーパー買い出し",
  },
  {
    date: "01/08",
    type: "支出",
    category: "交通",
    amount: "¥1,200",
    note: "通勤ICチャージ",
  },
  {
    date: "01/10",
    type: "収入",
    category: "給与",
    amount: "¥210,000",
    note: "会社からの振込",
  },
  {
    date: "01/12",
    type: "支出",
    category: "サブスク",
    amount: "¥980",
    note: "動画配信",
  },
];

export default function Home() {
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
        <p className="hero-note">
          DynamoDBに保存された明細を月次で集計。支出・固定費・カテゴリの傾向が一目でわかります。
        </p>
        <div className="kpi-grid">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="kpi-card">
              <p className="label">{kpi.label}</p>
              <p className="value">{kpi.value}</p>
              <p className="hint">{kpi.hint}</p>
            </div>
          ))}
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

      <section className="card" id="details">
        <div className="section-header">
          <div>
            <h2>明細一覧</h2>
            <p className="muted">種別・カテゴリ・金額レンジ・メモ検索に対応。</p>
          </div>
          <button className="primary">明細を追加</button>
        </div>
        <div className="filter-row">
          <span className="pill">すべて</span>
          <span className="pill">支出</span>
          <span className="pill">収入</span>
          <span className="pill">¥1,000-¥10,000</span>
          <span className="pill">メモ検索</span>
        </div>
        <div className="table">
          <div className="table-head">
            <span>日付</span>
            <span>種別</span>
            <span>カテゴリ</span>
            <span>金額</span>
            <span>メモ</span>
            <span>編集</span>
          </div>
          {transactions.map((tx, index) => (
            <div
              key={`${tx.date}-${tx.category}-${tx.amount}-${tx.note}-${index}`}
              className="table-row"
            >
              <span>{tx.date}</span>
              <span className={tx.type === "収入" ? "tag income" : "tag expense"}>
                {tx.type}
              </span>
              <span>{tx.category}</span>
              <span className="amount">{tx.amount}</span>
              <span className="note">{tx.note}</span>
              <button className="ghost">編集</button>
            </div>
          ))}
        </div>
      </section>

      <section className="card" id="memo">
        <div className="section-header">
          <div>
            <h2>月次メモ</h2>
            <p className="muted">気づきや改善点を月ごとに保存できます。</p>
          </div>
          <button className="ghost">保存</button>
        </div>
        <div className="memo-box">
          <p className="memo-title">今月の気づき</p>
          <p className="memo-content">
            ・固定費の割合が高め。来月はサブスクを見直す。
            <br />
            ・外食が増えたので週末のまとめ買いを強化する。
          </p>
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
