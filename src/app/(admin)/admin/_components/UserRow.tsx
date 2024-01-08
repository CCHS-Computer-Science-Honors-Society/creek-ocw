import { type CourseData } from "@/app/_components/create-lesson";
import { Avatar } from "@/components/ui/avatar";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { UserAvatar } from "@/components/user-avatar";
import { type RouterOutputs } from "@/trpc/shared";
import React from "react";
import { CourseAdminPopver } from "../_form/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const UserRow = (props: {
  courses: CourseData[];
  user: RouterOutputs["admin"]["getUsers"][0];
}) => {
  const { courses, user } = props;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className="gap-5">
          <div className="flex items-center justify-evenly rounded hover:border-x-popover-foreground hover:bg-muted">
            <UserAvatar user={user} />
            <div className="ml-auto px-1 text-sm md:font-medium">
              {user.name}
            </div>
            <p className="ml-auto font-medium">{user.email}</p>
          </div>
          <Separator orientation="horizontal" />
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle className="text-4xl font-medium">
              User: {user.name}
            </DrawerTitle>
            <DrawerDescription>
              Edit user details and manage here.
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-2 px-10">
            <CourseAdminPopver userId={user.id} courses={courses} />
            <Link
              href={`/user/${user.id}/?courseId=intro-cs&subjectId=intro-cs`}
            >
              <Button className="w-full"> Go to user profile </Button>
            </Link>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
