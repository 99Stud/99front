'use client';

import { Link, useConfig } from '@payloadcms/ui';
import { usePathname } from 'next/navigation';
import { formatAdminURL } from 'payload/shared';
import { FC } from 'react';

import { SIGNATURE_VIEW_PATH } from '@components/admin/Signature/constants';

// Same markup and classes as Payload's own sidebar links, so it inherits their styles
export const SignatureNavLink: FC = () => {
  const pathname = usePathname();
  const { config } = useConfig();
  const href = formatAdminURL({ adminRoute: config.routes.admin, path: SIGNATURE_VIEW_PATH });

  return (
    <Link className="nav__link" href={href} prefetch={false}>
      {pathname === href && <div className="nav__link-indicator" />}
      <span className="nav__link-label">Email signature</span>
    </Link>
  );
};
