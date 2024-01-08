import { ManageCoursePermissions } from "@/components/forms/Permissions";
import { ManageSubjectPermissions } from "@/components/forms/SubjectPermissions";
import { hasCoursePermission, hasSubjectPermission } from "@/lib/permissions";
import { filterColumn } from "@/lib/utils";
import { checkAuth } from "@/server/auth";
import { db } from "@/server/db";
import {
  course,
  courseTracker,
  subjectTracker,
  subjects,
} from "@/server/db/schema";
import { api } from "@/trpc/server";
import { and, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import React from "react";
import { z } from "zod";

const searchParamsSchema = z.object({
  courseId: z.string().optional(),
  subjectId: z.string().optional(),
});
export default async function Page(props: {
  params: {
    userId: string;
  };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { searchParams } = props;
  const { userId } = props.params;
  const { courseId, subjectId } = searchParamsSchema.parse(searchParams);
  const session = await checkAuth();

  if (!courseId || !subjectId) {
    //TODO: add find course and subject
    console.log("no course or subject");
    notFound();
  }

  // const { hasCoursePermission, hasSubjectPermission } = hasPermission()

  const user = await api.user.byId.query({
    id: userId,
  });

  if (!user) {
    console.log("no user");
    notFound();
  }

  const { courseData, subjectData } = await getData(
    courseId,
    userId,
    subjectId,
  );

  const hasPermissionSubject = hasSubjectPermission(
    session,
    ["modify:users"],
    subjectId,
  );
  const hasPermissionCourse = hasCoursePermission(
    session,
    ["read:users"],
    courseId,
  );

  return (
    <div className="container flex flex-col gap-5 py-10">
      <h1 className="text-center text-4xl font-bold">User: {user.name}</h1>
      <div className="flex justify-evenly gap-10 ">
        <div className="w-full">
          {hasPermissionSubject ? (
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl">{subjectData[0]!.subject.name}</h1>
              <ManageSubjectPermissions
                user={{
                  userId: user.id,
                  currentPermission:
                    subjectData[0]!.subject_tracker.permissions,
                }}
                subjectId={subjectId}
              />
            </div>
          ) : null}
        </div>
        <div className="w-full">
          {hasPermissionCourse ? (
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl">{courseData[0]!.course.name}</h1>
              <ManageCoursePermissions
                user={{
                  userId: user.id,
                  currentPermission: courseData[0]!.courses_tracker.permissions,
                }}
                courseId={courseId}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
async function getData(courseId: string, userId: string, subjectId: string) {
  console.log("courseId", courseId);
  console.log("userId", userId);
  console.log("subjectId", subjectId);
  const conditionCourse = and(
    courseId ? filterColumn({ column: course.id, value: courseId }) : undefined,
  );

  const conditionSubject = and(
    subjectId
      ? filterColumn({ column: subjects.id, value: subjectId })
      : undefined,
  );

  const courseData = await db
    .select()
    .from(course)
    .innerJoin(
      courseTracker,
      and(
        eq(courseTracker.userId, userId),
        eq(courseTracker.courseId, courseId),
      ),
    )
    .where(conditionCourse)
    .limit(1);

  if (courseData.length === 0) {
    await db.insert(courseTracker).values({
      userId: userId,
      courseId: courseId,
      permissions: ["none"],
    });
    redirect(`/user/${userId}/?courseId=${courseId}?subjectId=${subjectId}`);
  }

  const subjectData = await db
    .select()
    .from(subjects)
    .innerJoin(
      subjectTracker,
      and(
        eq(subjectTracker.userId, userId),
        eq(subjectTracker.subjectId, subjectId),
      ),
    )
    .where(conditionSubject)
    .limit(1);

  if (subjectData.length === 0) {
    await db.insert(subjectTracker).values({
      userId: userId,
      subjectId: subjectId,
      permissions: ["none"],
    });
  }

  return {
    courseData,
    subjectData,
  };
}
