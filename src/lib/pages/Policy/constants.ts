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

const element = { version: 1, direction: 'ltr' as const, format: '' as const, indent: 0 };

const heading = (value: string) => ({
  ...element,
  type: 'heading' as const,
  tag: 'h2' as const,
  children: [text(value)],
});

const paragraph = (value: string) => ({
  ...element,
  type: 'paragraph' as const,
  textFormat: 0,
  textStyle: '',
  children: [text(value)],
});

const bulletList = (items: string[]) => ({
  ...element,
  type: 'list' as const,
  listType: 'bullet' as const,
  start: 1,
  tag: 'ul' as const,
  children: items.map((item, index) => ({
    ...element,
    type: 'listitem' as const,
    checked: undefined,
    value: index + 1,
    children: [text(item)],
  })),
});

const content: DefaultTypedEditorState = {
  root: {
    ...element,
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

// The legal notice is a legal requirement, so it is the one policy with built-in defaults: the
// text the `policies` migration seeded, shown if the database cannot be read
export const DEFAULT_LEGAL_NOTICE = { title: 'Legal Notice', content };
