import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { env } from "@/env.mjs";
import { db } from "@/server/db";
import { mysqlTable } from "@/server/db/schema";

import {
  type CoursePermission,
  type SubjectPermission,
  type Permissions,
} from "./permissions";
import { redirect } from "next/navigation";

type CoursePerms = {
  id: string;
  roles: CoursePermission[];
};

type SubjectPerms = {
  id: string;
  roles: SubjectPermission[];
};

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      permissions: Permissions;
      // role: UserRole;
      courses: CoursePerms[];
      subjects: SubjectPerms[];
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

export async function getPermissions(userId: string): Promise<Permissions> {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
    columns: {
      roles: true,
    },
  });

  if (!user) {
    throw new Error(`User not found: ${userId}`);
  }

  return user.roles;
}

export async function getCoursePermissions(
  userId: string,
): Promise<CoursePerms[]> {
  const courses = await db.query.courseTracker.findMany({
    where: (courseTracker, { eq }) => eq(courseTracker.userId, userId),
  });

  return courses.map(({ courseId, permissions }) => ({
    id: courseId,
    roles: permissions,
  }));
}

export async function getSubjectPermissions(
  userId: string,
): Promise<SubjectPerms[]> {
  const subjects = await db.query.subjectTracker.findMany({
    where: (subjectTracker, { eq }) => eq(subjectTracker.userId, userId),
  });

  return subjects.map(({ subjectId, permissions }) => ({
    id: subjectId,
    roles: permissions,
  }));
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: async ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        permissions: await getPermissions(user.id),
        courses: await getCoursePermissions(user.id),
        subjects: await getSubjectPermissions(user.id),
      },
    }),
  },
  pages: {
    signIn: "/login",
  },
  adapter: DrizzleAdapter(db, mysqlTable),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getAuth = () => getServerSession(authOptions);

export const checkAuth = async (
  permissionsRequired?:
    | Permissions[]
    | CoursePermission[]
    | SubjectPermission[],
) => {
  const user = await getAuth();

  // match the type of permissionsRequired to call a func
  if (permissionsRequired) {
    if (typeof permissionsRequired === Permissions[]) {
    } else if (typeof permissionsRequired === CoursePermission[]) {
    } else if (typeof permissionsRequired === SubjectPermission[]) {
    }
  }
  if (!user) {
    redirect(authOptions?.pages?.signIn ?? "/login");
  }
};
