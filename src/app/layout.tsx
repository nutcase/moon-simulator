import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '月の動きシミュレーター｜中学受験 理科 月の満ち欠け・動きを視覚的に学べる',
  description:
    '中学受験の理科対策に最適な月の動きシミュレーターです。月齢・時刻を自由に変えて、月の満ち欠け・南中・月の出入りの仕組みを視覚的に理解できます。新月・三日月・上弦・満月・下弦の見え方や位置関係をインタラクティブに学習しましょう。',
  keywords: [
    '中学受験',
    '理科',
    '月の満ち欠け',
    '月の動き',
    'シミュレーター',
    '月齢',
    '月の出',
    '月の入り',
    '南中',
    '上弦の月',
    '下弦の月',
    '満月',
    '新月',
    '三日月',
    '小学生',
    '理科 天体',
  ],
  openGraph: {
    title: '月の動きシミュレーター｜中学受験 理科の天体学習に',
    description:
      '月齢と時刻を変えて月の満ち欠け・位置関係を視覚的に学べる、中学受験対策用のインタラクティブ教材です。',
    type: 'website',
    locale: 'ja_JP',
    siteName: '月の動きシミュレーター',
  },
  twitter: {
    card: 'summary_large_image',
    title: '月の動きシミュレーター｜中学受験 理科',
    description:
      '月の満ち欠けと動きを視覚的に学べるシミュレーター。中学受験の理科対策に。',
  },
  robots: {
    index: true,
    follow: true,
  },
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
