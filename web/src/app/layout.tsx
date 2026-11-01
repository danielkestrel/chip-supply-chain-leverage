import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

export const metadata: Metadata = {
  title: 'Conditions, Not Cutoffs',
  description: 'Chip-Supply-Chain Leverage for AI Safety',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-app-bg text-body-primary font-sans antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}

