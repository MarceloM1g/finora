import { useState } from "react";
import { Link } from "react-router-dom";
import { Wrench, ArrowLeft, Plus } from "lucide-react";
import { useToast } from "../../components/toast/ToastProvider";
import api from "../../lib/api";
import { LoadingBtn } from "../../components/loading/LoadingBtn";

export default function CreateService() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const [loadingBtn, setLoadingBtn] = useState(false);

  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name?.trim() || !price?.trim()) {
      toast("Preencha todos os campos", "error");
      return;
    }

    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      toast("Preço inválido", "error");
      return;
    }

    setLoadingBtn(true);

    try {
      await api.post("/services", {
        name,
        price: numericPrice,
      });

      toast("Serviço cadastrado com sucesso!", "success");

      setName("");
      setPrice("");
    } catch (error) {
      console.error(error);
      toast("Erro ao cadastrar serviço", "error");
    } finally {
      setLoadingBtn(false);
    }
  }

  return (
    <main className="w-full max-w-[1200px] mx-auto px-4 py-8">
      <header className="flex items-center gap-2 text-base text-gray-400">
        <Wrench className="text-primary" size={16} aria-hidden="true" />
        <Link to="/services" className="hover:text-white transition-colors">
          Serviços
        </Link>
        <span aria-hidden="true">/</span>
        <h1 className="text-white">Cadastrar serviço</h1>
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
                Nome do serviço
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
                Preço
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  R$
                </span>

                <input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  placeholder="0,00"
                  className="w-full rounded-xl border border-white/10 bg-secondary py-3 pl-11 pr-4 text-foreground outline-none transition-colors focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row mt-6 gap-3">
            <Link
              to="/services"
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
              {loadingBtn ? <LoadingBtn /> : "Cadastrar Serviço"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
