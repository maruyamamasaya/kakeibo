const features = [
  {
    title: "支出の記録",
    description: "ワンタップで金額とカテゴリを登録。",
  },
  {
    title: "予算の確認",
    description: "週・月の予算と残りをすぐに確認。",
  },
  {
    title: "家計レポート",
    description: "グラフで支出の偏りを把握。",
  },
];

const categories = [
  "食費",
  "交通",
  "日用品",
  "住居",
  "サブスク",
  "交際",
];

export default function Home() {
  return (
    <main className="screen">
      <header className="hero">
        <div className="pill">モバイルファースト UI</div>
        <h1>
          かんたん家計簿で
          <br />
          毎日の支出を見える化
        </h1>
        <p>
          Cognitoログインを前提に、家計簿のベース画面だけをシンプルに設計。
        </p>
        <div className="actions">
          <button className="primary">Cognitoでログイン</button>
          <button className="ghost">デモを見る</button>
        </div>
        <div className="meta">
          <span>次回: 要件ヒアリング</span>
          <span>DB: DynamoDB</span>
        </div>
      </header>

      <section className="card">
        <h2>今日のサマリー</h2>
        <div className="summary-grid">
          <div>
            <p className="label">本日の支出</p>
            <p className="value">¥2,450</p>
          </div>
          <div>
            <p className="label">今月の残り</p>
            <p className="value">¥38,200</p>
          </div>
          <div>
            <p className="label">予算消化</p>
            <p className="value">62%</p>
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
        <h2>機能イメージ</h2>
        <div className="feature-list">
          {features.map((feature) => (
            <div key={feature.title} className="feature">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card cta">
        <div>
          <h2>まずはUIの雰囲気を確認</h2>
          <p>要件確定後に項目追加・権限設計を進めます。</p>
        </div>
        <button className="primary">要件を共有する</button>
      </section>
    </main>
  );
}
