import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import Nav from '@/components/nav';

export const metadata: Metadata = {
  title: 'ROSTR — Billion-Dollar Agent Operating System',
  description:
    'Enterprise-grade agent orchestration, knowledge management, and skill marketplace dashboard. PAL, RAG DAL, NPAO, Rostr Hub.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} dark`}>
      <body className="font-sans bg-mesh grain-overlay min-h-[100dvh]">
        <Nav />
        <main className="max-w-7xl mx-auto px-4 md:px-8 pt-20 pb-24">
          {children}
        </main>
        <footer className="border-t border-white/[0.04] py-8 text-center text-[10px] text-white/15 font-mono-data tracking-[0.1em]">
          ROSTR v2.0 · Patrick Diamitani · July 2026 · MIT License · The Billion-Dollar Agent OS
        </footer>
      </body>
    </html>
  );
}
