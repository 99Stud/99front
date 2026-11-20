import clsx from 'clsx';
import Link from 'next/link';
import { FC } from 'react';
import { preload } from 'react-dom';

import { getSocialLinks } from '@lib/pages/Home/getSocialLinks';
import { getPolicyLinks } from '@lib/pages/Policy/getPolicyLinks';
import { getPageMetadata } from '@lib/seo/getPageMetadata';

import { criticalAssets } from '@99Stud/webgl/utils/manifest/preloadManifest';
import { HomeClient } from '@components/pages/Home/HomeClient';

import type { Metadata } from 'next';

// Read the links and SEO on each request so edits made in the CMS show up immediately
export const dynamic = 'force-dynamic';

export const generateMetadata = (): Promise<Metadata> => getPageMetadata({ path: '/' });

const Home: FC = async () => {
  const [socialLinks, policyLinks] = await Promise.all([getSocialLinks(), getPolicyLinks()]);

  // Matches the loaders' fetch mode (cors, same-origin credentials) so the preloaded response is reused
  for (const href of criticalAssets) {
    preload(href, { as: 'fetch', crossOrigin: 'anonymous' });
  }

  return (
    <main>
      <HomeClient />
      <header
        className={clsx(
          'fixed h-dvh w-dvw',
          'grid grid-cols-1 grid-rows-3 md:grid-cols-2 md:grid-rows-2',
        )}
      >
        <nav
          className={clsx('fixed top-4 left-4 lg:bottom-4', 'flex flex-col gap-4', 'text-white')}
        >
          {policyLinks.map((link) => (
            <Link
              className={clsx('text-sm font-medium underline select-none')}
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <nav className={clsx('fixed top-4 right-4', 'flex flex-col gap-3', 'text-right font-mono')}>
          {socialLinks.map((link) => (
            <Link
              aria-label={`99stud on ${link.label}`}
              className={clsx('font-medium text-gray-400 uppercase underline select-none')}
              href={link.href}
              key={link.id ?? link.href}
              rel="noopener noreferrer"
              target="_blank"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div
          className={clsx(
            'col-start-1 row-start-3 md:col-start-2 md:row-start-2',
            'flex items-center justify-center gap-3',
            'text-white select-none',
          )}
        >
          <h1 className={clsx('text-2xl font-bold tracking-[-0.125em] italic')}>99stud</h1>
          <span className={clsx('text-xl font-light', 'translate-y-0.2w5')}>
            creative collective
          </span>
        </div>
      </header>
    </main>
  );
};

export default Home;
