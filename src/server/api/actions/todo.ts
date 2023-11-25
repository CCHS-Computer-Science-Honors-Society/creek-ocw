"use server";

import { action } from "@/lib/actions";
import { db } from "@/server/db";
import { createTodoSchema, deleteTodoSchema, todo } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const createTodo = action(createTodoSchema, async (schema) => {
  await db.insert(todo).values(schema);
  revalidatePath(`/dashboard/${schema.courseId}/overview`);
});

export const deleteTodo = action(deleteTodoSchema, async ({ id, courseId }) => {
  await db.delete(todo).where(eq(todo.id, id!));
  revalidatePath(`/dashboard/${courseId}/overview`);
});
