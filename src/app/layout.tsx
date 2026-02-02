import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '月の動きシミュレーター',
  description: '中学受験用 月の動きと満ち欠けシミュレーター',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
