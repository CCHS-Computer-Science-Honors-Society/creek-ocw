import { and, eq, like } from "drizzle-orm";
import { db } from "@/server/db";
import React, { cache } from "react";
import { PickerForm } from "./PickerForm";
import { course, courseTracker } from "@/server/db/schema";

type CourseData = {
  value: string;
  label: string;
};

async function getData(userId: string) {
  const data = await db
    .select({
      course,
    })
    .from(course)
    .leftJoin(
      courseTracker,
      and(
        eq(courseTracker.userId, userId),
        like(courseTracker.permissions, "%read:user%"),
      ),
    );

  return data;
}

const fetch = cache(getData);

export const Picker = async (props: { userId: string }) => {
  const { userId } = props;
  const data = await fetch(userId);
  const courseData = data.map((course) => ({
    value: course.course.id,
    label: course.course.name,
  }));

  return (
    <div>
      <PickerForm frameworks={courseData} />
    </div>
  );
};
