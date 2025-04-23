"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { API_ROUTES } from "@/lib/constants";
import { Workout } from "@/lib/types";
import { CreateRoutineValues, createRoutineSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "./auth-context";
import LoadingButton from "./loading-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

export default function CreateRoutineForm() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const userId = user?.access_token;

  const queryWorkouts = useQuery({
    queryKey: ["workouts", userId],
    queryFn: () =>
      ky
        .get(API_ROUTES.WORKOUTS, {
          headers: { Authorization: `Bearer ${user?.access_token}` },
        })
        .json<Workout[]>(),
    enabled: !!userId,
    staleTime: Infinity,
  });

  const form = useForm<CreateRoutineValues>({
    resolver: zodResolver(createRoutineSchema),
    defaultValues: {
      name: "",
      description: "",
      workouts: [],
    },
  });

  console.log(queryWorkouts);

  async function onLogin(values: CreateRoutineValues) {}

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="space-y-2 px-4"
    >
      <div className="flex items-center justify-between space-x-4">
        <h4 className="text-sm font-semibold">Create Routine</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="space-y-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onLogin)} className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Routine name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about the routine"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="workouts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workouts</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select workout" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {queryWorkouts.data?.map((workout) => (
                        <SelectItem key={workout.id} value={workout.id}>
                          {workout.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <LoadingButton type="submit" loading={false}>
                Create
              </LoadingButton>
            </div>
          </form>
        </Form>
      </CollapsibleContent>
    </Collapsible>
  );
}
