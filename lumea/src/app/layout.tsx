import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LUMÉA — Maison de Skincare",
  description:
    "Cold-pressed botanical skincare, composed in small batches in Grasse, France. The quiet art of radiance.",
  keywords: ["LUMÉA", "skincare", "luxury skincare", "botanical skincare", "serum", "Grasse"],
  authors: [{ name: "LUMÉA" }],
  icons: {
    icon: "/mark.svg",
  },
  openGraph: {
    title: "LUMÉA — Maison de Skincare",
    description: "Cold-pressed botanical skincare. The quiet art of radiance.",
    siteName: "LUMÉA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${manrope.variable} antialiased bg-cream text-cocoa`}
      >
        {children}
      </body>
    </html>
  );
}
