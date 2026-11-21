export const SIGNATURE_PLACEHOLDER_NAME = 'Firstname Lastname';

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!,
  );

export type SignatureLink = { label: string; href: string };

// Always first; the links picked in the "Social Links" global of the CMS follow
const SITE_LINK: SignatureLink = { label: '99stud.com', href: 'https://99stud.com' };

const LINK_SEPARATOR = '<span style="opacity:0.4;">&nbsp;&nbsp;·&nbsp;&nbsp;</span>';

const linkHtml = ({ label, href }: SignatureLink) =>
  `<a href="${escapeHtml(href)}" style="color:inherit;text-decoration:underline;white-space:nowrap;">${escapeHtml(label)}</a>`;

// Table layout + inline styles: mail apps strip <style>, classes, flexbox and SVG from signatures.
// The text has no color on purpose so it inherits the mail app's own color in light and dark mode,
// and the logo is an absolute URL so it still resolves once pasted into a mail app.
// `min-width` keeps the logo from being squashed where images are capped to their container's
// width (narrow screens), and `nowrap` keeps a link label on one line.
export const signatureHtml = (
  name: string,
  links: SignatureLink[],
) => `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
  <tr>
    <td style="padding:0 16px 0 0;vertical-align:middle;">
      <a href="https://99stud.com" style="text-decoration:none;"><img src="https://99stud.com/brand/99stud-sticker-logo.png" width="71" height="64" alt="99stud" style="display:block;width:71px;min-width:71px;height:64px;border:0;"></a>
    </td>
    <td style="vertical-align:top;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:17px;">
      <div style="font-size:16px;line-height:21px;font-weight:bold;">${escapeHtml(name)}</div>
      <div>99stud | Independent Creative Collective</div>
      <div style="padding-top:8px;max-width:340px;opacity:0.6;">Multidisciplinary collective based in Paris, Lyon and Milan. Blurring the lines between web, 3D and music.</div>
      <div style="padding-top:8px;">${[SITE_LINK, ...links].map(linkHtml).join(LINK_SEPARATOR)}</div>
    </td>
  </tr>
</table>`;

export const signatureText = (name: string, links: SignatureLink[]) =>
  [
    name,
    '99stud | Independent Creative Collective',
    'Multidisciplinary collective based in Paris, Lyon and Milan. Blurring the lines between web, 3D and music.',
    [SITE_LINK, ...links].map(({ href }) => href).join(' · '),
  ].join('\n');
