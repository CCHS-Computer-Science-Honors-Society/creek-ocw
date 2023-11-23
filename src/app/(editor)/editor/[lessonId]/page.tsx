import EditorPage from "@/app/_components/editor";
import { authOptions, getAuth } from "@/server/auth";
import { db } from "@/server/db";
import { notFound, redirect } from "next/navigation";
import React from "react";

interface EditorPageProps {
  params: { lessonId: string };
}
export default async function Page({ params }: EditorPageProps) {
  const user = await getAuth();

  if (!user) {
    redirect(authOptions?.pages?.signIn ?? "/login");
  }

  const lesson = await db.query.lessons.findFirst({
    where: (lesson, { eq }) => eq(lesson.id, params.lessonId),
    columns: {
      id: true,
      title: true,
      content: true,
      published: true,
    },
  });

  if (!lesson) {
    notFound();
  }

  return (
    <div className="p-10">
      <EditorPage post={lesson} />
    </div>
  );
}
