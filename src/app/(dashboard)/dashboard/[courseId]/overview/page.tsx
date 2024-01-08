import { CreateLesson } from "@/app/_components/create-lesson";
import { CreateUnitForm } from "@/components/forms/units/create-unit-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { db } from "@/server/db";
import { notFound } from "next/navigation";
import React from "react";
import { Todo } from "./Todo";

export default async function Page(props: {
  params: {
    courseId: string;
  };
}) {
  const { courseId } = props.params;
  const course = await db.query.course.findFirst({
    where: (course, { eq }) => eq(course.id, courseId),
  });

  if (!course) {
    return notFound();
  }

  return (
    <div className="p-4">
      <div className="mb-10 text-5xl font-bold">
        Dashboard for {course.name}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-radius col-span-1 shadow-lg md:col-span-2">
          <Todo courseId={courseId} />
        </div>
        <Card className="rounded-radius border border-border shadow">
          <CardHeader className="text-3xl font-bold text-accent-foreground">
            Create a new lesson
          </CardHeader>
          <CardContent>
            <CreateLesson courseId={courseId} />
          </CardContent>
        </Card>
        <Card className="rounded-radius border border-border shadow">
          <CardHeader className="text-3xl font-bold text-accent-foreground">
            Create a Unit
          </CardHeader>
          <CardContent>
            <CreateUnitForm courseId={courseId} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
