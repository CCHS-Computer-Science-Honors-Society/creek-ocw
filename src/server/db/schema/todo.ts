import { int, text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { type InferSelectModel, relations, sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { course } from ".";
import { mysqlTable } from "./table";

export const todo = mysqlTable("todo", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  courseId: text("courseId").notNull(),
});

export const todoRelations = relations(todo, ({ one }) => ({
  course: one(course, {
    fields: [todo.courseId],
    references: [course.id],
  }),
}));

export const createTodoSchema = createInsertSchema(todo).omit({
  id: true,
  createdAt: true,
});

export const deleteTodoSchema = createInsertSchema(todo, {
  id: z.number(),
}).pick({
  id: true,
  courseId: true,
});

export type Todo = InferSelectModel<typeof todo>;
