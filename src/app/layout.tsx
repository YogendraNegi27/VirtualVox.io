import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'VIRTUALVOX — Every conversation, a possibility.',
  description: 'Explore VIRTUALVOX voice and text agents. Natural conversations, thoughtful automation, and a better customer experience.',
  robots: { index: false, follow: false },
  icons: { icon: '/images/virtualvox-brand.png', apple: '/images/virtualvox-brand.png' },
};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><head><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/><link rel="preconnect" href="https://framerusercontent.com"/></head><body>{children}</body></html>;
}
