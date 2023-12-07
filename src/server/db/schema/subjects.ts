import { type InferSelectModel, relations, sql } from "drizzle-orm";
import { mysqlEnum, text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { subjectTracker } from "./permissions";
import { course } from ".";
import { mysqlTable } from "./table";

// subject: Biology, course: AP Biology, unit: Unit 1, lesson: Lesson 1
export const subjects = mysqlTable("subject", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  image: text("image").default("/placeholder.jpg").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  catagory: mysqlEnum("catagory", [
    "Math",
    "Science",
    "Computer Science",
    "Social Studies",
    "World Languages",
    "English",
    "Debate",
  ])
    .notNull()
    .default("Computer Science"),
});

export const subjectsRelations = relations(subjects, ({ many }) => ({
  courses: many(course),
  trackers: many(subjectTracker),
}));

export type Subject = InferSelectModel<typeof subjects>;
