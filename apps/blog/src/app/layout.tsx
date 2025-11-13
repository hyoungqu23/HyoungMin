import type { Metadata } from 'next';
import '../root/globals.css';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Blog built with Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <body>{children}</body>
    </html>
  );
}

