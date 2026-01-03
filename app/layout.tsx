import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LLM Skills - Find Skills for Your Next Project",
  description: "Discover and download LLM skills for Claude, featuring capabilities from Anthropic, Notion, Composio, and the community. Fast, powerful, and smart AI agent skills.",
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    title: "LLM Skills - Find Skills for Your Next Project",
    description: "Discover and download LLM skills for Claude, featuring capabilities from Anthropic, Notion, Composio, and the community. Fast, powerful, and smart AI agent skills.",
    url: 'https://llmskills.com',
    siteName: 'LLM Skills',
    images: [
      {
        url: '/og_card.png',
        width: 1200,
        height: 630,
        alt: 'LLM Skills - Find a skill for your AI agent',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "LLM Skills - Find Skills for Your Next Project",
    description: "Discover and download LLM skills for Claude, featuring capabilities from Anthropic, Notion, Composio, and the community. Fast, powerful, and smart AI agent skills.",
    images: ['/og_card.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
