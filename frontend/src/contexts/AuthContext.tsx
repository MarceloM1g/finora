import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import api from "../lib/api";

type User = {
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadUser() {
      try {
        const response = await api.get("/auth/me", {
          signal: controller.signal,
        });

        setUser(response.data.user);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error(error);
          setUser(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => controller.abort();
  }, []);

  async function logout() {
    try {
      const response = await api.post("/auth/logout");

      if (response.status !== 200) {
        console.error("Falha ao fazer logout:", response.status);
        return;
      }

      setUser(null);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
}
