import { postRouter } from "@/server/api/routers/post";
import { createTRPCRouter } from "@/server/api/trpc";
import { coursesRouter } from "./routers/courses";
import { lessonsRouter } from "./routers/lessons";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  courses: coursesRouter,
  post: postRouter,
  lessons: lessonsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
