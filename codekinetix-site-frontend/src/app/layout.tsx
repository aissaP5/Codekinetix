import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Serif, Fragment_Mono } from "next/font/google";
import PortfolioShell from "@/components/portfolio/PortfolioShell";
import "./globals.css";
// R33 — the shadcn <Toaster /> was removed from here: nothing on the
// site ever raises a toast (zero useToast callers), but it dragged
// the radix toast stack into the initial chunk on every refresh.

const archivo = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["wdth"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const fragmentMono = Fragment_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400"],
});

const SITE_URL = "https://codekinetix.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CodeKinetix® — Digital Experience Studio | Design × Code × Motion",
    template: "%s — CodeKinetix",
  },
  description:
    "CodeKinetix is an independent digital experience studio. We build digital experiences people remember—websites, bespoke e-commerce, and custom web applications with design, code, and motion.",
  keywords: [
    "CodeKinetix",
    "digital experience studio",
    "creative web studio",
    "web design",
    "web development",
    "Next.js developer",
    "GSAP animation",
    "WebGL developer",
    "e-commerce development",
    "interactive websites",
    "web development Algeria",
    "web development Oran",
  ],
  authors: [{ name: "CodeKinetix Studio" }],
  creator: "CodeKinetix Studio",
  publisher: "CodeKinetix Studio",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CodeKinetix® — Digital Experience Studio",
    description:
      "We build digital experiences people remember. Independent studio specializing in high-performance websites, bespoke e-commerce, and custom web applications.",
    url: SITE_URL,
    siteName: "CodeKinetix",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "CodeKinetix® — Digital Experience Studio. WE BUILD DIGITAL EXPERIENCES PEOPLE REMEMBER.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeKinetix® — Digital Experience Studio",
    description:
      "We build digital experiences people remember. Design × Code × Motion.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#org`,
      name: "CodeKinetix",
      url: SITE_URL,
      email: "codekinetixstudio@gmail.com",
      description:
        "Independent digital experience studio building websites, e-commerce, and web applications with design, code, and motion.",
      foundingDate: "2021",
      areaServed: "Worldwide",
      jobTitle: "Digital Experience Studio",
      knowsAbout: [
        "Digital Experience Design",
        "Web development",
        "Next.js",
        "TypeScript",
        "GSAP",
        "WebGL",
        "E-commerce",
        "Web applications",
      ],
      sameAs: [
        "https://www.instagram.com/codekinetix/",
        "https://www.facebook.com/codekinetix/",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "CodeKinetix",
      publisher: { "@id": `${SITE_URL}/#org` },
      inLanguage: "en",
    },
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#0A0A0B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${archivo.variable} ${instrumentSerif.variable} ${fragmentMono.variable} antialiased bg-background text-foreground`}
      >
        {/* R34 — the CK monogram sits on the critical entrance path twice
            (the boot page <img> AND the particle sampler's Image()). React
            hoists this to <head> so the fetch races the scripts instead of
            waiting for hydration — the entrance never serializes behind a
            late logo decode. */}
        <link rel="preload" href="/ck-logo.webp" as="image" fetchPriority="high" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <PortfolioShell>{children}</PortfolioShell>
      </body>
    </html>
  );
}
