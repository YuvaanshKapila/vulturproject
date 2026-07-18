import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeToggle } from "@/components/ThemeToggle";

const inter = Inter({ subsets: ["latin"] });

const themeScript = `
  try {
    const t = localStorage.getItem('theme');
    if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
`;

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.className} antialiased`}>
        <header className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
          <img
            src="/logos/vultur-primary-black.svg"
            alt="Vultur"
            className="h-7 w-auto dark:hidden"
          />
          <img
            src="/logos/vultur-primary-white.svg"
            alt="Vultur"
            className="hidden h-7 w-auto dark:block"
          />
          <ThemeToggle />
        </header>
        {children}
      </body>
    </html>
  );
}
