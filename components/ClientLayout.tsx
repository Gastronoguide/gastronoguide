"use client";

import { LanguageProvider } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import { Toaster } from "@/components/ui/toaster";
import CookieConsent from "@/components/CookieConsent";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between shadow-md">
        <a href="/" className="flex items-center gap-3 cursor-pointer">
          <img
            src="/GastronoGuide_LogoFinal_BlancEtNoir.png"
            alt="Gastronoguide Logo"
            className="h-10 w-auto"
          />
          <h1 className="text-2xl font-bold max-[360px]:hidden">Gastronoguide</h1>
        </a>
        <LanguageSelector />
      </header>
      <main className="flex-1">
        {children}
      </main>
      <Toaster />
      <CookieConsent />
    </LanguageProvider>
  );
}
