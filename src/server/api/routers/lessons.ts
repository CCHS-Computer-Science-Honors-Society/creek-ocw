/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createLessonSchema, lessons } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const lessonsRouter = createTRPCRouter({
  editLesson: protectedProcedure
    .input(
      z.object({
        content: z.any(),
        title: z.string(),
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { content, title, id } = input;
      await ctx.db
        .update(lessons)
        .set({
          content,
          title,
        })
        .where(eq(lessons.id, id));
    }),
  createLesson: protectedProcedure
    .input(createLessonSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(lessons).values({
        ...input,
      });
    }),
});
