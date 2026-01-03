import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  metadataBase: new URL('https://openskills.space'),
  title: "Agent Skills - Find Skills for Your Next Project",
  description: "Discover and download agent skills for Claude, featuring capabilities from Anthropic, Notion, Composio, and the community. Fast, powerful, and smart AI agent skills.",
  keywords: ['AI agents', 'Claude', 'skills', 'AI capabilities', 'Anthropic', 'automation', 'agent skills'],
  authors: [{ name: 'Onurkan Bakirci', url: 'https://github.com/onurkanbakirci' }],
  creator: 'Onurkan Bakirci',
  publisher: 'Agent Skills',
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
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon.png', sizes: '96x96', type: 'image/png' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://openskills.space',
    siteName: 'Agent Skills',
    title: "Agent Skills - Find Skills for Your Next Project",
    description: "Discover and download agent skills for Claude, featuring capabilities from Anthropic, Notion, Composio, and the community. Fast, powerful, and smart AI agent skills.",
    images: [
      {
        url: 'https://openskills.space/og_card.png',
        secureUrl: 'https://openskills.space/og_card.png',
        width: 1200,
        height: 630,
        alt: 'Agent Skills - Find a skill for your AI agent',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@openskills',
    creator: '@onurkanbakirci',
    title: "Agent Skills - Find Skills for Your Next Project",
    description: "Discover and download agent skills for Claude, featuring capabilities from Anthropic, Notion, Composio, and the community. Fast, powerful, and smart AI agent skills.",
    images: {
      url: 'https://openskills.space/og_card.png',
      alt: 'Agent Skills - Find a skill for your AI agent',
    },
  },
  alternates: {
    canonical: 'https://openskills.space',
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
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JTYZYNYLVR"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JTYZYNYLVR');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
