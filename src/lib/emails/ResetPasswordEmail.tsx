import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  render,
  Section,
  Text,
} from 'react-email';

import { CMS_NAME } from '@lib/admin/constants';
import { SITE_URL } from '@lib/seo/constants';

import type { CSSProperties } from 'react';

type Props = {
  email: string;
  resetURL: string;
};

// Mail apps only keep inline styles: React Email turns these into `style` attributes. Web fonts
// are dropped by most of them, so Geist (the site's font) only shows where it is installed.
// The logo and footer link point at production, like the email signature, so they resolve from
// any environment.
const sans = "Geist,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const mono = "'Geist Mono',SFMono-Regular,Menlo,Consolas,monospace";

const ink = '#0a0a0a';
const muted = '#71717a';
const line = '#e4e4e7';

const styles = {
  body: { backgroundColor: '#fafafa', fontFamily: sans, margin: 0, padding: '48px 12px' },
  container: { maxWidth: '520px', margin: '0 auto' },
  card: {
    backgroundColor: '#ffffff',
    border: `1px solid ${line}`,
    borderRadius: '16px',
    padding: '40px',
  },
  eyebrow: {
    color: muted,
    fontFamily: mono,
    fontSize: '11px',
    letterSpacing: '0.08em',
    lineHeight: '16px',
    margin: '28px 0 8px',
    textTransform: 'uppercase',
  },
  heading: {
    color: ink,
    fontSize: '26px',
    fontWeight: 600,
    letterSpacing: '-0.02em',
    lineHeight: '32px',
    margin: '0 0 16px',
  },
  text: { color: '#3f3f46', fontSize: '15px', lineHeight: '24px', margin: '0 0 28px' },
  strong: { color: ink, fontWeight: 600 },
  button: {
    backgroundColor: ink,
    borderRadius: '10px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: '20px',
    padding: '12px 20px',
  },
  panel: {
    backgroundColor: '#f4f4f5',
    borderRadius: '10px',
    margin: '32px 0 0',
    padding: '16px',
  },
  panelLabel: { color: muted, fontSize: '12px', lineHeight: '18px', margin: '0 0 6px' },
  panelLink: {
    color: ink,
    fontFamily: mono,
    fontSize: '12px',
    lineHeight: '18px',
    textDecoration: 'none',
    wordBreak: 'break-all',
  },
  hr: { borderColor: line, margin: '32px 0 20px' },
  note: { color: muted, fontSize: '13px', lineHeight: '20px', margin: 0 },
  footer: { padding: '28px 0 0', textAlign: 'center' },
  footerText: { color: '#a1a1aa', fontSize: '12px', lineHeight: '18px', margin: '0 0 4px' },
  footerLink: { color: muted, textDecoration: 'underline' },
} satisfies Record<string, CSSProperties>;

export const ResetPasswordEmail = ({ email, resetURL }: Props) => (
  <Html lang="en">
    <Head>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      {/* Light only: keeps Apple Mail and Outlook from inverting the black logo and button */}
      <meta content="light" name="color-scheme" />
      <meta content="light" name="supported-color-schemes" />
    </Head>
    <Preview>Use this link within the hour to choose a new password.</Preview>
    <Body style={styles.body}>
      <Container style={styles.container}>
        <Section style={styles.card}>
          <Link href={SITE_URL}>
            <Img
              alt="99stud"
              height={36}
              src={`${SITE_URL}/brand/99stud-sticker-logo.png`}
              width={40}
            />
          </Link>
          <Text style={styles.eyebrow}>{CMS_NAME}</Text>
          <Heading style={styles.heading}>Reset your password</Heading>
          {/* An hour is the default `forgotPassword.expiration` of the users collection */}
          <Text style={styles.text}>
            We received a request to reset the password for{' '}
            <span style={styles.strong}>{email}</span>. Choose a new one within the next hour.
          </Text>
          <Button href={resetURL} style={styles.button}>
            Reset password →
          </Button>
          <Section style={styles.panel}>
            <Text style={styles.panelLabel}>Or copy this link into your browser</Text>
            <Link href={resetURL} style={styles.panelLink}>
              {resetURL}
            </Link>
          </Section>
          <Hr style={styles.hr} />
          <Text style={styles.note}>
            Didn’t ask for this? You can safely ignore this email: your password won’t change.
          </Text>
        </Section>
        <Section style={styles.footer}>
          <Text style={styles.footerText}>99stud · Independent Creative Collective</Text>
          <Text style={styles.footerText}>
            Paris · Lyon · Milan ·{' '}
            <Link href={SITE_URL} style={styles.footerLink}>
              99stud.com
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export const renderResetPasswordEmail = (props: Props) => render(<ResetPasswordEmail {...props} />);
