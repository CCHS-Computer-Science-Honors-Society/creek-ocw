"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { catchError } from "@/lib/utils";
import { deleteTodo } from "@/server/api/actions/todo";
import { type Todo } from "@/server/db/schema";
import { useAction } from "next-safe-action/hook";
import { toast } from "sonner";

export function Rows(props: { todos: Todo[]; courseId: string }) {
  const { todos, courseId } = props;
  const { execute } = useAction(deleteTodo, {
    onSuccess() {
      toast.success("Todo deleted successfully");
    },
    onError(error) {
      catchError(error);
    },
  });
  //FIX: Finish button not working
  return (
    <div className="space-y-8">
      {todos.map((user) => (
        <div key={user.id}>
          <div className="flex items-center justify-between py-2">
            <div>{user.title}</div>
            <div>{user.description}</div>

            <Button
              size={"sm"}
              onSubmit={() =>
                execute({
                  courseId,
                  id: user.id,
                })
              }
            >
              Finished
            </Button>
          </div>
          <Separator orientation="horizontal" />
        </div>
      ))}
    </div>
  );
}
