import { z } from "zod";
import { db } from "@/server/db";
import { type Subject, subjects } from "@/server/db/schema";
import { and, inArray } from "drizzle-orm";
import { filterColumn } from "@/lib/utils";
import Image from "next/image";
import Search, { ComboboxDemo } from "@/components/search";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { getAuth } from "@/server/auth";

const searchParamsSchema = z.object({
  name: z.string().optional(),
  catagory: z.string().optional(),
});

export default async function Home(props: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { name, catagory } = searchParamsSchema.parse(props.searchParams);
  const session = await getAuth();

  const catagories = (catagory?.split(".") as Subject["catagory"][]) ?? [];

  const condition = and(
    name ? filterColumn({ column: subjects.name, value: name }) : undefined,
    catagories.length > 0 ? inArray(subjects.catagory, catagories) : undefined,
  );

  const data = await db.query.subjects.findMany({
    where: condition,
  });

  return (
    <div className="flex flex-col gap-10 p-20">
      <div className="flex flex-row justify-between">
        <Search />
        <div>
          <ComboboxDemo />
        </div>
      </div>
      <div className="grid grid-rows-1 gap-10 md:grid-cols-2 md:grid-rows-2">
        {data.map((subject) => {
          return (
            <Link key={subject.id} href={`/courses/?subjectId=${subject.id}`}>
              <Card className=" col-span-1 row-span-1 bg-primary-foreground transition-transform duration-200 hover:scale-105 hover:bg-muted">
                <CardContent className="py-5">
                  <Image
                    src={subject.image}
                    width={1000}
                    height={500}
                    alt={subject.id}
                  />
                </CardContent>
                <CardFooter className="justify-center text-center font-bold md:text-2xl">
                  {subject.name} - {subject.catagory}
                </CardFooter>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
