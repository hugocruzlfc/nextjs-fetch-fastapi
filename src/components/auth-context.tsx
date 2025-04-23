"use client";

import { API_ROUTES } from "@/lib/constants";
import ky from "ky";

import { useRouter } from "next/navigation";
import { createContext, use, useState } from "react";

type AuthType = {
  access_token: string;
  token_type: string;
};

type AuthContextType = {
  user: AuthType | undefined;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthType | undefined>(undefined);
  const router = useRouter();

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

      console.log(response);
      ky.extend({
        headers: {
          Authorization: `Bearer ${response.access_token}`,
        },
      });
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
    <AuthContext.Provider value={{ user, login, logout }}>
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
