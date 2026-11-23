import type { Client } from "../../types/client";
import { Link } from "react-router-dom";
import { Plus, X } from "lucide-react";
import { useState } from "react";

type ClientCardProps = {
  clients: Client[];
  selectedClient: string;
  onToggle: (serviceId: string) => void;
  onClose: () => void;
};

export default function ClientCard({
  clients,
  selectedClient,
  onToggle,
  onClose,
}: ClientCardProps) {
  const [searchName, setSearchName] = useState("");

  const filteredClients = clients.filter((client) => {
    return client.name.toLowerCase().includes(searchName.toLowerCase());
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="flex h-[80vh] w-full max-w-2xl flex-col rounded-xl bg-background shadow-xl">
        <header className="bg-secondary rounded-xl mb-4">
          <div className="flex justify-end p-2">
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-foreground transition-colors duration-200 hover:bg-white/10"
            >
              <X />
            </button>
          </div>

          <div className="flex w-full flex-col items-stretch justify-between gap-3 p-4 md:flex-row md:items-center">
            <h2 className="text-lg font-semibold">
              Escolha o cliente, ou cadastre um novo.
            </h2>

            <Link
              to="/clients/create"
              className="bg-primary rounded-xl px-4 py-3 inline-flex items-center justify-center gap-2 shrink-0"
            >
              <Plus className="text-secondary" size={18} strokeWidth={2.5} />
              <span className="text-base font-semibold text-secondary">
                Cadastrar mais Cliente
              </span>
            </Link>
          </div>

          <div className="p-2">
            <input
              type="text"
              value={searchName}
              onChange={(event) => setSearchName(event.target.value)}
              placeholder="Buscar Clientes"
              className="w-full rounded-xl border border-white/10 bg-secondary py-3 pl-10 pr-4 text-foreground outline-none transition-colors focus:border-primary"
            />
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4">
          {filteredClients.length > 0 ? (
            <ul className="flex flex-col gap-2">
              <h2>Seus Clientes</h2>
              {filteredClients.map((client) => {
                const isSelected = selectedClient.includes(client.id);

                return (
                  <li onClick={onClose} key={client.id}>
                    <button
                      type="button"
                      className={`flex w-full cursor-pointer items-center justify-between gap-4 rounded-lg border p-4 text-left transition-colors duration-200 ${
                        isSelected
                          ? "border-primary bg-primary text-secondary"
                          : "border-white/5 bg-secondary text-foreground hover:border-primary/60"
                      }`}
                      onClick={() => onToggle(client.id)}
                    >
                      <span>{client.name}</span>
                      <span className="text-primary">Selecionar</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-center text-foreground">
              <h2 className="text-base font-semibold">
                Nenhum cliente encontrado.
              </h2>
              <p>Vamos cadastrar seu cliente?</p>
              <Link
                to="/clients/create"
                className="bg-primary rounded-xl px-4 py-3 inline-flex items-center justify-center gap-2 shrink-0 mt-2"
              >
                <Plus size={18} strokeWidth={2.5} />
                <span className="text-base font-semibold">
                  Cadastrar Cliente
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
