import React from "react";

export default function Page(props: {
  params: {
    courseId: string;
    unitId: string;
    lessonId: string;
  };
}) {
  const { courseId, unitId, lessonId } = props.params;

  return <div></div>;
}
