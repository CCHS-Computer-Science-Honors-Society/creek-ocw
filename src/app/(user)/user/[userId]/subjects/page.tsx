import { db } from "@/server/db";
import { and, eq } from "drizzle-orm";
import { subjectTracker } from "@/server/db/schema";
import { subjects } from "@/server/db/schema/subjects";
import React, { Suspense } from "react";
import { filterColumn } from "@/lib/utils";
import { z } from "zod";
import { Picker } from "./Picker";
import { Card, CardContent } from "@/components/ui/card";
import { ManageSubjectPermissions } from "@/components/forms/SubjectPermissions";

const searchSchema = z.object({
  s: z.string().optional(),
});

//FIX: refresh page when subject is changed is required to see different permissions?
export default async function Page(props: {
  params: {
    userId: string;
  };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { searchParams } = props;
  const { userId } = props.params;
  const { s } = searchSchema.parse(searchParams);

  const condition = and(
    s ? filterColumn({ column: subjects.id, value: s }) : undefined,
  );

  const id = s ? s : "intro-cs";

  const data = await db
    .select()
    .from(subjects)
    .innerJoin(
      subjectTracker,
      and(
        eq(subjectTracker.userId, userId),
        eq(subjectTracker.subjectId, s ?? id),
      ),
    )
    .where(condition)
    .limit(1);

  if (data.length === 0) {
    await db.insert(subjectTracker).values({
      userId: userId,
      subjectId: id,
      permissions: ["none"],
    });
  }

  const subjectData = data.map((item) => ({
    id: item.subject.id,
    name: item.subject.name,
    userPermissions: item.subject_tracker.permissions,
    image: item.subject.image,
  }))[0]!;

  const permissions = subjectData.userPermissions;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row justify-between">
        <h3 className="text-3xl">{subjectData.name}</h3>

        <Suspense fallback={<div>Loading...</div>}>
          <Picker />
        </Suspense>
      </div>

      <Card className="h-[600px] w-full">
        <CardContent className="overflow-hidden p-4">
          <ManageSubjectPermissions
            subjectId={subjectData.id}
            user={{
              userId: userId,
              currentPermission: permissions,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export const dynamic = "force-dynamic";
