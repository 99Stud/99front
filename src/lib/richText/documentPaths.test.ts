import { describe, expect, it } from 'vitest';

import {
  DOCUMENT_PATHS,
  isLinkableCollection,
  LINKABLE_COLLECTIONS,
} from '@lib/richText/documentPaths';

describe('DOCUMENT_PATHS', () => {
  it('serves a policy at the root of the site, under its slug', () => {
    expect(DOCUMENT_PATHS.policies('legal-notice')).toBe('/legal-notice');
  });
});

describe('isLinkableCollection', () => {
  it('lets the editor link to every collection that has a public route', () => {
    expect(LINKABLE_COLLECTIONS.every(isLinkableCollection)).toBe(true);
    expect(LINKABLE_COLLECTIONS).toContain('policies');
  });

  it('refuses collections that have no public page', () => {
    expect(isLinkableCollection('users')).toBe(false);
    expect(isLinkableCollection('media')).toBe(false);
  });
});
