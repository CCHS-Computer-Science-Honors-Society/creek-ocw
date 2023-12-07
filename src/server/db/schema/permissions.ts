import { primaryKey, varchar } from "drizzle-orm/mysql-core";
import { course, subjects, users } from "./index";
import { relations } from "drizzle-orm";
import { mysqlTable } from "./table";

export const subjectTracker = mysqlTable(
  "subject_tracker",
  {
    userId: varchar("userId", {
      length: 255,
    }).notNull(),
    courseId: varchar("course", {
      length: 255,
    }).notNull(),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.courseId),
  }),
);

export const subjectTrackerRelations = relations(subjectTracker, ({ one }) => ({
  user: one(users, {
    fields: [subjectTracker.userId],
    references: [users.id],
  }),
  subject: one(subjects, {
    fields: [subjectTracker.courseId],
    references: [subjects.id],
  }),
}));

export const courseTracker = mysqlTable(
  "courses_tracker",
  {
    userId: varchar("userId", {
      length: 255,
    }).notNull(),
    courseId: varchar("courseId", {
      length: 255,
    }).notNull(),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.courseId),
  }),
);

export const subjectRelations = relations(courseTracker, ({ one }) => ({
  user: one(users, {
    fields: [courseTracker.userId],
    references: [users.id],
  }),
  course: one(course, {
    fields: [courseTracker.courseId],
    references: [course.id],
  }),
}));
