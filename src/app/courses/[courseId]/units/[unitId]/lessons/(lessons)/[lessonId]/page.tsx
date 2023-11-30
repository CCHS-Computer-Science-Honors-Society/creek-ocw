import EditorOutput from "@/app/_components/EditorOutput";
import { db } from "@/server/db";
import { notFound } from "next/navigation";
import React from "react";

export default async function Page(props: {
  params: {
    courseId: string;
    unitId: string;
    lessonId: string;
  };
}) {
  const { courseId, lessonId } = props.params;

  const data = await db.query.lessons.findFirst({
    where: (lessons, { eq, and }) =>
      and(eq(lessons.courseId, courseId), eq(lessons.id, lessonId)),
  });

  if (!data) {
    return notFound();
  }

  return (
    <div>
      <EditorOutput title={data.title} content={data.content} />
    </div>
  );
}
