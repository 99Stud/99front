import { DefaultTemplate } from '@payloadcms/next/templates';
import { Gutter, SetStepNav } from '@payloadcms/ui';
import { redirect } from 'next/navigation';
import { formatAdminURL } from 'payload/shared';
import { FC } from 'react';

import { toSignatureLinkChoices } from '@lib/pages/Signature/signatureLinks';

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
    const loginUrl = formatAdminURL({ adminRoute: routes.admin, path: admin.routes.login });
    const signatureUrl = formatAdminURL({ adminRoute: routes.admin, path: SIGNATURE_VIEW_PATH });
    redirect(`${loginUrl}?redirect=${encodeURIComponent(signatureUrl)}`);
  }

  const socialLinks = await payload.findGlobal({ slug: 'social-links' });

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
      // A copy, as in Payload's own root view: passing the object itself can throw React 19's
      // "Cannot assign to read only property" error
      visibleEntities={{
        collections: visibleEntities.collections,
        globals: visibleEntities.globals,
      }}
    >
      <SetStepNav nav={[{ label: 'Email signature' }]} />
      <Gutter>
        <SignatureTool initialLinks={toSignatureLinkChoices(socialLinks)} />
      </Gutter>
    </DefaultTemplate>
  );
};
