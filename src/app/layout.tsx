import type { Metadata } from "next";
import { Geist, Barlow_Condensed } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";

const geistSans = Geist({
  variable: "--font-sans-fallback",
  subsets: ["latin"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-heading-fallback",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://apexfitness.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Apex Fitness | Train Today. Grow Tomorrow.",
    template: "%s | Apex Fitness",
  },
  description:
    "Experience premium equipment, certified personal coaches, high-energy group workouts, and official functional training at Apex Fitness.",
  keywords: [
    "gym",
    "fitness club",
    "personal training",
    "group classes",
    "hyrox",
    "strength and conditioning",
    "weight training",
  ],
  authors: [{ name: "Apex Fitness" }],
  creator: "Apex Fitness",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Apex Fitness | Train Today. Grow Tomorrow.",
    description:
      "Experience premium equipment, expert coaching, and a vibrant community dedicated to taking your athletic potential to the next level.",
    siteName: "Apex Fitness",
    images: [
      {
        url: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Apex Fitness Club Training Ground",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Apex Fitness | Train Today. Grow Tomorrow.",
    description:
      "Experience premium equipment, expert coaching, and a vibrant community dedicated to taking your athletic potential to the next level.",
    images: [
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&h=630&q=80",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HealthClub",
    name: "Apex Fitness",
    image:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&h=630&q=80",
    url: siteUrl,
    telephone: "+1-555-234-5678",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "100 Athletic Way, Suite 400",
      addressLocality: "Fitness Center",
      addressRegion: "State",
      postalCode: "10001",
      addressCountry: "US",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "06:00",
        closes: "23:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday"],
        opens: "08:00",
        closes: "18:00",
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${barlowCondensed.variable} antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
