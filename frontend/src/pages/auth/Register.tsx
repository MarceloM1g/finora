import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "../../components/toast/ToastProvider";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  async function RegisterUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      name.trim() === "" ||
      email.trim() === "" ||
      password.trim() === "" ||
      confirmPassword.trim() === ""
    ) {
      toast("Preencha todos os campos", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast("Digite um e-mail válido", "error");
      return;
    }

    if (password.length < 5) {
      toast("A senha deve possuir mais de 4 caracteres", "error");
      return;
    }

    if (password !== confirmPassword) {
      toast("As senhas precisam ser iguais.", "error");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (!response.ok) {
        toast("Erro ao registrar Usuário");
        return;
      }

      toast("Conta criada com sucesso!", "success");
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8 text-foreground">
      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Criar sua conta no Finora
          </h1>

          <p className="mt-2 text-sm text-foreground/55">
            Preencha seus dados para começar
          </p>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-foreground p-6 sm:p-8">
          <form onSubmit={RegisterUser} className="space-y-5">
            {/* Nome */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-base font-medium text-foreground/80"
              >
                Nome
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-foreground outline-none transition placeholder:text-foreground/30 focus:border-primary/60 focus:ring-2 focus:ring-primary/10"
              />
            </div>

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

            {/* Confirmar senha */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-base font-medium text-foreground/80"
              >
                Confirmar senha
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 pr-12 text-sm text-foreground outline-none transition placeholder:text-foreground/30 focus:border-primary/60 focus:ring-2 focus:ring-primary/10"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-foreground/40 transition hover:text-primary"
                  aria-label={
                    showConfirmPassword ? "Ocultar senha" : "Mostrar senha"
                  }
                >
                  {showConfirmPassword ? (
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
              className="mt-2 h-12 w-full rounded-xl bg-primary font-semibold text-background transition hover:brightness-110 active:scale-[0.99]"
            >
              Criar conta
            </button>
          </form>

          {/* Login */}
          <p className="mt-6 text-center text-sm text-foreground/50">
            Já possui uma conta?{" "}
            <a
              href="/login"
              className="font-medium text-primary transition hover:text-primary/80"
            >
              Entrar
            </a>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-foreground/30">
          Ao criar sua conta, você concorda com nossos termos de uso.
        </p>
      </div>
    </main>
  );
}
