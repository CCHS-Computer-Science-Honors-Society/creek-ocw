import { db } from "@/server/db";
import { and, eq } from "drizzle-orm";
import { courseTracker } from "@/server/db/schema";
import { course } from "@/server/db/schema/course";
import React, { Suspense } from "react";
import { filterColumn } from "@/lib/utils";
import { z } from "zod";
import { Picker } from "./Picker";
import { Card, CardContent } from "@/components/ui/card";
import { ManagePermissions } from "@/components/forms/Permissions";

const searchSchema = z.object({
  c: z.string().optional(),
});

export default async function Page(props: {
  params: {
    userId: string;
  };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { searchParams } = props;
  const { userId } = props.params;
  const { c } = searchSchema.parse(searchParams);

  const condition = and(
    c ? filterColumn({ column: course.id, value: c }) : undefined,
  );

  const id = c ? c : "intro-cs";

  const data = await db
    .select()
    .from(course)
    .innerJoin(
      courseTracker,
      and(
        eq(courseTracker.userId, userId),
        eq(courseTracker.courseId, c ?? id),
      ),
    )
    .where(condition)
    .limit(1);

  if (data.length === 0) {
    await db.insert(courseTracker).values({
      userId: userId,
      courseId: id,
      permissions: ["none"],
    });
  }

  const courseData = data.map((item) => ({
    id: item.course.id,
    name: item.course.name,
    userPermissions: item.courses_tracker.permissions,
    description: item.course.description,
    image: item.course.image,
  }))[0]!;

  const permissions = courseData.userPermissions;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row justify-between">
        <h3 className="text-3xl">{courseData.name}</h3>

        <Suspense fallback={<div>Loading...</div>}>
          <Picker />
        </Suspense>
      </div>

      <Card className="h-[600px] w-full">
        <CardContent className="overflow-hidden p-4">
          <ManagePermissions
            courseId={courseData.id}
            user={{
              userId: userId,
              currentPermission: permissions,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
