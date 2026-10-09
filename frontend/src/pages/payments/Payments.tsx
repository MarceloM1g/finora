import { useState, type FormEvent } from "react";

export default function Payments() {
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, status, description }),
      });

      if (!res.ok) {
        throw new Error("Não foi possível salvar o pagamento");
      }

      // limpa o formulário depois de salvar
      setAmount("");
      setStatus("PENDING");
      setDescription("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="w-full max-w-2xl mx-auto px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-xl border border-white/[0.08] bg-[#111] p-6"
      >
        <h1 className="text-lg font-semibold text-white">Novo pagamento</h1>

        <div className="flex flex-col gap-1">
          <label htmlFor="amount" className="text-sm text-white/70">
            Valor (R$)
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0,00"
            className="rounded-lg border border-white/[0.08] bg-transparent px-3 py-2 text-white outline-none focus:border-white/30"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="status" className="text-sm text-white/70">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-white/[0.08] bg-[#111] px-3 py-2 text-white outline-none focus:border-white/30"
          >
            <option value="PENDING">Pendente</option>
            <option value="PAID">Pago</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="text-sm text-white/70">
            Descrição (opcional)
          </label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-lg border border-white/[0.08] bg-transparent px-3 py-2 text-white outline-none focus:border-white/30"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-white px-4 py-2 font-medium text-black transition hover:bg-white/90 disabled:opacity-50"
        >
          {loading ? "Salvando..." : "Salvar pagamento"}
        </button>
      </form>
    </main>
  );
}
