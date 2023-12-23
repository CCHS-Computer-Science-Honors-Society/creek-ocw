"use client";
import { type CourseData, type Course } from "@/app/_components/create-lesson";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { handleError, cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { type RouterOutputs } from "@/trpc/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Dropdown from "./_form/dropdown";

export const UserForm = (props: {
  data: RouterOutputs["admin"]["getUsers"][0];
  courses: CourseData[];
}) => {
  const { data, courses } = props;
  const { mutate } = api.admin.mutateUser.useMutation({
    onSuccess: () => {
      toast.success("User updated");
    },
    onError: (error) => {
      handleError(error);
    },
  });
  const schema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    roles: z.array(z.string()),
  });
  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: data.id,
      name: data.name!,
      email: data.email,
      roles: data.roles,
    },
  });

  function onSubmit(data: FormData) {
    mutate(data);
  }

  return (
    <div className="flex flex-col gap-10 bg-muted" key={data.id}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex gap-10 bg-muted"
          key={data.id}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <Dropdown courses={courses} userId={data.id} />
    </div>
  );
};
