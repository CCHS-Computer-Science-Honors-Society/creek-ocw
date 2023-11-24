import { CreateLesson } from "@/app/_components/create-lesson";
import { CreateUnitForm } from "@/components/forms/units/create-unit-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { db } from "@/server/db";
import { notFound } from "next/navigation";
import React from "react";

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
    <div className="grid grid-cols-2 grid-rows-4 gap-4 p-10">
      <Card className="col-start-2 row-span-2 row-start-1">
        <CardHeader className="text-4xl font-bold ">
          Create a new lesson
        </CardHeader>
        <CardContent>
          <CreateLesson courseId={courseId} />
        </CardContent>
      </Card>
      <Card className="col-start-2 row-span-2 row-start-3">
        <CardHeader className="text-4xl font-bold ">Create a Unit</CardHeader>
        <CardContent>
          <CreateUnitForm courseId={courseId} />
        </CardContent>
      </Card>
      <Card className="col-start-1 row-span-4 row-start-1">
        <CardHeader className="text-4xl font-bold">
          Recent activity for {course.name}
        </CardHeader>
      </Card>
    </div>
  );
}
