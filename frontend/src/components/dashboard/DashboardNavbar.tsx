import { Link } from "react-router-dom";
import Logo from "../../assets/logo.png";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function DashboardNavbar() {
  const { user, logout } = useAuth();
  const [menu, setMenu] = useState(false);

  return (
    <nav className="w-full bg-secondary border-b border-white/20">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link to="/dashboard">
          <img className="w-20 h-auto" src={Logo} alt="Finora Logo" />
        </Link>

        {/* Links - desktop */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            to="/dashboard"
            className="text-base uppercase font-medium text-foreground/70 transition hover:text-foreground"
          >
            Home
          </Link>
        </div>

        {/* Usuário - desktop */}
        <div className="relative hidden md:block">
          <button
            type="button"
            onClick={() => setMenu((prev) => !prev)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#333] text-sm font-semibold text-primary">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <span className="text-base text-foreground">{user?.name}</span>

            <ChevronDown
              size={16}
              className={`text-foreground/60 transition-transform ${
                menu ? "rotate-180" : ""
              }`}
            />
          </button>

          {menu && (
            <div className="absolute right-0 top-full z-50 mt-2 min-w-32 rounded-md border bg-background p-1 shadow-md">
              <button
                type="button"
                onClick={logout}
                className="w-full rounded px-3 py-2 text-left text-sm hover:bg-muted"
              >
                Sair
              </button>
            </div>
          )}
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
