import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vultur — Candidate Matcher",
  description: "Take-home assessment: build a candidate-role matching tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <header className="border-b border-neutral-200 px-6 py-4">
          <img
            src="/logos/vultur-primary-black.svg"
            alt="Vultur"
            className="h-7 w-auto"
          />
        </header>
        {children}
      </body>
    </html>
  );
}
