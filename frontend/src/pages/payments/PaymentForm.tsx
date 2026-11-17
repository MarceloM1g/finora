import { Link } from "react-router-dom";
import { CircleDollarSign, Plus, UserRound, X, Wrench } from "lucide-react";
import { useState, useEffect } from "react";
import type { Client } from "../../types/client";
import type { Service } from "../../types/service";
import { useToast } from "../../components/toast/ToastProvider";
import api from "../../lib/api";
import { Loading } from "../../components/loading/Loading";
import SelectClientModal from "../../components/clients/SelectClientModal";
import SelectServicesModal from "../../components/services/SelectServicesModal";
import { LoadingBtn } from "../../components/loading/LoadingBtn";
import { getToday } from "../../lib/date";
import axios from "axios";
import type { Payment } from "../../types/payment";

type Props = {
  payment?: Payment | null;
  onSuccess?: () => void;
};

export default function PaymentForm({ payment, onSuccess }: Props) {
  /* Todos os Clientes e Serviços */
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  /* Seleções de Cliente e Serviços */
  const [selectedClient, setSelectedClient] = useState(payment?.clientId ?? "");
  const [selectedServices, setSelectedServices] = useState<string[]>(
    payment?.items.map((item) => item.serviceId) ?? [],
  );

  /* Data */
  const today = getToday();
  const [date, setDate] = useState(payment?.date ?? getToday());
  const [time, setTime] = useState(payment?.time ?? "");

  /* Descrição */
  const [description, setDescription] = useState(payment?.description ?? "");

  /* Modal */
  const [isClientsModalOpen, setIsClientsModalOpen] = useState(false);
  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);

  /* Loading */
  const [loading, setLoading] = useState(true);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const { toast } = useToast();

  const selectedClientData = clients.find(
    (client) => client.id === selectedClient,
  );

  const selectedServicesData = services.filter((service) =>
    selectedServices.includes(service.id),
  );

  function toggleClient(clientId: string) {
    setSelectedClient((prev) => (prev === clientId ? "" : clientId));
  }

  function toggleService(serviceId: string) {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId],
    );
  }

  const total = selectedServicesData.reduce((acc, item) => {
    return acc + Number(String(item.price).replace(",", "."));
  }, 0);

  function formatPrice(price: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  }

  useEffect(() => {
    async function load() {
      try {
        const [clientsRes, servicesRes] = await Promise.all([
          api.get("/clients"),
          api.get("/services"),
        ]);
        setClients(clientsRes.data.clients);
        setServices(servicesRes.data.services);
      } catch (error) {
        console.error(error);
        toast("Erro ao carregar dados", "error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [toast]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (selectedClient === "") {
      toast("Selecione um cliente", "error");
      return;
    }

    if (selectedServices.length === 0) {
      toast("Selecione pelo menos um serviço", "error");
      return;
    }

    setLoadingBtn(true);

    try {
      if (payment) {
        await api.put(`/payments/${payment.id}`, {
          clientId: selectedClient,
          serviceIds: selectedServices,
          price: total,
          date,
          time,
          description: description.trim() || undefined,
        });

        toast("Ordem de Serviço editado com sucesso", "success");
        onSuccess?.();
      } else {
        await api.post("/payments", {
          clientId: selectedClient,
          serviceIds: selectedServices,
          price: total,
          date,
          time,
          description: description.trim() || undefined,
        });

        toast("Ordem de Serviço criado com sucesso", "success");
        setSelectedClient("");
        setSelectedServices([]);
        setDate(today);
        setTime("");
        setDescription("");
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        toast(
          error.response?.data?.error ??
            "Não foi possível conectar ao servidor.",
          "error",
        );
      } else {
        toast("Ocorreu um erro inesperado.", "error");
      }
    } finally {
      setLoadingBtn(false);
    }
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="w-full max-w-[1200px] mx-auto px-4 py-8">
      <header className="flex items-center gap-2 text-base text-gray-400">
        <CircleDollarSign
          className="text-primary"
          size={16}
          aria-hidden="true"
        />
        <Link to="/payments" className="hover:text-white transition-colors">
          Ordem de Serviço
        </Link>
        <span aria-hidden="true">/</span>
        <h1 className="text-white"> {payment ? "Editar OS" : "Criar OS"} </h1>
      </header>

      <section
        className="w-full max-w-[800px] mx-auto mt-6"
        aria-label="Criar Ordem de Serviço"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            {payment ? "Editar Ordem de Serviço" : "Criar Ordem de Serviço"}
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            {/* Clients */}
            <span className="text-xl text-foreground font-semibold">
              Selecione o Cliente
            </span>

            {selectedClientData ? (
              <div className="flex items-center gap-3 rounded-xl border border-primary/60 bg-secondary p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                  <UserRound size={19} aria-hidden="true" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs">Cliente Selecionado</p>
                  <p className="text-xl">{selectedClientData.name}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedClient("")}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
                >
                  <X />
                </button>
              </div>
            ) : (
              <div
                onClick={() => setIsClientsModalOpen(true)}
                className="flex flex-col items-center rounded-xl border border-dashed border-primary/[0.60] px-4 py-7 text-center cursor-pointer"
              >
                <UserRound
                  size={25}
                  className="mb-2 text-muted-foreground"
                  aria-hidden="true"
                />

                <p className="text-lg font-semibold text-foreground">
                  Nenhum cliente selecionado
                </p>

                <p className="mt-1 text-lg text-muted-foreground">
                  Escolha um cliente para continuar.
                </p>
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setIsClientsModalOpen(true)}
                className="flex w-full max-w-[600px] items-center justify-center gap-2 rounded-xl bg-primary mb-6 px-4 py-2 text-base font-semibold text-secondary transition-colors hover:brightness-110"
              >
                <Plus size={18} />
                Adicionar Cliente
              </button>
            </div>

            {isClientsModalOpen && (
              <SelectClientModal
                clients={clients}
                selectedClient={selectedClient}
                onToggle={toggleClient}
                onClose={() => setIsClientsModalOpen(false)}
              />
            )}

            {/* Services */}
            <span className="text-xl text-foreground font-semibold">
              Selecione os serviços
            </span>

            <ul>
              {selectedServicesData.length > 0 ? (
                selectedServicesData.map((service) => (
                  <li
                    key={service.id}
                    className="flex items-center gap-3 rounded-xl border border-primary/60 bg-secondary p-4 mb-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xl">{service.name}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleService(service.id)}
                      className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
                    >
                      <X />
                    </button>
                  </li>
                ))
              ) : (
                <div
                  onClick={() => setIsServicesModalOpen(true)}
                  className="flex flex-col items-center rounded-xl border border-dashed border-primary/[0.60] px-4 py-7 text-center cursor-pointer"
                >
                  <Wrench
                    size={25}
                    className="mb-2 text-muted-foreground"
                    aria-hidden="true"
                  />

                  <p className="text-lg font-semibold text-foreground">
                    Nenhum Serviço selecionado
                  </p>

                  <p className="mt-1 text-lg text-muted-foreground">
                    Escolha um cliente para continuar.
                  </p>
                </div>
              )}
            </ul>

            <span className="bg-secondary p-2 rounded-xl text-center font-semibold text-xl">
              Total: {formatPrice(total)}
            </span>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setIsServicesModalOpen(true)}
                className="flex w-full max-w-[600px] items-center justify-center gap-2 rounded-xl bg-primary mb-6 px-4 py-2 text-base font-semibold text-secondary transition-colors hover:brightness-110"
              >
                <Plus size={18} />
                Adicionar Serviços
              </button>
            </div>

            {isServicesModalOpen && (
              <SelectServicesModal
                services={services}
                selectedServices={selectedServices}
                onToggle={toggleService}
                onClose={() => setIsServicesModalOpen(false)}
              />
            )}
          </div>

          {/* Data e horário */}
          <div className="space-y-3">
            <label className="text-xl font-semibold">Data e horário</label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <input
                  type="date"
                  id="date"
                  name="date"
                  min={today}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="
          w-full h-14
          rounded-xl
          border border-foreground/15
          bg-secondary
          px-4
          text-base text-foreground
          outline-none
          transition
          focus:border-primary
          focus:ring-2 focus:ring-primary/20
          cursor-pointer
        "
                />
              </div>

              <input
                type="time"
                id="time"
                name="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="
        w-full h-14
        rounded-xl
        border border-foreground/15
        bg-secondary
        px-4
        text-base text-foreground
        outline-none
        transition
        focus:border-primary
        focus:ring-2 focus:ring-primary/20
        cursor-pointer
      "
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="description"
              className="text-xl text-foreground font-semibold"
            >
              Descrição{" "}
              <span className="text-sm font-normal text-foreground/60">
                (opcional)
              </span>
            </label>

            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione uma descrição para esta Ordem de Serviço..."
              rows={4}
              className="w-full rounded-xl border border-border bg-background p-4 text-foreground placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-primary resize-y"
            />

            <span className="text-sm text-gray-400">
              Descreva os detalhes ou observações do OS.
            </span>

            <button
              disabled={loadingBtn}
              className="bg-primary rounded-xl p-4"
              type="submit"
            >
              {loadingBtn ? (
                <LoadingBtn />
              ) : payment ? (
                "Editar Ordem de Serviço"
              ) : (
                "Criar Ordem de Serviço"
              )}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
