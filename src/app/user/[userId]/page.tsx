import { hasPermission } from "@/lib/permissions";
import { checkAuth } from "@/server/auth";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import React from "react";
import { z } from "zod";

const searchParamsSchema = z.object({
  course: z.string().optional(),
});
export default async function Page(props: {
  params: {
    userId: string;
  };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { searchParams } = props;
  const { userId } = props.params;
  const session = await checkAuth();

  const { trackers, courseTrackers, subjectTrackers } =
    await api.admin.fetchUserData.query({
      userId: userId,
    });

  return <div>Page</div>;
}
