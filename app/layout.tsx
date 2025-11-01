import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GastronoGuide",
  description: "GastronoGuide",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <img
              src="/GastronoGuide_LogoFinal_BlancEtNoir.png"
              alt="Gastronoguide Logo"
              className="h-10 w-auto"
            />
            <h1 className="text-2xl font-bold">Gastronoguide</h1>
          </div>
        </header>
        <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-gray-50">
          {children}
        </main>
        <footer className="bg-primary text-primary-foreground py-4 px-6 text-center">
          © 2025 Gastrono&apos;guide. Tous droits réservés.
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
