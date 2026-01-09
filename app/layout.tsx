import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kakeibo",
  description: "家計簿アプリのモバイル向けUI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <div className="app-shell">{children}</div>
      </body>
    </html>
  );
}
