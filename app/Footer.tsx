export default function Footer() {
  return (
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
  );
}
