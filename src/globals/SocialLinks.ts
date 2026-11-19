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
          'Shown in the top-right corner of the home page, in this order. Links ticked "Show in email signature" also appear, in the same order, in the email signature.',
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
          name: 'showInSignature',
          type: 'checkbox',
          label: 'Show in email signature',
          defaultValue: false,
        },
      ],
    },
  ],
};
