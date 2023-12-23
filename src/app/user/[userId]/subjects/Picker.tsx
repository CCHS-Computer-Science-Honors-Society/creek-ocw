import { db } from "@/server/db";
import React, { cache } from "react";
import { PickerForm } from "./PickerForm";

type SubjectData = {
  value: string;
  label: string;
};

async function getData() {
  const data = await db.query.subjects.findMany({
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
