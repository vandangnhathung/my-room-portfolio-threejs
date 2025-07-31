// For Next.js App Router, add to your layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { RoomQueryProvider } from '@/components/providers/query-provider';

export const metadata: Metadata = {
  title: 'Van Dang Nhat Hung - Portfolio',
  description: 'Interactive 3D portfolio showcasing my work and projects',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload critical resources for faster loading */}
        <link rel="preload" href="/models/Room_Portfolio.glb" as="fetch" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://vandangnhathung.github.io" />
        <link rel="dns-prefetch" href="https://vandangnhathung.github.io" />
        <link rel="preload" href="https://vandangnhathung.github.io/lofi-ver-2/" as="document" />
      </head>
      <body suppressHydrationWarning id='root' className="mdl-js">
        <RoomQueryProvider>
          {children}
        </RoomQueryProvider>
      </body>
    </html>
  );
}