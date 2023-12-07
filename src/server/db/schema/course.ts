import { text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { type InferSelectModel, relations, sql } from "drizzle-orm";
import { lessons } from "./lessons";
import { subjects } from "./subjects";
import { units } from "./units";
import { courseTracker } from "./permissions";
import { todo } from "./todo";
import { mysqlTable } from "./table";

export const course = mysqlTable("course", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  subjectId: text("subjectId").notNull(),
  image: text("image").default("/placeholder.jpg").notNull(),
});

export const courseRelations = relations(course, ({ many, one }) => ({
  lessons: many(lessons),
  subject: one(subjects, {
    fields: [course.subjectId],
    references: [subjects.id],
  }),
  units: many(units),
  trackers: many(courseTracker),
  todos: many(todo),
}));

export type Course = InferSelectModel<typeof course>;
