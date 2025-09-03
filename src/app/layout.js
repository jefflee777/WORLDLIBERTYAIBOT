import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "World Liberty AI | AI-Powered Financial Intelligence – $WLFI",
  description:
    "World Liberty AI ($WLFI) is an AI-powered financial intelligence platform that analyzes top crypto coins in real-time. Get market trend insights, whale activity tracking, and AI-generated summaries directly in our Telegram Mini App.",
  keywords:
    "World Liberty AI, WLFI, AI crypto analysis, blockchain insights, whale tracking, market trends, cryptocurrency AI, DeFi analytics, Bitcoin, Ethereum, CoinAPI integration, crypto assistant, Telegram Mini App",
  authors: [{ name: "World Liberty AI" }],
  creator: "World Liberty AI Team",
  publisher: "World Liberty AI Labs",
  robots: "index, follow",
  openGraph: {
    title: "World Liberty AI | Real-Time Crypto Intelligence – $WLFI",
    description:
      "Discover World Liberty AI – the intelligent crypto assistant that analyzes top coins, detects whale moves, and generates AI-powered summaries. Accessible through our Telegram Mini App.",
    url: "https://worldliberty.ai/",
    siteName: "World Liberty AI – $WLFI",
    type: "website",
    images: [
      {
        url: "/og-image.png", //
        width: 1200,
        height: 630,
        alt: "World Liberty AI – AI-Powered Financial Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "World Liberty AI | AI-Powered Crypto Assistant – $WLFI",
    description:
      "Stay ahead of the markets with World Liberty AI. Real-time coin insights, whale alerts, and AI market summaries, all inside our Telegram Mini App.",
    creator: "@WorldLibertyAI",
    images: ["/og-image.png"],
  },
  viewport:
    "width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover",
  category: "cryptocurrency",
  classification: "AI Financial Intelligence, Cryptocurrency, Blockchain, DeFi",
  other: {
    "application-name": "World Liberty AI",
    "mobile-web-app-capable": "yes",
    "mobile-web-app-status-bar-style": "black-translucent",
    "format-detection": "telephone=no",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap"
          rel="stylesheet"
        />

        {/* ✅ Favicon / Tab Icons */}
        <link rel="icon" href="/logo.png" sizes="any" />
        <link rel="icon" href="/logo.png" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo.png" />

        {/* ✅ OG Meta Fallback (for crawlers that don’t parse Next.js metadata API) */}
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="twitter:image" content="/og-image.png" />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
