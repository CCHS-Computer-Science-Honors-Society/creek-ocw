import { db } from "@/server/db";
import React, { cache } from "react";
import { PickerForm } from "./PickerForm";

type CourseData = {
  value: string;
  label: string;
};

async function getData() {
  const data = await db.query.course.findMany({
    columns: {
      id: true,
      name: true,
    },
  });

  return data;
}

const fetch = cache(getData);

export const Picker = async () => {
  const data = await fetch();

  const courseData: CourseData[] = data.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  return (
    <div>
      <PickerForm frameworks={courseData} />
    </div>
  );
};
