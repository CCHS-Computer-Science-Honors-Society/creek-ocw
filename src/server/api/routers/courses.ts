import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { lessons, units } from "@/server/db/schema";
import { asc } from "drizzle-orm";

export const coursesRouter = createTRPCRouter({
  getSidebar: publicProcedure
    .input(
      z.object({
        courseId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { courseId } = input;
      const data = await ctx.db.query.units.findMany({
        where: (units, { eq }) => eq(units.courseId, courseId),
        orderBy: asc(units.unitNumber),
        with: {
          lessons: {
            orderBy: asc(lessons.position),
          },
        },
      });

      return data;
    }),
});
