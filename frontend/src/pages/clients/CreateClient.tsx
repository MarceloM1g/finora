import { useState } from "react";
import { Link } from "react-router-dom";
import { User, ArrowLeft, Plus } from "lucide-react";
import { useToast } from "../../components/toast/ToastProvider";
import api from "../../lib/api";
import { LoadingBtn } from "../../components/loading/LoadingBtn";

export default function CreateClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [loadingBtn, setLoadingBtn] = useState(false);

  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name?.trim()) {
      toast("Preencha o campo nome", "error");
      return;
    }

    setLoadingBtn(true);

    try {
      await api.post("/clients", {
        name,
        email,
      });

      toast("Cliente cadastrado com sucesso!", "success");

      setName("");
      setEmail("");
    } catch (error) {
      console.error(error);
      toast("Erro ao cadastrar Cliente", "error");
    } finally {
      setLoadingBtn(false);
    }
  }

  return (
    <main className="w-full max-w-[1200px] mx-auto px-4 py-8">
      <header className="flex items-center gap-2 text-base text-gray-400">
        <User className="text-primary" size={16} aria-hidden="true" />
        <Link to="/clients" className="hover:text-white transition-colors">
          Clientes
        </Link>
        <span aria-hidden="true">/</span>
        <h1 className="text-white">Cadastrar clientes</h1>
      </header>

      <section
        className="w-full max-w-[600px] mx-auto mt-6"
        aria-label="Cadastro de serviço"
      >
        <form
          onSubmit={handleSubmit}
          className="bg-secondary p-6 rounded-xl flex flex-col gap-4"
        >
          <div className="grid gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm text-gray-400">
                Nome do Cliente
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-secondary py-3 px-4 text-foreground outline-none transition-colors focus:border-primary"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="price" className="text-sm text-gray-400">
                E-mail do cliente
              </label>

              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-secondary py-3 pl-11 pr-4 text-foreground outline-none transition-colors focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row mt-6 gap-3">
            <Link
              to="/clients"
              className="rounded-xl border border-white/10 px-4 py-3 inline-flex items-center justify-center gap-2 text-gray-400 transition-colors hover:text-white"
            >
              <ArrowLeft size={18} aria-hidden="true" />
              <span className="text-base">Voltar</span>
            </Link>

            <button
              disabled={loadingBtn}
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-primary p-4"
            >
              <Plus size={18} />
              {loadingBtn ? <LoadingBtn /> : "Cadastrar Cliente"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
