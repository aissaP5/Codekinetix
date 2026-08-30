import type { Metadata } from "next";
import { Bangers, Comic_Neue } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { CartDrawer } from "@/components/comic/cart";
import { BackToTop, ScrollProgress } from "@/components/comic/chrome";

const bangers = Bangers({
  variable: "--font-bangers",
  subsets: ["latin"],
  weight: "400",
});

const comicNeue = Comic_Neue({
  variable: "--font-comic",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Pizza-Man! — The Super Hero of Pizza",
  description:
    "Welcome to Pizza-Man!, the comic-book pizzeria: hand-stretched dough, thunderstruck toppings and lightning delivery in 20 minutes. Order your hero pizza now — free delivery over €25!",
  keywords: ["pizza", "pizzeria", "Pizza-Man", "comic", "delivery", "Paris", "cartoon", "super hero"],
  authors: [{ name: "Pizza-Man!" }],
  openGraph: {
    title: "Pizza-Man! — The Super Hero of Pizza",
    description:
      "Hand-stretched dough, thunderstruck toppings, delivery faster than a speeding bullet. Free delivery over €25.",
    siteName: "Pizza-Man!",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Pizza-Man! — comic superhero pizza slice soaring over a red sunburst, Restaurant & Delivery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pizza-Man! — The Super Hero of Pizza",
    description: "Hand-stretched dough, heroic toppings, delivery in 20 minutes flat.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${bangers.variable} ${comicNeue.variable} antialiased bg-paper text-ink`}>
        <ScrollProgress />
        {children}
        <BackToTop />
        <CartDrawer />
        <Toaster />
      </body>
    </html>
  );
}
