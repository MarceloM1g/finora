import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-white">
      <section className="flex min-h-screen items-center justify-center px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl text-primary font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Finora <span className="text-white">começa aqui.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Sistema financeiro, gerencie suas cobranças.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/register"
              type="button"
              className="rounded-xl bg-primary px-6 py-3 font-semibold text-black transition hover:bg-blue-500"
            >
              Criar uma conta Finora
            </Link>

            <Link
              to="/login"
              type="button"
              className="rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              Já tenho uma conta
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
