import { useEffect, useState } from "react";
import api from "../../lib/api";
import { Wrench, Ellipsis, Pencil, Trash2, Plus, Search } from "lucide-react";
import type { Service } from "../../types/service";
import { useToast } from "../../components/toast/ToastProvider";
import { Loading } from "../../components/loading/Loading";
import { EditServiceModal } from "../../components/services/EditServiceModal";
import { Link } from "react-router-dom";

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const { toast } = useToast();

  useEffect(() => {
    async function getServices() {
      try {
        const response = await api.get("/services");
        setServices(response.data.services);
      } catch (error) {
        console.error(error);
        toast("Erro ao buscar serviços", "error");
      } finally {
        setLoading(false);
      }
    }

    getServices();
  }, [toast]);

  function formatPrice(price: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  }

  async function deleteService(id: string) {
    try {
      await api.delete(`/services/${id}`);

      setServices((currentServices) =>
        currentServices.filter((service) => service.id !== id),
      );

      setOpenMenuId(null);
      toast("Serviço deletado com sucesso", "success");
    } catch (error) {
      console.error(error);
      setOpenMenuId(null);
      toast("Erro ao deletar serviço", "error");
    }
  }

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="w-full max-w-[1200px] mx-auto px-4 py-8">
      <header className="flex items-center gap-2 text-base text-gray-400">
        <Wrench className="text-primary" size={16} aria-hidden="true" />
        <h1 className="text-white">Serviços</h1>
      </header>

      {isEditModalOpen && selectedService && (
        <EditServiceModal
          /* Informações que o componete precisa */
          service={selectedService}
          /* Se o compoenente usar onClose, ele excuta isso */
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedService(null);
          }}
          onUpdated={(updatedService) => {
            setServices((currentServices) =>
              currentServices.map((service) =>
                service.id === updatedService.id ? updatedService : service,
              ),
            );
          }}
        />
      )}

      <div className="bg-secondary p-4 rounded-xl mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <Link
          to="/service/create"
          className="bg-primary rounded-xl px-4 py-3 inline-flex items-center justify-center gap-2 shrink-0"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span className="text-base font-semibold">Cadastrar Serviço</span>
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
        {filteredServices.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {filteredServices.map((service) => (
              <li
                key={service.id}
                className="relative flex items-center justify-between gap-4 bg-secondary p-4 rounded-xl"
              >
                <span>{service.name}</span>

                <span>{formatPrice(service.price)}</span>

                <button
                  type="button"
                  onClick={() =>
                    setOpenMenuId(openMenuId === service.id ? null : service.id)
                  }
                >
                  <Ellipsis size={20} />
                </button>

                {openMenuId === service.id && (
                  <div className="absolute right-3 top-full z-20 mt-2 w-44 overflow-hidden rounded-xl border border-white/2 bg-secondary p-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedService(service);
                        setIsEditModalOpen(true);
                        setOpenMenuId(null);
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-primary/10 hover:text-primary"
                    >
                      <Pencil size={16} aria-hidden="true" />
                      <span>Editar serviço</span>
                    </button>

                    <div className="my-1 border-t border-white/5" />

                    <button
                      type="button"
                      onClick={() => {
                        deleteService(service.id);
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                      <span>Excluir serviço</span>
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>Você ainda não possui serviços</p>
        )}
      </section>
    </main>
  );
}
