import { db } from "@/server/db";
import React, { cache } from "react";
import { PickerForm } from "./PickerForm";
import { courseTracker, subjects } from "@/server/db/schema";
import { like, and, eq } from "drizzle-orm";

type SubjectData = {
  value: string;
  label: string;
};

async function getData(userId: string) {
  const data = await db
    .select({ subjects })
    .from(subjects)
    .leftJoin(
      courseTracker,
      and(
        eq(courseTracker.userId, userId),
        like(courseTracker.permissions, "%manage-user%"),
      ),
    );

  return data;
}

const fetch = cache(getData);

export const Picker = async (props: { userId: string }) => {
  const { userId } = props;
  const data = await fetch(userId);

  const subjectData: SubjectData[] = data.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  return (
    <div>
      <PickerForm subjects={subjectData} />
    </div>
  );
};
