import { describe, expect, it } from 'vitest';

import { DEFAULT_SOCIAL_LINKS } from '@lib/pages/Home/constants';
import { homeLinks } from '@lib/pages/Home/homeLinks';

const labels = (links: ReturnType<typeof homeLinks>) => links.map((link) => link.label);

describe('homeLinks', () => {
  it('hides the links unticked for the home page and keeps the order of the rest', () => {
    expect(
      labels(
        homeLinks([
          { label: 'Instagram', href: 'https://instagram.test', showOnHome: true },
          { label: 'Behance', href: 'https://behance.test', showOnHome: false },
          { label: 'LinkedIn', href: 'https://linkedin.test', showOnHome: true },
        ]),
      ),
    ).toEqual(['Instagram', 'LinkedIn']);
  });

  it('shows a link with no saved choice, as the checkbox is on by default', () => {
    expect(
      labels(
        homeLinks([
          { label: 'Instagram', href: 'https://instagram.test', showOnHome: null },
          { label: 'Behance', href: 'https://behance.test' },
        ]),
      ),
    ).toEqual(['Instagram', 'Behance']);
  });

  it('shows every built-in default link', () => {
    expect(homeLinks(DEFAULT_SOCIAL_LINKS)).toHaveLength(DEFAULT_SOCIAL_LINKS.length);
  });
});
