import { type InferSelectModel, relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { type AdapterAccount } from "next-auth/adapters";
import { z } from "zod";
import { type Permissions } from "../permissions";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

export const mysqlTable = mysqlTableCreator((table) => `creek-ocw_${table}`);

export const users = mysqlTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar("image", { length: 255 }),
  roles: json("roles").$type<Permissions>().default(["basics"]).notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = mysqlTable(
  "account",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
    userIdIdx: index("userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = mysqlTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = mysqlTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);

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
  todos: many(todo),
}));

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

export type Subject = InferSelectModel<typeof subjects>;

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

export const createUnitSchema = createInsertSchema(units, {
  unitNumber: z.number(),
}).omit({
  createdAt: true,
});

export type Lesson = InferSelectModel<typeof lessons>;

export type Course = InferSelectModel<typeof course>;

export const createLessonSchema = createInsertSchema(lessons).omit({
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
