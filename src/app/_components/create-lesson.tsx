import { db } from "@/server/db";
import CreateLessonForm from "./create-lesson-form";

export type Course = {
  label: string;
  value: string;
};

export async function CreateLesson(props: { courseId: string }) {
  const units = await db.query.units.findMany({
    where: (units, { eq }) => eq(units.courseId, props.courseId), // Assuming courseId is a field in your units table
    select: {
      id: true,
      name: true,
    },
  });

  const coursesMap: Course[] = units.map((unit) => ({
    label: unit.name,
    value: unit.id,
  }));

  // Assuming CreateLessonForm is a React component that takes units and courseId as props
  return (
    <div>
      <CreateLessonForm units={coursesMap} courseId={props.courseId} />
    </div>
  );
}
