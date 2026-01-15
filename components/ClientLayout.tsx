"use client";

import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import { Toaster } from "@/components/ui/toaster";
import CookieConsent from "@/components/CookieConsent";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { translations } from "@/lib/translations";

function Header() {
  const { language } = useLanguage();
  const t = translations[language];
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#about-section", label: t.navAbout },
    { href: "#included-section", label: t.navIncluded },
    { href: "#practical-section", label: t.navPractical },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id.replace("#", ""));
    if (element) {
      const offset = 80; // height of header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md py-2" : "bg-primary py-4"
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3 cursor-pointer">
          <img
            src="/GastronoGuide_LogoFinal_BlancEtNoir.png"
            alt="Gastronoguide Logo"
            className={`h-10 w-auto transition-transform ${isScrolled ? "scale-90" : "scale-100"}`}
          />
          <h1 className={`text-xl sm:text-2xl font-bold transition-colors ${isScrolled ? "text-gray-900" : "text-primary-foreground"
            }`}>
            Gastronoguide
          </h1>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className={`font-medium hover:opacity-70 transition-opacity ${isScrolled ? "text-gray-700" : "text-primary-foreground"
                }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#reservation-section"
            onClick={(e) => scrollToSection(e, "#reservation-section")}
            className={`px-4 py-2 rounded-full font-bold transition-all ${isScrolled
              ? "bg-[#B6D7A5] text-black hover:bg-[#B6D7A5]/90"
              : "bg-white text-black hover:bg-white/90"
              }`}
          >
            {t.navBook}
          </a>
          <LanguageSelector />
        </nav>

        {/* Mobile menu button */}
        <div className="flex items-center gap-4 md:hidden">
          <LanguageSelector />
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`p-2 rounded-lg ${isScrolled ? "text-gray-900" : "text-primary-foreground"}`}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl py-4 px-6 border-t animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="text-lg font-medium text-gray-800 py-2 border-b border-gray-100 last:border-0"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#reservation-section"
              onClick={(e) => scrollToSection(e, "#reservation-section")}
              className="bg-[#B6D7A5] text-black text-center py-3 rounded-xl font-bold mt-2"
            >
              {t.navBook}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Toaster />
      <CookieConsent />
    </LanguageProvider>
  );
}
