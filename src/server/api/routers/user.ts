import { courseTracker } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { hasCoursePermission, hasSubjectPermission } from "@/lib/permissions";
import { type CoursePermission } from "@/server/permissions";
import { revalidatePath } from "next/cache";

export const userRouter = createTRPCRouter({
  updateCoursePermissions: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
        permissions: z.array(z.string()),
        userId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { courseId, permissions, userId } = input;

      if (
        hasCoursePermission(ctx.session, ["read:users"], courseId) === false
      ) {
        throw new Error("You do not have permission to manage this course");
      }

      await ctx.db
        .update(courseTracker)
        .set({
          permissions: permissions as CoursePermission[],
        })
        .where(
          and(
            eq(courseTracker.userId, userId),
            eq(courseTracker.courseId, courseId),
          ),
        );
      revalidatePath(`/users/${userId}/courses`);
    }),

  updateSubjectPermissions: protectedProcedure
    .input(
      z.object({
        subjectId: z.string(),
        permissions: z.array(z.string()),
        userId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { subjectId, permissions, userId } = input;
      if (
        hasSubjectPermission(ctx.session, ["read:users"], subjectId) === false
      ) {
        throw new Error("You do not have permission to manage this subject");
      }
      await ctx.db
        .update(courseTracker)
        .set({
          permissions: permissions as CoursePermission[],
        })
        .where(
          and(
            eq(courseTracker.userId, userId),
            eq(courseTracker.courseId, subjectId),
          ),
        );
      revalidatePath(`/users/${userId}/subjects`);
    }),
});
