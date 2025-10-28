import React, { Suspense } from 'react';
import '../styles/globals.css';
import { getGlobalData } from '../lib/cosmic';
import Generator from 'next/font/local';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { Providers } from '../components/Providers';

const sans = Generator({
  src: '../fonts/Generator-Variable.ttf',
  variable: '--font-sans',
});

export async function generateMetadata() {
  try {
    const siteData = await getGlobalData();
    return {
      title: siteData?.metadata?.site_title ?? 'BUMS ALLIANCE',
      description: siteData?.metadata?.site_tag ?? '',
    };
  } catch (e) {
    return {
      title: 'BUMS ALLIANCE',
      description: '',
    };
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Move the fetching of site data into a Server Component wrapped by Suspense
  // to avoid uncached data being accessed outside of <Suspense> when
  // `cacheComponents` is enabled in next.config.

  const SiteHeader = async function SiteHeaderServerComponent() {
    try {
      const siteData = await getGlobalData();
      return <Header name={siteData} />;
    } catch (e) {
      // Provide a minimal fallback header if fetching fails
      return <Header name={{ metadata: { site_title: 'BUMS ALLIANCE', site_tag: '' } } as any} />;
    }
  };

  // Do not call `new Date()` here; Footer computes year client-side to avoid
  // server-side prerender restrictions in newer Next.js with cacheComponents.

  return (
    <html lang="en" className={`${sans.variable} font-sans`}>
      <body className="bg-white dark:bg-zinc-950">

        <Suspense fallback={<Header name={{ metadata: { site_title: 'BUMS ALLIANCE', site_tag: '' } } as any} />}>
          <SiteHeader />
        </Suspense>
        <Providers>
          {children}
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
