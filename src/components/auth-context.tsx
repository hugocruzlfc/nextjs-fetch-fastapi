"use client";

import { API_ROUTES } from "@/lib/constants";
import ky from "ky";

import { useRouter } from "next/navigation";
import { createContext, use, useEffect, useState } from "react";

type AuthType = {
  access_token: string;
  token_type: string;
};

type AuthContextType = {
  user: AuthType | undefined;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthType | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          setUser({ access_token: token, token_type: "Bearer" });
        }
      } catch (error) {
        console.error("Error initializing user:", error);
      } finally {
        setLoading(false); // Finaliza la carga
      }
    };

    initializeUser();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      const response = await ky
        .post(API_ROUTES.LOGIN, {
          body: formData,
        })
        .json<AuthType>();
      localStorage.setItem("token", response.access_token);
      setUser(response);
      router.push("/");
    } catch (error) {
      console.log("Login Failed:", error);
    }
  };

  const logout = () => {
    setUser(undefined);
    ky.extend({
      headers: {
        Authorization: undefined,
      },
    });
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = use(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
