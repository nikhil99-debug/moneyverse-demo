import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MoneyMania — Money Talks. Finally.',
  description:
    'A gamified financial literacy universe. Pick a character, learn through cinematic interactive chapters, earn XP, and go from financially clueless to financially dangerous.',
  keywords: ['financial literacy', 'money', 'investing', 'Gen-Z', 'gamified learning'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white">
        <ClerkProvider
          appearance={{
            baseTheme: dark,
            variables: {
              colorPrimary: '#f5a623',
              colorBackground: '#0a0a0a',
              colorText: '#ededed',
            },
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
