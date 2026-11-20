import { describe, expect, it } from 'vitest';

import { toSignatureLinkChoices, withSignaturePick } from '@lib/pages/Signature/signatureLinks';

import type { SocialLink } from '@99Stud/payload-types';

const links = [
  { id: 'a1', label: 'Instagram', href: 'https://instagram.test', showInSignature: true },
  { id: 'b2', label: 'Behance', href: 'https://behance.test', showInSignature: false },
];

// Until its first save the global has no `createdAt`, and its row ids change on every read
const neverSaved: SocialLink = { id: 1, links };
const saved: SocialLink = { id: 1, links, createdAt: '2026-11-19T09:54:14.000Z' };

const pickedLabels = (rows: ReturnType<typeof withSignaturePick>) =>
  rows.filter((row) => row.showInSignature).map((row) => row.label);

describe('toSignatureLinkChoices', () => {
  it('offers every social link, in order, with its saved pick', () => {
    expect(toSignatureLinkChoices(saved).map(({ label, picked }) => ({ label, picked }))).toEqual([
      { label: 'Instagram', picked: true },
      { label: 'Behance', picked: false },
    ]);
  });

  it('identifies a row by its id once the global is saved', () => {
    expect(toSignatureLinkChoices(saved).map((choice) => choice.key)).toEqual(['a1', 'b2']);
  });

  it('identifies a row by its URL while the global has never been saved', () => {
    expect(toSignatureLinkChoices(neverSaved).map((choice) => choice.key)).toEqual([
      'https://instagram.test',
      'https://behance.test',
    ]);
  });

  it('offers nothing when the global has no links', () => {
    expect(toSignatureLinkChoices({ id: 1, links: null })).toEqual([]);
  });
});

describe('withSignaturePick', () => {
  it('picks exactly the given rows and leaves labels and URLs untouched', () => {
    const rows = withSignaturePick(saved, ['b2']);

    expect(pickedLabels(rows)).toEqual(['Behance']);
    expect(rows.map(({ id, label, href }) => ({ id, label, href }))).toEqual(
      links.map(({ id, label, href }) => ({ id, label, href })),
    );
  });

  it('unpicks every row when nothing is picked', () => {
    expect(pickedLabels(withSignaturePick(saved, []))).toEqual([]);
  });

  it('still matches URL keys from a page loaded before the first save', () => {
    expect(pickedLabels(withSignaturePick(saved, ['https://behance.test']))).toEqual(['Behance']);
  });
});
