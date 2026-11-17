import { Link } from "react-router-dom";
import {
  Plus,
  DollarSign,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Loading } from "../../components/loading/Loading";
import api from "../../lib/api";
import type { Payment } from "../../types/payment";
import { useToast } from "../../components/toast/ToastProvider";
import axios from "axios";
import { formatDate } from "../../lib/date";
import PaymentForm from "./PaymentForm";

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [searchName, setSearchName] = useState("");
  const [searchService, setSearchService] = useState("");

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  /* Buscar OS */
  useEffect(() => {
    async function getPayments() {
      try {
        const response = await api.get("/payments");
        setPayments(response.data.payments);
      } catch (error) {
        console.error(error);
        toast("Erro ao buscar Ordem de Serviço", "error");
      } finally {
        setLoading(false);
      }
    }

    getPayments();
  }, [toast]);

  /* Reload */
  async function reloadPayments() {
    try {
      const response = await api.get("/payments");
      setPayments(response.data.payments);
    } catch (error) {
      console.error(error);
      toast("Erro ao recarregar Ordem de Serviço", "error");
    }
  }

  const formatBRL = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  /* Filtro de busca */
  const filteredPayments = payments.filter((payment) => {
    const matchesClient = payment.client.name
      .toLowerCase()
      .includes(searchName.toLocaleLowerCase());

    const matchesService = payment.items.some((item) =>
      item.name.toLowerCase().includes(searchService.toLowerCase()),
    );

    return (
      (searchName === "" || matchesClient) &&
      (searchService === "" || matchesService)
    );
  });

  /* Deletar OS */
  async function deletePayment(id: string) {
    try {
      await api.delete(`/payments/${id}`);

      setPayments((currentPayments) =>
        currentPayments.filter((payment) => payment.id !== id),
      );

      setOpenMenuId(null);
      toast("Ordem de Serviço deletado com sucesso", "success");
    } catch (error) {
      console.error(error);
      setOpenMenuId(null);
      if (axios.isAxiosError(error)) {
        toast(
          error.response?.data?.error ??
            "Não foi possível conectar ao servidor.",
          "error",
        );
      } else {
        toast("Ocorreu um erro inesperado.", "error");
      }
    }
  }

  /* Config de estilos */
  const paymentStatusConfig = {
    PENDING: {
      label: "Pendente",
      className:
        "bg-yellow-500/80 text-white font-semibold border-yellow-500/20",
    },
    PAID: {
      label: "Pago",
      className: "bg-green-500/10 text-green-600 border-green-500/20",
    },
    CANCELLED: {
      label: "Cancelado",
      className: "bg-red-500/10 text-red-500 border-red-500/20",
    },
    OVERDUE: {
      label: "Atrasado",
      className: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    },
  } as const;

  /* Função que detecta click fora do menu */
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="w-full max-w-[1200px] mx-auto px-4 py-8">
      <header className="flex items-center gap-2 text-base text-gray-400">
        <DollarSign className="text-primary" size={16} aria-hidden="true" />
        <h1 className="text-white">Ordem de Serviço</h1>
      </header>

      {/* Menu de Edição */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-background p-4">
            <button
              type="button"
              onClick={() => setSelectedPayment(null)}
              className="absolute right-3 top-3"
              aria-label="Fechar edição"
            >
              <X size={30} />
            </button>

            <PaymentForm
              key={selectedPayment.id}
              payment={selectedPayment}
              onSuccess={async () => {
                await reloadPayments();
                setSelectedPayment(null);
              }}
            />
          </div>
        </div>
      )}

      <div className="bg-secondary p-4 rounded-xl mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <Link
          to="/payments/create"
          className="bg-primary rounded-xl px-4 py-3 inline-flex items-center justify-center gap-2 shrink-0"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span className="text-base font-semibold">
            Criar Ordem de Serviço
          </span>
        </Link>

        {/* Filtrar por Nome */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={searchName}
            onChange={(event) => setSearchName(event.target.value)}
            placeholder="Buscar por Cliente"
            className="w-full rounded-xl border border-white/10 bg-secondary py-3 pl-10 pr-4 text-foreground outline-none transition-colors focus:border-primary"
          />
        </div>

        {/* Filtrar por Serviço */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={searchService}
            onChange={(event) => setSearchService(event.target.value)}
            placeholder="Buscar por Serviço"
            className="w-full rounded-xl border border-white/10 bg-secondary py-3 pl-10 pr-4 text-foreground outline-none transition-colors focus:border-primary"
          />
        </div>
      </div>

      <section
        className="w-full max-w-[900px] mx-auto mt-6"
        aria-label="Lista de serviços"
      >
        <ul className="flex flex-col gap-3">
          {payments.length === 0 ? (
            <div className="flex min-h-screen flex-col items-center gap-2">
              <h2 className="text-center text-base font-semibold">
                Você ainda não tem Ordem de Serviço
              </h2>
              <p className="text-center">
                Suas OS cadastradas aparecerão aqui. Adicione o primeiro para
                começar.
              </p>
              <Link
                to="/payments/create"
                className="bg-primary rounded-xl px-4 py-3 inline-flex items-center justify-center gap-2 shrink-0"
              >
                <Plus size={18} strokeWidth={2.5} />
                <span className="text-base font-semibold">
                  Criar Ordem de Serviço
                </span>
              </Link>
            </div>
          ) : filteredPayments.length === 0 ? (
            <p className="text-center">Nenhum resultado encontrado</p>
          ) : (
            filteredPayments.map((payment) => {
              const total = payment.items.reduce((acc, item) => {
                return acc + Number(String(item.price).replace(",", "."));
              }, 0);

              return (
                <li key={payment.id}>
                  <article className="relative rounded-xl bg-secondary p-4">
                    <header className="flex items-center justify-between gap-4 border-b border-white/[0.08] pb-3">
                      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground text-foreground/50">
                            Cliente
                          </span>
                          <h2 className="text-base font-semibold">
                            {payment.client.name}
                          </h2>
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground text-foreground/50">
                            Data
                          </span>
                          <div className="flex gap-2 text-sm">
                            <span>{formatDate(payment.date)}</span>
                            <span className="text-muted-foreground">
                              {payment.time}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground text-foreground/50">
                            Status
                          </span>
                          <div className="flex gap-2 text-sm">
                            <span
                              className={`rounded-full px-3 ${paymentStatusConfig[payment.status].className}`}
                            >
                              {paymentStatusConfig[payment.status].label}
                            </span>
                          </div>
                        </div>

                        <p className="flex flex-col text-base text-muted-foreground">
                          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground text-foreground/50">
                            Total
                          </span>
                          <strong className="text-foreground font-semibold">
                            {formatBRL(total)}
                          </strong>
                        </p>
                      </div>

                      {/* Opções */}
                      <div className="relative">
                        <button
                          type="button"
                          className="bg-foreground/5 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-white/[0.30] hover:text-foreground"
                          aria-label="Opções do pagamento"
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === payment.id ? null : payment.id,
                            )
                          }
                        >
                          <MoreVertical size={20} />
                        </button>

                        {openMenuId === payment.id && (
                          <div
                            ref={menuRef}
                            className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-xl border border-white/2 bg-secondary p-1.5"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedPayment(payment);
                                setOpenMenuId(null);
                              }}
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-primary/10 hover:text-primary"
                            >
                              <Pencil size={16} aria-hidden="true" />
                              <span>Editar OS</span>
                            </button>

                            <div className="my-1 border-t border-white/5" />

                            <button
                              type="button"
                              onClick={() => {
                                deletePayment(payment.id);
                              }}
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                            >
                              <Trash2 size={16} aria-hidden="true" />
                              <span>Excluir OS</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </header>

                    <ul className="mt-3 flex flex-col gap-2">
                      {payment.description && (
                        <div className="mb-4">
                          <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 text-foreground/50">
                            Descrição
                          </h2>
                          <p className="line-clamp-2 text-sm">
                            {payment.description}
                          </p>
                        </div>
                      )}

                      <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 text-foreground/50">
                        Serviços
                      </h2>
                      {payment.items.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between gap-4 text-base"
                        >                   
                          <span>{item.name}</span>                
                          <span className="tabular-nums">
                            {formatBRL(item.price)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </article>
                </li>
              );
            })
          )}
        </ul>
      </section>
    </main>
  );
}
