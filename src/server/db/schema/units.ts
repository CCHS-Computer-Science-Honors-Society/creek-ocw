import { relations, sql } from "drizzle-orm";
import { int, text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { lessons } from "./lessons";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { course } from ".";
import { mysqlTable } from "./table";

export const units = mysqlTable("unit", {
  id: int("id").primaryKey().autoincrement().notNull(),
  unitNumber: int("unitNumber").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  courseId: text("courseId").notNull(),
});

export const unitsRelations = relations(units, ({ one, many }) => ({
  course: one(course, { fields: [units.courseId], references: [course.id] }),
  lessons: many(lessons),
}));

export const createUnitSchema = createInsertSchema(units, {
  unitNumber: z.number(),
}).omit({
  createdAt: true,
});
