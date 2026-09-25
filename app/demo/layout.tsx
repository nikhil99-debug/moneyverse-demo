import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// The demo is a public, no-login marketing/pitch surface. It is deliberately
// isolated from the production app and must never be indexed by search engines.
const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || 'https://demo.outchase.in';
const OG_IMAGE = `${APP_URL}/demo-modules/og.png`;

export const metadata: Metadata = {
  title: 'MoneyVerse — Interactive Financial Literacy Demo | OutChase',
  description:
    'A live, no-signup demo of MoneyVerse by OutChase — gamified, cinematic financial-literacy chapters for Indian college students. Play Captain Interest and Inflare.',
  robots: { index: false, follow: false, nocache: true },
  metadataBase: new URL(APP_URL),
  alternates: { canonical: `${APP_URL}/demo` },
  openGraph: {
    title: 'MoneyVerse — Interactive Financial Literacy Demo',
    description:
      'Play a live sample of MoneyVerse by OutChase. Learn money through cinematic, interactive chapters. No signup — opens instantly.',
    url: `${APP_URL}/demo`,
    siteName: 'MoneyVerse by OutChase',
    type: 'website',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'MoneyVerse — interactive financial literacy demo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MoneyVerse — Interactive Financial Literacy Demo',
    description: 'Play a live sample of MoneyVerse by OutChase. No signup — opens instantly.',
    images: [OG_IMAGE],
  },
};

export default function DemoLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
