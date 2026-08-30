import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Serif, Fragment_Mono } from "next/font/google";
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
    default: "CodeKinetix® — Freelance Web Studio | Websites, E-Commerce & Web Apps",
    template: "%s — CodeKinetix",
  },
  description:
    "CodeKinetix is an independent freelance web studio. We design and build websites, e-commerce and web applications — projects that live inside the site itself, ready to be used, not just seen.",
  keywords: [
    "CodeKinetix",
    "freelance web developer",
    "web studio",
    "web design",
    "web development",
    "e-commerce development",
    "web application development",
    "Next.js developer",
    "GSAP animation",
    "interactive websites",
  ],
  authors: [{ name: "CodeKinetix Studio" }],
  creator: "CodeKinetix Studio",
  publisher: "CodeKinetix Studio",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CodeKinetix® — Freelance Web Studio",
    description:
      "Independent freelance web studio — design, code and motion. Websites, e-commerce and web applications that hit different.",
    url: SITE_URL,
    siteName: "CodeKinetix",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "CodeKinetix — freelance web studio. CODE over KINETIX wordmark with volt-blue X",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeKinetix® — Freelance Web Studio",
    description:
      "Websites, e-commerce and web applications — design, code and motion. One developer, agency mindset.",
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
      email: "hello@codekinetix.dev",
      description:
        "Independent freelance web studio building websites, e-commerce and web applications with design, code and motion.",
      foundingDate: "2021",
      areaServed: "Worldwide",
      jobTitle: "Freelance Web Developer",
      knowsAbout: [
        "Web design",
        "Web development",
        "Next.js",
        "TypeScript",
        "GSAP",
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
        {children}
      </body>
    </html>
  );
}
