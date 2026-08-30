import type { Metadata } from "next";
import {
  Archivo,
  Archivo_Black,
  Space_Mono,
  Newsreader,
} from "next/font/google";
import "./globals.css";
import { Toaster as Sonner } from "@/components/ui/sonner";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo-black",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-spacemono",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MARFIL — Clinical Atlas of a Dental House · Serrano 47, Madrid",
  description:
    "A private dental house on Calle de Serrano 47, Madrid, catalogued as a clinical atlas: the tariff (our offers), the accreditation wall (our certificates) and the group register. Free first visit.",
  keywords: [
    "dental clinic Madrid",
    "dentist Salamanca district",
    "dental implants Madrid",
    "Invisalign Madrid",
    "porcelain veneers Madrid",
    "teeth whitening price",
    "MARFIL dental clinic",
    "English speaking dentist Madrid",
  ],
  openGraph: {
    title: "MARFIL — Clinical Atlas of a Dental House · Madrid",
    description:
      "Plate by plate: the tariff, the accreditation wall, the group register. Free first visit · Calle de Serrano 47, Madrid.",
    siteName: "MARFIL Dental Clinic",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${archivo.variable} ${archivoBlack.variable} ${spaceMono.variable} ${newsreader.variable}`}
    >
      <body className="antialiased">
        {children}
        <Sonner
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1b1b13",
              color: "#f2efe5",
              border: "1px solid rgba(194,67,29,0.6)",
              borderRadius: "0",
              fontFamily: "var(--font-spacemono), monospace",
              fontSize: "12px",
              letterSpacing: "0.02em",
            },
          }}
        />
      </body>
    </html>
  );
}
