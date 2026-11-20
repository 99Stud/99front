import { DEFAULT_SOCIAL_LINKS } from '@lib/pages/Home/constants';

import type { GlobalConfig } from 'payload';

export const SocialLinks: GlobalConfig = {
  slug: 'social-links',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'links',
      type: 'array',
      defaultValue: DEFAULT_SOCIAL_LINKS,
      admin: {
        description:
          'In this order. Tick "Show on home page" for the links in the top-right corner of the home page. The email signature uses the same list: pick its links on the "Email signature" page.',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'href',
          type: 'text',
          label: 'URL',
          required: true,
          // Rendered as a link target: only allow https addresses, never `javascript:` and the like
          validate: (value: string | null | undefined) => {
            try {
              const { protocol } = new URL(value ?? '');
              if (protocol === 'https:') return true;
            } catch {
              // fall through to the error message
            }
            return 'Enter a full web address starting with https://';
          },
        },
        {
          name: 'showOnHome',
          type: 'checkbox',
          label: 'Show on home page',
          defaultValue: true,
        },
        {
          // Picked and saved on the "Email signature" admin page. Left out of this screen's form
          // altogether (not just hidden), so saving this screen can never write back an old pick.
          name: 'showInSignature',
          type: 'checkbox',
          defaultValue: false,
          admin: { disabled: true },
        },
      ],
    },
  ],
};
