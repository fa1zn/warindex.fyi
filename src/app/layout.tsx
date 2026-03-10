import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://warindex.fyi"),
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
    url: "https://warindex.fyi",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
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
        className={`${GeistSans.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
