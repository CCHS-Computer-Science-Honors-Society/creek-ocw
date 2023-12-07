import {
  boolean,
  int,
  json,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { type InferSelectModel, relations, sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { course, units } from ".";
import { mysqlTable } from "./table";

export const lessons = mysqlTable(
  "lesson",
  {
    id: varchar("id", { length: 255 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    published: boolean("published").notNull().default(true),
    content: json("content"),
    position: int("position").default(1).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    courseId: varchar("courseId", { length: 255 }).notNull(),
    unitId: int("unitId").notNull(),
    images: text("images").$type<string[]>(),
  },
  (lesson) => ({
    pk: primaryKey(lesson.id, lesson.courseId),
  }),
);

export const lessonsRelations = relations(lessons, ({ one }) => ({
  course: one(course, { fields: [lessons.courseId], references: [course.id] }),
  unit: one(units, { fields: [lessons.unitId], references: [units.id] }),
}));

export type Lesson = InferSelectModel<typeof lessons>;

export const createLessonSchema = createInsertSchema(lessons, {
  published: z.boolean().default(false),
}).omit({
  createdAt: true,
});

export const createLessonSchemaWithoutCourseId = createInsertSchema(
  lessons,
).omit({
  createdAt: true,
  courseId: true,
  published: true,
  content: true,
  id: true,
});

export type CreateLesson = z.infer<typeof createLessonSchema>;
