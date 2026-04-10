import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/custom-cursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Delta Tau Delta — Alumni Reunion",
  description: "July 18–20, 2025 — Oxford, Ohio. Join us for the Delta Tau Delta alumni reunion.",
  openGraph: {
    title: "MIT DTD 2026 Alumni Reunion",
    description: "July 18–20, 2025 — Oxford, Ohio. Join us for the Delta Tau Delta alumni reunion.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MIT DTD 2026 Alumni Reunion",
    description: "July 18–20, 2025 — Oxford, Ohio. Join us for the Delta Tau Delta alumni reunion.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-gray-950 text-gray-100">
        {children}
        {/* Custom cursor — rendered outside the page tree so it always
            floats above everything; only activates on pointer-fine devices */}
        <CustomCursor />
      </body>
    </html>
  );
}
