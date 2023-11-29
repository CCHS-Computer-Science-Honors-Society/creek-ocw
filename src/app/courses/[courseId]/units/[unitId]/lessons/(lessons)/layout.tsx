import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Layout(props: {
  params: {
    courseId: string;
  };
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <div className=" bg-primary-background  flex items-center space-x-10">
        <Link
          href={`/courses/${props.params.courseId}`}
          className={cn(buttonVariants({ variant: "ghost" }))}
        >
          <>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </>
        </Link>
        <p className="text-sm text-muted-foreground"></p>
      </div>
      {props.children}
    </div>
  );
}
