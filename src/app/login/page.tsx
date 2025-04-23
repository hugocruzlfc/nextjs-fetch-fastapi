"use client";
import { useAuth } from "@/components/auth-context";
import LoadingButton from "@/components/loading-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import useLoginRegister from "@/hooks/use-login-register";
import { signUpSchema, SignUpValues } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { useForm } from "react-hook-form";

export default function Page() {
  const { login } = useAuth();
  const mutation = useLoginRegister();
  const [loginLoading, setLoginLoading] = useState(false);

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onLogin(values: SignUpValues) {
    setLoginLoading(true);
    await login(values.username, values.password);
    setLoginLoading(false);
  }

  //   const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
  //     e.preventDefault();
  //     login(username, password);
  //   };

  async function onCreateUser(values: SignUpValues) {
    mutation.mutate(
      {
        username: values.username,
        password: values.password,
      },

      {
        onSuccess: () => {
          login(values.username, values.password);
        },
      },
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6 p-10">
      <Card className="w-full md:w-1/2">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onLogin)} className="space-y-3">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Your username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your password"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <LoadingButton type="submit" loading={loginLoading}>
                Login
              </LoadingButton>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Separator />

      <Card className="w-full md:w-1/2">
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onCreateUser)}
              className="space-y-3"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Your username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your password"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <LoadingButton type="submit" loading={mutation.isPending}>
                Register
              </LoadingButton>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
