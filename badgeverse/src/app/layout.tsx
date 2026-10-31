import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/landing/Navbar';
import { MotionProvider } from '@/components/providers/MotionProvider';

export const metadata: Metadata = {
  title: 'BadgeVerse – ID card & keychain generator',
  description: 'Design custom character cards, membership badges, and collectible keychains in minutes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ colorScheme: 'light' }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Archivo+Black&family=Special+Elite&family=Caveat:wght@600&family=Pinyon+Script&family=Space+Mono:wght@400;700&family=Permanent+Marker&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <MotionProvider>
          <Navbar />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
