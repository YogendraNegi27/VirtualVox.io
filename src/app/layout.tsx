import type { Metadata, Viewport } from 'next';
import { DM_Sans, Manrope } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#7c3aed',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://virtualvox.ai'),
  title: 'VIRTUALVOX — Every conversation, a possibility.',
  description: 'Explore VIRTUALVOX voice and text agents. Natural conversations, thoughtful automation, and a better customer experience.',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  icons: { icon: '/images/virtualvox-brand.png', apple: '/images/virtualvox-brand.png' },
  openGraph: {
    title: 'VIRTUALVOX — Every conversation, a possibility.',
    description: 'Explore VIRTUALVOX voice and text agents. Natural conversations, thoughtful automation, and a better customer experience.',
    url: 'https://virtualvox.ai',
    siteName: 'VIRTUALVOX',
    images: [{ url: '/images/virtualvox-brand.png', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VIRTUALVOX — Every conversation, a possibility.',
    description: 'Explore VIRTUALVOX voice and text agents. Natural conversations, thoughtful automation, and a better customer experience.',
    images: ['/images/virtualvox-brand.png'],
  },
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${manrope.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

