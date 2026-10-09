import { useAuth } from "../../contexts/AuthContext";
import { House, CircleDollarSign, Wrench  } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();

  const dashboardItems = [
    {
      title: "Criar Pagamento",
      description: "Gerencie os usuários do sistema",
      icon: CircleDollarSign,
      path: "/payments",
    },
    {
      title: "Criar e Gerenciar Serviços",
      description: "Cadastre e gerencie os serviços do sistema",
      icon: Wrench,
      path: "/service",
    },
  ];

  return (
    <main className="w-full max-w-[1200px] mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-base text-gray-400">
        <House className="text-primary" size={16} />
        <p className="text-white">Início</p>
      </div>
      <p className="text-xl font-semibold mt-4">Olá, {user?.name}</p>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {dashboardItems.map((item) => (
          <Link
            to={item.path}
            key={item.path}
            className="flex items-center gap-4 rounded-xl bg-secondary text-foreground p-5 border-r-10 border-primary cursor-pointer transition-all duration-300 hover:border-r-30 hover:scale-102"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#333]">
              <item.icon size={24} className="text-primary" />
            </div>

            <div>
              <p className="text-sm text-gray-600">Acessar</p>
              <h2 className="font-semibold">{item.title}</h2>
              <p className="mt-1 text-sm text-foreground">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
