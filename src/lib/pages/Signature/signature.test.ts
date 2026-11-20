import { describe, expect, it } from 'vitest';

import { signatureHtml, signatureText } from '@lib/pages/Signature/signature';

const instagram = { label: 'Instagram', href: 'https://www.instagram.com/99stud/' };
const linkedIn = { label: 'LinkedIn', href: 'https://www.linkedin.com/company/99stud/' };

const hrefs = (html: string) =>
  [...html.matchAll(/<a href="([^"]*)" style="color/g)].map((m) => m[1]);

describe('signatureHtml', () => {
  it('lists 99stud.com first, then the signature links in the order given', () => {
    expect(hrefs(signatureHtml('Ada Lovelace', [linkedIn, instagram]))).toEqual([
      'https://99stud.com',
      linkedIn.href,
      instagram.href,
    ]);
  });

  it('keeps the site link when no signature link is picked', () => {
    expect(hrefs(signatureHtml('Ada Lovelace', []))).toEqual(['https://99stud.com']);
  });

  it('renders a name containing markup as text', () => {
    const html = signatureHtml(`<b>Ada</b> & "Co"`, []);

    expect(html).toContain('&lt;b&gt;Ada&lt;/b&gt; &amp; &quot;Co&quot;');
    expect(html).not.toContain('<b>Ada</b>');
  });

  it('escapes a link label and URL', () => {
    const html = signatureHtml('Ada', [
      { label: '<i>x</i>', href: 'https://a.test/?q="><script>' },
    ]);

    expect(html).toContain('&lt;i&gt;x&lt;/i&gt;');
    expect(html).not.toContain('<script>');
  });
});

describe('signatureText', () => {
  it('puts the name on the first line and the link URLs on the last', () => {
    const lines = signatureText('Ada Lovelace', [instagram]).split('\n');

    expect(lines[0]).toBe('Ada Lovelace');
    expect(lines.at(-1)).toBe(`https://99stud.com · ${instagram.href}`);
  });
});
