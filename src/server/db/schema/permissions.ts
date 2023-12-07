import { primaryKey, text, varchar } from "drizzle-orm/mysql-core";
import { course, subjects, users } from "./index";
import { relations } from "drizzle-orm";
import { mysqlTable } from "./table";
import {
  type SubjectPermission,
  type CoursePermission,
} from "@/server/permissions";

export const subjectTracker = mysqlTable(
  "subject_tracker",
  {
    userId: varchar("userId", {
      length: 255,
    }).notNull(),
    subjectId: varchar("subjectId", {
      length: 255,
    }).notNull(),
    permissions: text("permissions")
      .$type<SubjectPermission[]>()
      .default(["none"])
      .notNull(),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.subjectId),
  }),
);

export const subjectTrackerRelations = relations(subjectTracker, ({ one }) => ({
  user: one(users, {
    fields: [subjectTracker.userId],
    references: [users.id],
  }),
  subject: one(subjects, {
    fields: [subjectTracker.subjectId],
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
    permissions: text("permissions")
      .$type<CoursePermission[]>()
      .default(["none"])
      .notNull(),
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
