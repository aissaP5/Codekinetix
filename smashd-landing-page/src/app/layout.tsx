import type { Metadata } from "next";
import { Anton, Space_Grotesk } from "next/font/google";
import "./globals.css";

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SMASH'D — Anatomy of Flavor",
  description:
    "The burger that breaks the rules. Flame-grilled angus, destroyed to perfection. Scroll through the anatomy of flavor.",
  keywords: ["burger", "smash burger", "gourmet", "GSAP", "award winning"],
  openGraph: {
    title: "SMASH'D — Anatomy of Flavor",
    description: "The burger that breaks the rules. Scroll through the anatomy of flavor.",
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
        className={`${anton.variable} ${grotesk.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
