"use server";
import { action } from "@/lib/actions";
import { db } from "@/server/db";
import { createUnitSchema, units } from "@/server/db/schema/units";
import { revalidatePath } from "next/cache";

const createUnit = action(createUnitSchema, async (schema) => {
  await db.insert(units).values(schema);
  revalidatePath(`/dashboard/${schema.courseId}/overview`);
});

export { createUnit };
