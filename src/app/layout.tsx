import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://warindex.io"),
  title: "War Index — The Cost of Conflict",
  description:
    "Visualize how global conflicts reshape markets. Track geopolitical tensions and their economic impact on companies and economies in real-time.",
  keywords: [
    "war index",
    "geopolitics",
    "finance",
    "conflict",
    "markets",
    "economy",
    "defense stocks",
    "oil prices",
  ],
  authors: [{ name: "War Index" }],
  openGraph: {
    title: "War Index — The Cost of Conflict",
    description:
      "Visualize how global conflicts reshape markets and move capital.",
    url: "https://warindex.io",
    siteName: "War Index",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "War Index - Visualizing the cost of conflict",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "War Index — The Cost of Conflict",
    description:
      "Visualize how global conflicts reshape markets and move capital.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <script
          src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          crossOrigin=""
        />
      </head>
      <body
        className={`${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
