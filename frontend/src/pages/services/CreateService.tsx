import { useState } from "react";
import { useToast } from "../../components/toast/ToastProvider";
import api from "../../lib/api";

export default function CreateService() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

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

    try {
      const response = await api.post("/services", {
        name,
        price: numericPrice,
      });

      console.log(response.data);
      toast("Serviço cadastrado com sucesso!", "success");

      setName("");
      setPrice("");
    } catch (error) {
      console.log(error);
      toast("Erro ao cadastrar serviço", "error");
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="mb-8">
          <p className="text-sm font-medium text-primary mb-2">Serviços</p>

          <h1 className="text-3xl font-semibold tracking-tight">
            Criar serviço
          </h1>

          <p className="text-foreground/60 mt-2">
            Cadastre um novo serviço para utilizar nas suas cobranças.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-secondary border border-white/10 rounded-2xl p-6 shadow-xl"
        >
          <div className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Nome do serviço
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-foreground/30"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-2">
                Preço
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-foreground/50">
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
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-foreground/30"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-background transition hover:bg-primary/90 active:scale-[0.99]"
            >
              Criar serviço
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
