import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { db } from "@/server/db";
import { units } from "@/server/db/schema";
import { asc } from "drizzle-orm";
import Link from "next/link";
import React, { cache } from "react";

/**
 *
 * This allows you to call the same function multiple times while only executing it once
 * @see - https://nextjs.org/docs/app/building-your-application/caching#react-cache-function
 *
 * */
const getUnits = cache(async (courseId: string) => {
  const data = await db.query.units.findMany({
    where: (units, { eq }) => eq(units.courseId, courseId),
    orderBy: asc(units.unitNumber),
    with: {
      lessons: true,
    },
  });

  return data;
});

export default async function Layout(props: {
  params: {
    courseId: string;
  };
  children: React.ReactNode;
}) {
  const { courseId } = props.params;
  const data = await getUnits(courseId);
  function Sidebar() {
    return (
      <div className="p-5">
        {data.map((unit) => {
          return (
            <div key={unit.id}>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value={unit.unitNumber as unknown as string}>
                  <AccordionTrigger>{unit.name}</AccordionTrigger>
                  <AccordionContent>
                    {unit.lessons.map((lesson) => {
                      return (
                        <Link
                          href={`/courses/${courseId}/units/${unit.id}/lessons/${lesson.id}`}
                          key={lesson.id}
                        >
                          {lesson.title}
                        </Link>
                      );
                    })}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          );
        })}
      </div>
    );
  }
  return (
    <div className="flex flex-row">
      <Sidebar />
      {props.children}
    </div>
  );
}
