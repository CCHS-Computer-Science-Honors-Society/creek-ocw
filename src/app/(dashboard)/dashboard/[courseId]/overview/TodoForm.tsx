"use client";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { handleError } from "@/lib/utils";
import { createTodo } from "@/server/api/actions/todo";
import { createTodoSchema } from "@/server/db/schema";
import { useAction } from "next-safe-action/hook";
import React from "react";
import { toast } from "sonner";

export default function TodoForm(props: { courseId: string }) {
  const { courseId } = props;
  const { execute } = useAction(createTodo, {
    onSuccess: () => {
      toast.success("Todo created");
    },
    onError: (err) => {
      handleError(err);
    },
  });
  return (
    <div>
      <AutoForm
        formSchema={createTodoSchema.omit({ courseId: true })}
        onSubmit={(v) => {
          execute({ ...v, courseId });
        }}
      >
        <AutoFormSubmit />
      </AutoForm>
    </div>
  );
}
