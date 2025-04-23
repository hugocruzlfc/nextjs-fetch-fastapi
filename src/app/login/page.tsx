"use client";
import { useAuth } from "@/components/auth-context";
import { API_ROUTES } from "@/lib/constants";
import kyInstance from "@/lib/ky-instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Metadata } from "next";
import { useState } from "react";

export const metadata: Metadata = { title: "" };

export default function Page() {
  const { login } = useAuth();
  const queryClient = useQueryClient();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    login(username, password);
  };

  const { mutate: createUser } = useMutation({
    mutationFn: async (newRoutine) => {
      const response = await kyInstance.post(API_ROUTES.AUTH, {
        json: newRoutine,
      });
      return response.json();
    },
    onMutate: async () => {
      // toast.success(`Post ${data.isBookmarkedByUser ? "un" : ""}bookmarked`);
      login(registerUsername, registerPassword);
    },
    onError(error) {
      console.error(error);
      // toast.error("Something went wrong. Please try again.");
    },
  });

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>

      <h2 className="mt-5">Register</h2>
      <form onSubmit={() => createUser()}>
        <div className="mb-3">
          <label htmlFor="registerUsername" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="registerUsername"
            value={registerUsername}
            onChange={(e) => setRegisterUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="registerPassword" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="registerPassword"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </form>
    </div>
  );
}
