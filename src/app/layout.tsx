import type { Metadata } from "next";
import { Space_Grotesk, Mulish } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const mulish = Mulish({
  subsets: ["latin"],
  variable: "--font-mulish",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BiashaDrive - Grow Your Kenyan Business",
  description: "Get expert guidance, localized playbooks, and tools to help your business thrive in Kenya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${mulish.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
