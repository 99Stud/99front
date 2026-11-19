'use client';

import {
  Button,
  CheckboxInput,
  Collapsible,
  Link,
  TextInput,
  toast,
  useConfig,
} from '@payloadcms/ui';
import clsx from 'clsx';
import { formatAdminURL } from 'payload/shared';
import { ChangeEvent, FC, MouseEvent, useRef, useState } from 'react';

import { saveSignatureLinks } from '@lib/pages/Signature/saveSignatureLinks';
import {
  SIGNATURE_PLACEHOLDER_NAME,
  signatureHtml,
  signatureText,
} from '@lib/pages/Signature/signature';
import type { SignatureLinkChoice } from '@lib/pages/Signature/signatureLinks';

import styles from './SignatureTool.module.scss';

const INSTALL_STEPS = [
  {
    app: 'Gmail',
    steps: 'Settings → See all settings → General → Signature → Create new, then paste.',
  },
  {
    app: 'Apple Mail',
    steps:
      'Settings → Signatures → select the account, click +, untick “Always match my default message font”, then paste. Make sure the signature is under your account (drag it onto the account in the left column if it isn’t), then pick it in “Choose Signature”. The Settings preview often shows an empty box where the logo goes; compose a new email to check the logo.',
  },
  {
    app: 'Outlook',
    steps: 'Settings → Account → Signatures → New signature, then paste.',
  },
];

// Fixed colors on purpose: the cards mimic a mail app's message view, whatever the admin theme.
const PREVIEWS = [
  { label: 'Light mode', className: styles.previewLight },
  { label: 'Dark mode', className: styles.previewDark },
];

type Props = {
  // Every link of the "Social Links" global, with the pick currently saved for the team
  initialLinks: SignatureLinkChoice[];
};

export const SignatureTool: FC<Props> = ({ initialLinks }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [links, setLinks] = useState(initialLinks);
  const [hasUnsavedPick, setHasUnsavedPick] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const { config } = useConfig();
  const socialLinksUrl = formatAdminURL({
    adminRoute: config.routes.admin,
    path: '/globals/social-links',
  });

  const typedName = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ');
  const name = typedName || SIGNATURE_PLACEHOLDER_NAME;
  // The previews and the copied signature follow the ticks, saved or not
  const pickedLinks = links.filter((link) => link.picked);
  const html = signatureHtml(name, pickedLinks);

  const togglePick = (key: string) => {
    setLinks((current) =>
      current.map((link) => (link.key === key ? { ...link, picked: !link.picked } : link)),
    );
    setHasUnsavedPick(true);
  };

  const savePick = async () => {
    setIsSaving(true);
    try {
      // The saved rows come back with their definitive keys (see `signatureLinks.ts`)
      setLinks(await saveSignatureLinks(pickedLinks.map((link) => link.key)));
      setHasUnsavedPick(false);
      toast.success('Links saved for the whole team.');
    } catch {
      toast.error('Couldn’t save the links. Reload the page and try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const copySelection = () => {
    if (!previewRef.current) return false;
    const range = document.createRange();
    range.selectNodeContents(previewRef.current);
    const selection = getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    const copied = document.execCommand('copy');
    selection?.removeAllRanges();
    return copied;
  };

  const copySignature = async () => {
    let copied = true;
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([signatureText(name, pickedLinks)], { type: 'text/plain' }),
        }),
      ]);
    } catch {
      copied = copySelection();
    }
    if (copied) toast.success('Copied. Paste it into your mail app’s signature editor.');
    else {
      toast.error('Couldn’t copy. Select the signature in the light preview and press Cmd/Ctrl+C.');
    }
  };

  const copyHtml = async () => {
    try {
      await navigator.clipboard.writeText(html);
      toast.success('HTML source copied.');
    } catch {
      toast.error('Couldn’t copy the HTML source: the browser blocked clipboard access.');
    }
  };

  // The previews are for looking, not navigating: following a link would lose the typed name
  const ignoreLinkClick = (event: MouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest('a')) event.preventDefault();
  };

  return (
    <div className={styles.tool}>
      <h1>Email signature</h1>
      <p className={styles.intro}>Type your name, copy, paste into your mail app.</p>

      <div className={styles.fields}>
        <TextInput
          htmlAttributes={{ autoComplete: 'given-name' }}
          label="First name"
          onChange={(event: ChangeEvent<HTMLInputElement>) => setFirstName(event.target.value)}
          path="firstName"
          placeholder="Firstname"
          value={firstName}
        />
        <TextInput
          htmlAttributes={{ autoComplete: 'family-name' }}
          label="Last name"
          onChange={(event: ChangeEvent<HTMLInputElement>) => setLastName(event.target.value)}
          path="lastName"
          placeholder="Lastname"
          value={lastName}
        />
      </div>

      <h3 className={styles.heading}>Preview</h3>
      <div className={styles.previews}>
        {PREVIEWS.map((preview, index) => (
          <figure
            // The second card repeats the first: keep it out of the accessibility tree
            aria-hidden={index > 0 || undefined}
            className={clsx(styles.preview, preview.className)}
            key={preview.label}
            onClick={ignoreLinkClick}
          >
            <figcaption className={styles.previewLabel}>{preview.label}</figcaption>
            <div dangerouslySetInnerHTML={{ __html: html }} ref={index === 0 ? previewRef : null} />
          </figure>
        ))}
      </div>

      <div className={styles.actions}>
        <Button disabled={!typedName} margin={false} onClick={copySignature}>
          Copy signature
        </Button>
        <Button buttonStyle="secondary" disabled={!typedName} margin={false} onClick={copyHtml}>
          Copy HTML
        </Button>
        {!typedName && <span className={styles.hint}>Type your name first.</span>}
      </div>

      <h3 className={styles.heading}>Install</h3>
      <ol className={styles.steps}>
        {INSTALL_STEPS.map((install) => (
          <li key={install.app}>
            <strong>{install.app}</strong>: {install.steps}
          </li>
        ))}
      </ol>

      <Collapsible className={styles.linkPick} header="Links in the signature" initCollapsed>
        <div className={styles.linkPickBody}>
          <p className={styles.hint}>
            Tick the social links shown after 99stud.com: the previews above follow. Saving makes
            the pick the default for everyone, the next time they copy. Signatures already installed
            don’t change. Labels, URLs and order are edited in{' '}
            <Link href={socialLinksUrl}>Social Links</Link>.
          </p>
          {links.length > 0 ? (
            <>
              <div className={styles.links}>
                {links.map((link, index) => (
                  <CheckboxInput
                    checked={link.picked}
                    id={`signature-link-${index}`}
                    key={link.key}
                    label={link.label}
                    onToggle={() => togglePick(link.key)}
                    readOnly={isSaving}
                  />
                ))}
              </div>
              <div className={styles.actions}>
                <Button
                  buttonStyle="secondary"
                  disabled={!hasUnsavedPick || isSaving}
                  margin={false}
                  onClick={savePick}
                >
                  {isSaving ? 'Saving…' : 'Save links for the team'}
                </Button>
              </div>
            </>
          ) : (
            <p className={styles.hint}>There are no social links yet.</p>
          )}
        </div>
      </Collapsible>
    </div>
  );
};
