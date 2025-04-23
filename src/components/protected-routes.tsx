"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { ReactNode } from "react";
import { useAuth } from "./auth-context";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  return user ? children : null;
};

export default ProtectedRoute;
