import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Nav } from "@/components/Nav";
import "./globals.css";

const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
  title: "ROSTR Platform",
  description: "Autonomous agent platform powered by ROSTR",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-[100dvh] antialiased">
        <Nav />
        <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
          {children}
        </main>
      </body>
    </html>
  );
}
