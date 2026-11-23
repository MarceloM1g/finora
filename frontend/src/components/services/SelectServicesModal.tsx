import { useState, useEffect } from "react";
import type { Service } from "../../types/service";
import { X, Plus } from "lucide-react";
import { Link } from "react-router-dom";

type ServiceCardProps = {
  services: Service[];
  selectedServices: string[];
  onToggle: (serviceId: string) => void;
  onClose: () => void;
};

export default function ServiceCard({
  services,
  selectedServices,
  onToggle,
  onClose,
}: ServiceCardProps) {
  const [searchName, setSearchName] = useState("");

  const filteredService = services.filter((service) => {
    return service.name.toLowerCase().includes(searchName.toLowerCase());
  });

  // Fecha com ESC e trava o scroll do body enquanto o modal está aberto
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="services-modal-title"
        className="flex h-[80vh] w-full max-w-2xl flex-col rounded-xl bg-background shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
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
              Escolha os serviços, ou cadastre um novo.
            </h2>

            <Link
              to="/services/create"
              className="bg-primary rounded-xl px-4 py-3 inline-flex items-center justify-center gap-2 shrink-0"
            >
              <Plus className="text-secondary" size={18} strokeWidth={2.5} />
              <span className="text-base font-semibold text-secondary">
                Cadastrar mais Serviço
              </span>
            </Link>
          </div>

          <div className="p-2">
            <input
              type="text"
              value={searchName}
              onChange={(event) => setSearchName(event.target.value)}
              placeholder="Buscar Serviço"
              className="w-full rounded-xl border border-white/10 bg-secondary py-3 pl-10 pr-4 text-foreground outline-none transition-colors focus:border-primary"
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4">
          {filteredService.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {filteredService.map((service) => {
                const isSelected = selectedServices.includes(service.id);

                return (
                  <li key={service.id}>
                    <button
                      type="button"
                      aria-pressed={isSelected}
                      className={`flex w-full cursor-pointer items-center justify-between gap-4 rounded-lg border p-4 text-left transition-colors duration-200 ${
                        isSelected
                          ? "border-primary bg-primary text-secondary"
                          : "border-white/5 bg-secondary text-foreground hover:border-primary/60"
                      }`}
                      onClick={() => onToggle(service.id)}
                    >
                      <span className="font-medium">{service.name}</span>
                      <span
                        className={`text-sm font-semibold ${
                          isSelected ? "text-secondary" : "text-primary"
                        }`}
                      >
                        {Number(service.price).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-center text-foreground">
              <h2 className="text-base font-semibold">
                Nenhum Serviço encontrado.
              </h2>
              <p>Vamos cadastrar seu Serviço?</p>
              <Link
                to="/services/create"
                className="bg-primary rounded-xl px-4 py-3 inline-flex items-center justify-center gap-2 shrink-0 mt-2"
              >
                <Plus size={18} strokeWidth={2.5} />
                <span className="text-base font-semibold">
                  Cadastrar Serviço
                </span>
              </Link>
            </div>
          )}
        </div>

        <div className="flex shrink-0 justify-center border-t border-white/5 p-4">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg bg-primary px-8 py-2 font-semibold text-secondary transition-opacity duration-200 hover:opacity-90"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
