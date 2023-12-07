/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import EditorOutput from "@/app/_components/EditorOutput";
import { db } from "@/server/db";
import { notFound } from "next/navigation";
import React from "react";

export default async function Page(props: {
  params: {
    id: string;
  };
}) {
  const { id } = props.params;

  const lesson = await db.query.lessons.findFirst({
    where: (lessons, { eq }) => eq(lessons.id, id),
  });

  if (!lesson) {
    return notFound();
  }
  return (
    <div>
      <EditorOutput content={lesson.content} title={"itte"}></EditorOutput>
    </div>
  );
}
