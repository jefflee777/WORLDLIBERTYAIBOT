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
  title: "Tradon | AI Trading Creature – $TRDN",
  description: "Tradon ($TRDN) is a self-evolving AI trading creature that learns from you. Train it with your strategies, analyze market data, and get personalized crypto token recommendations in real-time.",
  keywords: "Tradon, TRDN, AI trading, crypto trading bot, cryptocurrency analysis, self-evolving AI, trading strategies, DeFi, Bitcoin, Ethereum, token recommendations, AI creature, blockchain assistant",
  authors: [{ name: "Tradon" }],
  creator: "Tradon AI",
  publisher: "Tradon Labs",
  robots: "index, follow",
  openGraph: {
    title: "Tradon | Self-Evolving AI Trading Creature – $TRDN",
    description: "Train your own AI trading creature with Tradon ($TRDN). Personalized strategies, market analysis, and real-time token insights powered by AI.",
    url: "https://tradon.vercel.app/",
    siteName: "Tradon – $TRDN",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "Tradon | AI Trading Creature – $TRDN",
    description: "A self-evolving AI trading creature that learns your strategy. Discover tokens, analyze markets, and trade smarter with Tradon.",
    creator: "@Tradon_AI"
  },
  viewport: "width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover",
  category: "cryptocurrency",
  classification: "AI Trading Assistant, Cryptocurrency, Blockchain, DeFi",
  other: {
    "application-name": "Tradon AI",
    "mobile-web-app-capable": "yes",
    "mobile-web-app-status-bar-style": "black-translucent",
    "format-detection": "telephone=no"
  }
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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[#1a1a2e] flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
