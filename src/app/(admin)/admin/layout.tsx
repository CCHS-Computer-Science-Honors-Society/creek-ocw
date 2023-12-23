import { hasPermission } from "@/lib/permissions";
import { checkAuth } from "@/server/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function Layout(props: { children: React.ReactNode }) {
  const { children } = props;
  const auth = await checkAuth();

  console.log(auth.user.permissions);
  if (!hasPermission(auth, ["activites"])) {
    redirect("/login");
  }

  return <div>{children}</div>;
}
