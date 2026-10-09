import { Link } from "react-router-dom";
import Logo from "../../assets/finora-logo.png";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-white/10 bg-background">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          to="/"
        >
          <img className="w-50 h-auto" src={Logo} alt="Finora Logo" />
        </Link>

        {/* Links - desktop */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="text-base uppercase font-medium text-foreground/70 transition hover:text-foreground"
          >
            Home
          </Link>

          <a
            href="#sobre"
            className="text-base uppercase font-medium text-foreground/70 transition hover:text-foreground"
          >
            Sobre
          </a>
        </div>

        {/* Ações - desktop */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            className="rounded-xl border border-white/10 px-6 py-3 text-base font-medium text-foreground transition hover:border-primary/40 hover:text-primary"
          >
            Entrar
          </Link>

          <Link
            to="/register"
            className="rounded-xl bg-primary px-6 py-3 text-base font-semibold text-background transition hover:brightness-110"
          >
            Criar conta
          </Link>
        </div>

        {/* Botão mobile */}
        <button
          type="button"
          className="rounded-lg border border-white/10 p-2 text-foreground transition hover:border-primary/40 hover:text-primary md:hidden"
          aria-label="Abrir menu"
        >
          ☰
        </button>
      </div>
    </nav>
  );
}
