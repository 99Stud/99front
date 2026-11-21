import clsx from 'clsx';
import { notFound } from 'next/navigation';
import { FC } from 'react';

import { getPolicy } from '@lib/pages/Policy/getPolicy';
import { DOCUMENT_PATHS } from '@lib/routes/documentPaths';
import { getPageMetadata } from '@lib/seo/getPageMetadata';

import { RichText } from '@components/content/RichText';
import { StickerLogo } from '@components/icons/StickerLogo';

import type { Metadata } from 'next';

// Read the CMS on each request so edits made there show up immediately
export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ slug: string }>;
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params;
  const policy = await getPolicy(slug);
  if (!policy) return {};
  return getPageMetadata({ path: DOCUMENT_PATHS.policies(slug), title: policy.title });
};

const PolicyPage: FC<Props> = async ({ params }) => {
  const { slug } = await params;
  const policy = await getPolicy(slug);
  if (!policy) notFound();

  return (
    // One left-aligned column for the header and the text: the logo leans diagonally, so centring
    // it under the title always looks off
    <div className={clsx('min-h-screen px-6 py-12', 'flex justify-center')}>
      <div className={clsx('w-full max-w-[450px]', 'flex flex-col gap-6')}>
        <header className={clsx('flex flex-col items-start gap-5')}>
          <StickerLogo className={clsx('h-auto w-24')} />
          <h1 className={clsx('text-2xl font-bold uppercase')}>{policy.title}</h1>
        </header>
        <main>
          <RichText className={clsx('prose-sm')} data={policy.content} />
        </main>
      </div>
    </div>
  );
};

export default PolicyPage;
