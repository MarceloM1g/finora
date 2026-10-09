import { X } from "lucide-react";
import type { Service } from "../../types/service";
import { useState } from "react";
import { useToast } from "../../components/toast/ToastProvider";
import api from "../../lib/api";

interface EditServiceModalProps {
  service: Service;
  onClose: () => void;
  onUpdated: (updatedService: Service) => void;
}

export function EditServiceModal({
  service,
  onClose,
  onUpdated,
}: EditServiceModalProps) {
  const [editName, setEditName] = useState(service.name);
  const [editPrice, setEditPrice] = useState(String(service.price));

  const { toast } = useToast();

  async function handleUpdateService(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editName.trim() || !editPrice.trim()) {
      toast("Preencha todos os campos", "error");
      return;
    }

    const numericPrice = Number(editPrice);

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      toast("Preço inválido", "error");
      return;
    }

    try {
      await api.put(`/services/${service.id}`, {
        name: editName,
        price: numericPrice,
      });

      const updatedService = {
        ...service,
        name: editName.trim(),
        price: numericPrice,
      }

      onUpdated(updatedService);

      toast("Serviço editado com sucesso!", "success");
      onClose();
    } catch (error) {
      console.error(error);
      toast("Erro ao editar serviço", "error");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-foreground/10 bg-background p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            Editar serviço
          </h2>

          <button
            type="button"
            /* onClose executa "setIsEditModalOpen(false)" e "setSelectedService(null)" */
            onClick={onClose}
            aria-label="Fechar modal"
            className="rounded-lg p-2 text-foreground/60 transition-colors hover:bg-primary/10 hover:text-primary"
          >
            <X size={20} />
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleUpdateService}>
          <div>
            <label
              htmlFor="serviceName"
              className="mb-2 block text-sm font-medium text-foreground/80"
            >
              Nome do serviço
            </label>

            <input
              id="name"
              type="text"
              value={editName}
              onChange={(event) => setEditName(event.target.value)}
              className="h-12 w-full rounded-xl border border-foreground/15 bg-background px-4 text-foreground outline-none transition-colors focus:border-primary"
            />
          </div>

          <div>
            <label
              htmlFor="servicePrice"
              className="mb-2 block text-sm font-medium text-foreground/80"
            >
              Valor (R$)
            </label>

            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={editPrice}
              onChange={(event) => setEditPrice(event.target.value)}
              placeholder="0,00"
              className="h-12 w-full rounded-xl border border-foreground/15 bg-background px-4 text-foreground outline-none transition-colors focus:border-primary"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-3 text-sm text-foreground/70 transition-colors hover:bg-foreground/5"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-80"
            >
              Salvar alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
