import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";
import TodoForm from "./TodoForm";
import { db } from "@/server/db";
import { Rows } from "./Row";

export const Todo = async (props: { courseId: string }) => {
  const { courseId } = props;
  const data = await db.query.todo.findMany({
    where: (todo, { eq }) => eq(todo.courseId, courseId),
  });

  return (
    <div>
      <Card className="rounded-radius col-span-1 border border-border shadow-lg md:col-span-2">
        <CardHeader className="flex flex-row  justify-between">
          <div className="text-3xl font-bold">Todos</div>

          <div className="flex gap-2">
            <Button variant={"outline"} className="mr-2">
              Marked as Done
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant={"outline"} className="mr-2">
                  Add
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogTitle className="text-2xl font-bold">
                  Add a new TODO
                </AlertDialogTitle>
                <AlertDialogDescription>
                  <TodoForm courseId={courseId} />
                </AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogCancel> Close </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
        <CardContent>
          <Rows todos={data} courseId={courseId} />
        </CardContent>
      </Card>
    </div>
  );
};
