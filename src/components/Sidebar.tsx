"use client";
import React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { type RouterOutputs } from "@/trpc/shared";
import Link from "next/link";

export default function Sidebar(props: {
  data: RouterOutputs["courses"]["getSidebar"];
  lessonId: string;
  courseId: string;
  isMobile?: boolean;
}) {
  const { data, lessonId, courseId, isMobile } = props;
  return (
    <div
      className={
        isMobile
          ? "min-h-screen  w-full bg-primary-foreground p-5"
          : "min-h-screen  w-64 bg-primary-foreground p-5"
      }
    >
      {data.map((unit) => {
        return (
          <div key={unit.id} className="px-10">
            <Accordion
              type="single"
              collapsible
              defaultValue={unit.id.toString()}
              className="w-full"
            >
              <AccordionItem value={unit.unitNumber as unknown as string}>
                <AccordionTrigger className="text-lg font-semibold">
                  {unit.name}
                </AccordionTrigger>
                <AccordionContent className="mt-2">
                  {unit.lessons.map((lesson) => {
                    return (
                      <Link
                        href={`/courses/${courseId}/units/${unit.id}/lessons/${lesson.id}`}
                        key={lesson.id}
                        className={`block py-2 text-sm ${
                          lessonId == lesson.id
                            ? "font-semibold text-blue-500"
                            : "text-gray-600 hover:text-blue-500"
                        }`}
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
