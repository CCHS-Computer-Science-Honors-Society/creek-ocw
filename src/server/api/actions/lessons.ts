"use server";
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { db } from "@/server/db";
import { type CreateLesson, lessons } from "@/server/db/schema/lessons";
import { eq } from "drizzle-orm";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function editLesson(content: any, title: string, id: string) {
  await db
    .update(lessons)
    .set({
      content,
      title,
    })
    .where(eq(lessons.id, id));
}

export async function createLesson(lesson: CreateLesson) {
  await db.insert(lessons).values(lesson);
}
