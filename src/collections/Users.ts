import { formatAdminURL } from 'payload/shared';

import { renderResetPasswordEmail } from '@lib/emails/ResetPasswordEmail';

import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    forgotPassword: {
      generateEmailSubject: () => 'Reset your 99stud password',
      generateEmailHTML: ({ req, token, user } = {}) => {
        if (!req || !token || !user) throw new Error('Payload passes req, token and user');
        const { config } = req.payload;
        // Payload's own link only trusts the Host header when it is in a CORS/CSRF allowlist, and
        // there is none: previews have no fixed URL. Here the request URL is safe to use, because
        // Cloudflare routes on the hostname, so a request with a forged Host never reaches the
        // Worker.
        const resetURL = formatAdminURL({
          adminRoute: config.routes.admin,
          path: `${config.admin.routes.reset}/${token}`,
          serverURL: new URL(req.url!).origin,
        });
        return renderResetPasswordEmail({ email: user.email, resetURL });
      },
    },
  },
  fields: [],
};
