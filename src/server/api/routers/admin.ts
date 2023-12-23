import { filterColumn } from "@/lib/utils";
import { users } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { type Permissions } from "@/server/permissions";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const adminRouter = createTRPCRouter({
  getUsers: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        email: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { name, email } = input;
      const condition = and(
        name ? filterColumn({ column: users.name, value: name }) : undefined,
        email ? filterColumn({ column: users.email, value: email }) : undefined,
      );

      const data = await ctx.db.query.users.findMany({
        where: condition,
      });

      return data;
    }),
  mutateUser: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().nullable(),
        email: z.string(),
        roles: z.array(z.string()),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .update(users)
        .set({
          id: input.id,
          name: input.name,
          email: input.email,
          roles: input.roles as Permissions,
        })
        .where(eq(users.id, input.id));
    }),

  fetchUserData: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { userId } = input;

      const { permissions, courseTrackers, subjectTrackers } =
        await ctx.db.transaction(async (tx) => {
          const permissions = await tx.query.users.findFirst({
            where: eq(users.id, userId),
            columns: {
              roles: true,
            },
          });

          const courseTrackers = await tx.query.courseTracker.findMany({
            where: eq(users.id, userId),
          });

          const subjectTrackers = await tx.query.subjectTracker.findMany({
            where: eq(users.id, userId),
          });

          return { permissions, courseTrackers, subjectTrackers };
        });

      return {
        permissions: permissions?.roles ?? [],
        courseTrackers: courseTrackers,
        subjectTrackers: subjectTrackers,
      };
    }),
});
