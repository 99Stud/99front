import { Analytics } from '@vercel/analytics/next';
import clsx from 'clsx';
import { Geist, Geist_Mono } from 'next/font/google';
import { FC, PropsWithChildren } from 'react';

import { DEFAULT_SEO, SITE_URL, TITLE_TEMPLATE } from '@lib/seo/constants';

import type { Metadata, Viewport } from 'next';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
};

// Base layer for every page; indexable pages add the CMS-managed description and share image
// through `generateMetadata` (see src/lib/seo/getPageMetadata.ts)
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_SEO.title,
    template: TITLE_TEMPLATE,
  },
  icons: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      url: '/favicon.ico',
      media: '(prefers-color-scheme: light)',
    },
    {
      rel: 'icon',
      type: 'image/png',
      url: '/favicon-dark.png',
      media: '(prefers-color-scheme: dark)',
    },
  ],
  creator: '99stud',
  authors: [{ name: '99stud', url: SITE_URL }],
  publisher: '99stud',
  twitter: {
    card: 'summary_large_image',
  },
};

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <link href="/favicon.ico" rel="icon" sizes="any" />
      <link href="/icon?<generated>" rel="icon" sizes="<generated>" type="image/<generated>" />
      <body className={clsx(geistSans.variable, geistMono.variable, 'font-sans antialiased')}>
        {children}
        {/* Vercel Analytics only resolves on Vercel; drop it once Cloudflare serves production */}
        {process.env.VERCEL && <Analytics />}
      </body>
    </html>
  );
};

export default RootLayout;
