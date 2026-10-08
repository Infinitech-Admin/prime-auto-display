import type { Metadata, Viewport } from "next";

import { Inter, Rajdhani } from "next/font/google";

import "./globals.css";

import { AuthProvider } from "@/context/auth-context";
import { CartProvider } from "@/context/cart-context";
import ChatWidget from "@/components/chat-widget";
import FloatingSocial from "@/components/floating-social";
import AnimatedSplash from "@/components/animated-splash";

// Squared, techy headings that match the "CAPITAL JEY" lettering on the logo
const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Capital Jey Car Trading | Cars for Sale",
    template: "%s | Capital Jey Car Trading",
  },

  description:
    "Discover quality vehicles for sale at Capital Jey Car Trading. Browse premium cars, explore detailed specifications, view photos and videos, and inquire about your next vehicle.",

  keywords: [
    "Capital Jey Car Trading",
    "cars for sale",
    "used cars",
    "pre-owned cars",
    "car dealership",
    "car trading",
    "vehicles for sale",
    "automotive",
    "premium cars",
  ],

  authors: [{ name: "Capital Jey Car Trading" }],
  creator: "Capital Jey Car Trading",
  publisher: "Capital Jey Car Trading",

  robots: {
    index: true,
    follow: true,
  },

  manifest: "/manifest.json",

  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Capital Jey Car Trading",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Capital Jey Car Trading | Cars for Sale",
    description:
      "Explore quality vehicles with detailed specifications, photos, videos, and easy inquiry options.",
    siteName: "Capital Jey Car Trading",
  },

  twitter: {
    card: "summary_large_image",
    title: "Capital Jey Car Trading | Cars for Sale",
    description:
      "Find your next vehicle. Browse our latest inventory and explore every car in detail.",
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0B0B0B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${rajdhani.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-[#0B0B0B]">
        <AuthProvider>
          <CartProvider>
            {children}
            <AnimatedSplash />
            <FloatingSocial />
            <ChatWidget />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
