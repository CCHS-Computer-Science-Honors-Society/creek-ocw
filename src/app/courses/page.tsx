import { filterColumn } from "@/lib/utils";
import { db } from "@/server/db";
import { and } from "drizzle-orm";
import { course } from "@/server/db/schema";
import Image from "next/image";
import React from "react";
import { z } from "zod";
import { Card } from "@/components/ui/card";

const searchParamsSchema = z.object({
  subjectId: z.string(),
});
/**
 * An overview of all courses under a subject. i.e AP Bio and Honors Bio under Biology
 *
 * @see https://github.com/ani-0/creek-ocw/issues/1
 * */
export default async function Page(params: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  // name = {value}.contains
  const { subjectId } = searchParamsSchema.parse(params.searchParams);
  const data = await db.query.course.findMany({
    where: (course, { eq }) => eq(course.subjectId, subjectId),
    with: {
      subject: true,
    },
  });

  return (
    <div className="flex h-screen items-center justify-center">
      {data.map((course) => (
        <Card
          key={course.id}
          className="flex w-2/3 flex-col bg-primary-foreground transition-transform duration-200 hover:scale-105 hover:bg-muted md:flex-row"
        >
          <div className="md:w-1/3">
            <Image
              src={course.image}
              alt="Course Image"
              className="h-auto w-full" // Ensure image takes the full width and height adjusts automatically
              height={500}
              width={500}
            />
          </div>
          <div className="flex flex-col p-4 md:w-2/3">
            <h1 className="truncate text-2xl font-bold md:text-3xl">
              {course.name}
            </h1>{" "}
            {/* Truncate long text */}
            <p className="overflow-hidden text-ellipsis text-sm md:text-base">
              {course.description}
            </p>{" "}
            {/* Handle text overflow */}
            <div className="mt-12">
              <p className="text-xs text-gray-600 md:text-sm">
                Subject: {course.subject.name}
              </p>
              <p className="text-xs text-gray-600 md:text-sm">
                Category: {course.subject.catagory}
              </p>
              <p className="text-xs text-gray-600 md:text-sm">
                Created At: {course.createdAt.toDateString()}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
