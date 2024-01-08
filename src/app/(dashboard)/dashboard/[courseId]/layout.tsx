import { hasCoursePermission } from "@/lib/permissions";
import { checkAuth } from "@/server/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function Layout(props: {
  courseId: string;
  children: React.ReactNode;
}) {
  const { children } = props;

  const session = await checkAuth();

  if (!hasCoursePermission(session, ["add:courses"], props.courseId)) {
    redirect("/deny");
  }
  return <div className="p-10">{children}</div>;
}
