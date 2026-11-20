import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical';

export const LEGAL_NOTICE_SLUG = 'legal-notice';

const text = (value: string) => ({
  type: 'text' as const,
  version: 1,
  text: value,
  format: 0,
  detail: 0,
  mode: 'normal' as const,
  style: '',
});

const elementProps = { version: 1, direction: 'ltr' as const, format: '' as const, indent: 0 };

const heading = (value: string) => ({
  ...elementProps,
  type: 'heading' as const,
  tag: 'h2' as const,
  children: [text(value)],
});

const paragraph = (value: string) => ({
  ...elementProps,
  type: 'paragraph' as const,
  textFormat: 0,
  textStyle: '',
  children: [text(value)],
});

const bulletList = (items: string[]) => ({
  ...elementProps,
  type: 'list' as const,
  listType: 'bullet' as const,
  start: 1,
  tag: 'ul' as const,
  children: items.map((item, index) => ({
    ...elementProps,
    type: 'listitem' as const,
    checked: undefined,
    value: index + 1,
    children: [text(item)],
  })),
});

const content: DefaultTypedEditorState = {
  root: {
    ...elementProps,
    type: 'root',
    children: [
      heading('Publisher'),
      paragraph(
        'WEARESTUDIO99, non-profit organisation (under the 1901 law), domiciled at 8 rue Santos Dumont, Lyon 69008, France, registered under no. 924529076',
      ),
      heading('Publication directors'),
      bulletList(['Mr. Thibault Walterspieler, president', 'Mr. Roman Verne, vice-president']),
      heading('Hosting'),
      paragraph('Cloudflare, Inc. 101 Townsend St, San Francisco, CA 94107, USA'),
    ],
  },
};

// The legal notice is a legal requirement, so it is the one policy with built-in defaults, shown
// if the database cannot be read. A deliberate copy of the text the `policies` migration seeded:
// a migration must keep producing the same rows forever, so it cannot import from here. Later
// edits made in the CMS are not reflected in this copy.
export const DEFAULT_LEGAL_NOTICE = { title: 'Legal Notice', content };
