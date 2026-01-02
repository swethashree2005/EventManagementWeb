import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/ui/Navbar";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"]
});

export const metadata: Metadata = {
  title: {
    template: "%s | EventHub Pro - Enterprise Event Platform",
    default: "EventHub Pro - Professional Event Management System"
  },
  description: "Create, manage, and scale events professionally. Enterprise-grade tools for organizers - real-time analytics, attendee management, ticketing, and seamless integrations.",
  keywords: [
    "event management", "event platform", "RSVP system", 
    "professional events", "conference management", "ticketing"
  ],
  authors: [{ name: "EventHub Team" }],
  creator: "EventHub Pro",
  publisher: "EventHub Pro",
  openGraph: {
    title: "EventHub Pro - Enterprise Event Platform",
    description: "Professional event management for organizers of all sizes. Complete lifecycle management with analytics and integrations.",
    url: "https://your-event-platform.com",
    siteName: "EventHub Pro",
    images: [
      {
        url: "https://your-event-platform.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "EventHub Pro - Professional Event Management"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "EventHub Pro - Enterprise Event Platform",
    description: "Scale your events with professional management tools.",
    images: ["https://your-event-platform.com/twitter-og.jpg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  verification: {
    google: "your-google-verification",
    yandex: "your-yandex-verification"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-inter bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-white antialiased`}>
        <Navbar />
        <main className="pt-0 lg:pt-4">{children}</main>
      </body>
    </html>
  );
}
