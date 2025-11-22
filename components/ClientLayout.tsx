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
          <h1 className="text-2xl font-bold">Gastronoguide</h1>
        </a>
        <LanguageSelector />
      </header>
      <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-gray-50">
        {children}
      </main>
      <footer className="bg-primary text-primary-foreground py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm">© 2025 Gastronoguide. Tous droits réservés.</p>
            </div>
            <nav className="flex flex-wrap justify-center gap-4 text-sm">
              <a href="/mentions-legales" className="hover:underline transition-colors">
                Mentions légales
              </a>
              <span className="text-primary-foreground/50">|</span>
              <a href="/cgv" className="hover:underline transition-colors">
                CGV
              </a>
              <span className="text-primary-foreground/50">|</span>
              <a href="/politique-confidentialite" className="hover:underline transition-colors">
                Confidentialité
              </a>
              <span className="text-primary-foreground/50">|</span>
              <a href="/politique-cookies" className="hover:underline transition-colors">
                Cookies
              </a>
            </nav>
          </div>
        </div>
      </footer>
      <Toaster />
      <CookieConsent />
    </LanguageProvider>
  );
}
