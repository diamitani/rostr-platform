import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

export const metadata: Metadata = {
  title: 'ROSTR — Deploy the Billion-Dollar Agent OS',
  description:
    'One-click deploy for the ROSTR agent operating system. PAL compiler, RAG DAL knowledge engine, NPAO orchestrator, Rostr Hub. Enterprise-grade multi-agent infrastructure.',
  openGraph: {
    title: 'ROSTR — Deploy the Billion-Dollar Agent OS',
    description: 'One-click deploy for the ROSTR agent operating system.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} dark`}>
      <body className="font-sans bg-mesh grain-overlay min-h-[100dvh]">{children}</body>
    </html>
  );
}
