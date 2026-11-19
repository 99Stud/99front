import { DefaultTemplate } from '@payloadcms/next/templates';
import { Gutter, SetStepNav } from '@payloadcms/ui';
import { redirect } from 'next/navigation';
import { formatAdminURL } from 'payload/shared';
import { FC } from 'react';

import { SIGNATURE_VIEW_PATH } from '@components/admin/Signature/constants';
import { SignatureTool } from '@components/admin/Signature/SignatureTool';

import type { AdminViewServerProps } from 'payload';

export const SignatureView: FC<AdminViewServerProps> = async ({
  initPageResult,
  params,
  searchParams,
}) => {
  const { locale, permissions, req, visibleEntities } = initPageResult;
  const { i18n, payload, user } = req;

  // Payload does not guard custom views: without this check the tool would be public
  if (!user) {
    const { admin, routes } = payload.config;
    const login = formatAdminURL({ adminRoute: routes.admin, path: admin.routes.login });
    const signature = formatAdminURL({ adminRoute: routes.admin, path: SIGNATURE_VIEW_PATH });
    redirect(`${login}?redirect=${encodeURIComponent(signature)}`);
  }

  const { links } = await payload.findGlobal({ slug: 'social-links' });
  const signatureLinks = (links ?? [])
    .filter((link) => link.showInSignature)
    .map(({ label, href }) => ({ label, href }));

  return (
    <DefaultTemplate
      i18n={i18n}
      locale={locale}
      params={params}
      payload={payload}
      permissions={permissions}
      req={req}
      searchParams={searchParams}
      user={user}
      visibleEntities={visibleEntities}
    >
      <SetStepNav nav={[{ label: 'Email signature' }]} />
      <Gutter>
        <SignatureTool links={signatureLinks} />
      </Gutter>
    </DefaultTemplate>
  );
};
