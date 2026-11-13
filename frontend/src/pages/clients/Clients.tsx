import { useEffect, useState } from "react";
import api from "../../lib/api";
import { Ellipsis, Pencil, Trash2, Plus, Search, User } from "lucide-react";
import type { Client } from "../../types/client";
import { useToast } from "../../components/toast/ToastProvider";
import { Loading } from "../../components/loading/Loading";
import { EditClientModal } from "../../components/clients/EditClientModal";
import { Link } from "react-router-dom";

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    async function getClients() {
      try {
        const response = await api.get("/clients");
        setClients(response.data.clients);
      } catch (error) {
        console.error(error);
        toast("Erro ao buscar Clientes", "error");
      } finally {
        setLoading(false);
      }
    }

    getClients();
  }, [toast]);

  async function deleteClient(id: string) {
    try {
      await api.delete(`/clients/${id}`);

      setClients((currentClients) =>
        currentClients.filter((client) => client.id !== id),
      );

      setOpenMenuId(null);
      toast("Cliente deletado com sucesso", "success");
    } catch (error) {
      console.error(error);
      setOpenMenuId(null);
      toast("Erro ao deletar cliente", "error");
    }
  }

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="w-full max-w-[1200px] mx-auto px-4 py-8">
      <header className="flex items-center gap-2 text-base text-gray-400">
        <User className="text-primary" size={16} aria-hidden="true" />
        <h1 className="text-white">Clientes</h1>
      </header>

      {isEditModalOpen && selectedClient && (
        <EditClientModal
          /* Informações que o componete precisa */
          client={selectedClient}
          /* Se o compoenente usar onClose, ele excuta isso */
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedClient(null);
          }}
          onUpdated={(updatedClient) => {
            setClients((currentClients) =>
              currentClients.map((client) =>
                client.id === updatedClient.id ? updatedClient : client,
              ),
            );
          }}
        />
      )}

      <div className="bg-secondary p-4 rounded-xl mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <Link
          to="/clients/create"
          className="bg-primary rounded-xl px-4 py-3 inline-flex items-center justify-center gap-2 shrink-0"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span className="text-base font-semibold">Cadastrar Cliente</span>
        </Link>

        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar serviço..."
            className="w-full rounded-xl border border-white/10 bg-secondary py-3 pl-10 pr-4 text-foreground outline-none transition-colors focus:border-primary"
          />
        </div>
      </div>

      <section
        className="w-full max-w-[900px] mx-auto mt-6"
        aria-label="Lista de serviços"
      >
        {filteredClients.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {filteredClients.map((client) => (
              <li
                key={client.id}
                className="relative flex items-center justify-between gap-4 bg-secondary p-4 rounded-xl"
              >
                <span>{client.name}</span>

                <span>
                  {client.email ? (
                    <span>{client.email}</span>
                  ) : (
                    <span>Sem E-mail</span>
                  )}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setOpenMenuId(openMenuId === client.id ? null : client.id)
                  }
                >
                  <Ellipsis size={20} />
                </button>

                {openMenuId === client.id && (
                  <div className="absolute right-3 top-full z-20 mt-2 w-44 overflow-hidden rounded-xl border border-white/2 bg-secondary p-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedClient(client);
                        setIsEditModalOpen(true);
                        setOpenMenuId(null);
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-primary/10 hover:text-primary"
                    >
                      <Pencil size={16} aria-hidden="true" />
                      <span>Editar cliente</span>
                    </button>

                    <div className="my-1 border-t border-white/5" />

                    <button
                      type="button"
                      onClick={() => {
                        deleteClient(client.id);
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                      <span>Excluir cliente</span>
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>Você ainda não possui clientes cadastrado</p>
        )}
      </section>
    </main>
  );
}
