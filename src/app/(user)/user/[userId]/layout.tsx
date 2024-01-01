import React from "react";
import { z } from "zod";
import { Picker as SubjectPicker } from "./subjects/Picker";
import { Picker as CoursePicker } from "./courses/Picker";
import { UserPicker } from "./_components/UserPicker";

const searchParamsSchema = z.object({
  courseId: z.string().optional(),
  subjectId: z.string().optional(),
});

export default function Layout(props: {
  children: React.ReactNode;
  searchParams: Record<string, string | string[] | undefined>;
  params: {
    userId: string;
  };
}) {
  const { children, searchParams, params } = props;
  const { userId } = params;

  return (
    <div className="flex flex-col px-40">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <CoursePicker userId={userId} />
          <SubjectPicker userId={userId} />
        </div>
        <UserPicker userId={userId} />
      </div>
      {props.children}
    </div>
  );
}
