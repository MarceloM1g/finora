import { X } from "lucide-react";
import type { Client } from "../../types/client";
import { useState } from "react";
import { useToast } from "../../components/toast/ToastProvider";
import api from "../../lib/api";

interface EditClientModalProps {
  client: Client;
  onClose: () => void;
  onUpdated: (updatedClient: Client) => void;
}

export function EditClientModal({
  client,
  onClose,
  onUpdated,
}: EditClientModalProps) {
  const [editName, setEditName] = useState(client.name);
  const [editEmail, setEditEmail] = useState(
    client.email == null ? "" : String(client.email),
  );

  const { toast } = useToast();

  async function handleUpdateClient(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editName.trim() || !editEmail.trim()) {
      toast("Preencha todos os campos", "error");
      return;
    }

    try {
      await api.put(`/clients/${client.id}`, {
        name: editName,
        email: editEmail,
      });

      const updatedClient = {
        ...client,
        name: editName.trim(),
        email: editEmail.trim().toLocaleLowerCase(),
      };

      onUpdated(updatedClient);

      toast("Cliente editado com sucesso!", "success");
      onClose();
    } catch (error) {
      console.error(error);
      toast("Erro ao editar cliente", "error");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-foreground/10 bg-background p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            Editar informações do Cliente
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

        <form className="space-y-5" onSubmit={handleUpdateClient}>
          <div>
            <label
              htmlFor="clientName"
              className="mb-2 block text-sm font-medium text-foreground/80"
            >
              Nome do Cliente
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
              htmlFor="clientEmail"
              className="mb-2 block text-sm font-medium text-foreground/80"
            >
              Email do cliente
            </label>

            <input
              id="price"
              type="email"
              value={editEmail == null ? "" : editEmail}
              onChange={(event) => setEditEmail(event.target.value)}
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
