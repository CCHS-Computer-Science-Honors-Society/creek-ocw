import React from "react";
import { UserAccountNav } from "./user-account-nav";
import { getAuth } from "@/server/auth";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

export default async function SiteNav() {
  const session = await getAuth();

  return (
    <div className="flex h-[42px] w-full flex-row justify-between p-4">
      <div></div>

      {session ? (
        <UserAccountNav user={session?.user} />
      ) : (
        <Link
          href={`/login`}
          className={cn(
            buttonVariants({ variant: "secondary", size: "sm" }),
            "px-4",
          )}
        >
          Login
        </Link>
      )}
    </div>
  );
}
