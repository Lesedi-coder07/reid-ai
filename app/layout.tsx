import type { Metadata } from "next";
import { Geist_Mono, Space_Grotesk, Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reid AI | AI Image Generator",
  description: "Transform your ideas into stunning visuals with Reid AI. Built by Sulta Tech using AI SDK 5 for next-generation image creation.",
  keywords: ["AI", "image generator", "Nano Banana Pro", "AI SDK", "text to image"],
  icons: "https://reid.sultatech.com/sulta-logo.png",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${spaceGrotesk.variable}`}>
      <body className={`${geistMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
