import clsx from 'clsx';
import { notFound } from 'next/navigation';
import { FC } from 'react';

import { DOCUMENT_PATHS } from '@lib/documentPaths';
import { getPolicy } from '@lib/pages/Policy/getPolicy';
import { getPageMetadata } from '@lib/seo/getPageMetadata';

import { Logo } from '@components/icons/99studLogo';
import { RichText } from '@components/RichText';

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
    <div className={clsx('min-h-screen py-12', 'flex flex-col items-center justify-center gap-6')}>
      <header className={clsx('space-y-6')}>
        <h1 className={clsx('text-2xl font-bold uppercase')}>{policy.title}</h1>
        <Logo />
      </header>
      <main className={clsx('px-6')}>
        <RichText className={clsx('prose-sm max-w-[450px]')} data={policy.content} />
      </main>
    </div>
  );
};

export default PolicyPage;
