import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "../../components/toast/ToastProvider";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import api from "../../lib/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const { setUser, user } = useAuth();
  const navigate = useNavigate();

  async function LoginUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      toast("Preencha todos os campos", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      setUser(response.data.user);

      toast("Logado com sucesso!", "success");
      setEmail("");
      setPassword("");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        toast(
          error.response?.data?.error ??
            "Não foi possível conectar ao servidor.",
          "error",
        );
      } else {
        toast("Ocorreu um erro inesperado.", "error");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    function isUserLogged() {
      if (user) {
        navigate("/dashboard");
      }
    }

    isUserLogged();
  }, [navigate, user]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8 text-foreground">
      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Entrar no Finora
          </h1>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-foreground p-6 sm:p-8">
          <form onSubmit={LoginUser} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-base font-medium text-foreground/80"
              >
                E-mail
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-foreground outline-none transition placeholder:text-foreground/30 focus:border-primary/60 focus:ring-2 focus:ring-primary/10"
              />
            </div>

            {/* Senha */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-base font-medium text-foreground/80"
              >
                Senha
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 pr-12 text-sm text-foreground outline-none transition placeholder:text-foreground/30 focus:border-primary/60 focus:ring-2 focus:ring-primary/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-foreground/40 transition hover:text-primary"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-background transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:brightness-100"
            >
              {loading ? (
                <span
                  className="flex items-center gap-1"
                  aria-label="Carregando"
                >
                  <span className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-white" />
                </span>
              ) : (
                "Entrar"
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
