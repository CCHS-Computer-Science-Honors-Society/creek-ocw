import { db } from "@/server/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

export default async function Layout(props: {
  children: React.ReactNode;
  searchParams: Record<string, string | string[] | undefined>;
  params: {
    userId: string;
  };
}) {
  const { children, searchParams, params } = props;
  const { userId } = params;

  //TODO: move data fetching to trpc
  const user = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.id, userId),
    columns: {
      name: true,
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-10 p-20">
      <div className="flex flex-row justify-between gap-4">
        <div className="flex w-[300px] flex-row gap-2">
          <Link
            href={`/user/${userId}/courses?c=intro-cs`}
            className="flex h-10 w-1/2 items-center justify-center rounded-lg border px-2 text-xl font-bold"
            aria-label="Courses"
          >
            Courses
          </Link>
          <Link
            href={`/user/${userId}/subjects`}
            className="flex h-10 w-1/2 items-center justify-center rounded-lg border px-2 text-xl font-bold"
            aria-label="Subjects"
          >
            Subjects
          </Link>
        </div>
        <h1 className="text-2xl font-bold">{user.name ?? ""}</h1>
      </div>
      {children}
    </div>
  );
}
