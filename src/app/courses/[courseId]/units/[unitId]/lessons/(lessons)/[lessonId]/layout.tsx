import { db } from "@/server/db";
import { lessons, units } from "@/server/db/schema";
import { asc } from "drizzle-orm";
import React, { cache } from "react";
import Sidebar from "@/components/Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChevronRight } from "lucide-react";

const getUnits = cache(async (courseId: string) => {
  const data = await db.query.units.findMany({
    where: (units, { eq }) => eq(units.courseId, courseId),
    orderBy: asc(units.unitNumber),
    with: {
      lessons: {
        orderBy: asc(lessons.position),
      },
    },
  });

  return data;
});

export default async function Layout(props: {
  params: {
    courseId: string;
    lessonId: string;
    unitId: string;
  };
  children: React.ReactNode;
}) {
  const { courseId, lessonId } = props.params;
  const data = await getUnits(courseId);

  return (
    <div className="">
      <div className="flex flex-row">
        <div className="block md:hidden">
          <Sheet>
            <SheetTrigger className="flex h-screen w-[24px] flex-col items-center justify-center px-3 ">
              <ChevronRight size={24} />
            </SheetTrigger>
            <SheetContent side={"left"} className="bg-primary-foreground">
              <Sidebar data={data} lessonId={lessonId} courseId={courseId} />
            </SheetContent>
          </Sheet>
        </div>
        <div className="hidden md:block">
          <Sidebar data={data} lessonId={lessonId} courseId={courseId} />
        </div>
        <div className="p-10">{props.children}</div>
      </div>
    </div>
  );
}
