import { MoonSimulator } from '@/components/MoonSimulator';

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '月の動きシミュレーター',
    description:
      '中学受験の理科対策に最適な月の動きシミュレーターです。月齢・時刻を自由に変えて、月の満ち欠け・南中・月の出入りの仕組みを視覚的に理解できます。',
    applicationCategory: 'EducationalApplication',
    educationalLevel: '小学生・中学受験',
    inLanguage: 'ja',
    isAccessibleForFree: true,
    about: {
      '@type': 'Thing',
      name: '月の満ち欠けと動き',
      description: '月の公転による満ち欠けの変化と、地球から見た月の動き',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen p-4 md:p-8">
        <MoonSimulator />
      </main>
    </>
  );
}
