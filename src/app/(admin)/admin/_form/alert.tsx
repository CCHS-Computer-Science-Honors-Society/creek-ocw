"use client";
import { type CourseData, type Course } from "@/app/_components/create-lesson";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn, handleError } from "@/lib/utils";
import { api } from "@/trpc/react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { CheckIcon } from "lucide-react";
import React from "react";
import { useState } from "react";
import { toast } from "sonner";

export function CourseAdminPopver(props: {
  userId: string;
  courses: CourseData[];
}) {
  const { userId, courses } = props;
  const [courseId, setCourseId] = useState<string | null>(null);
  const isDisabled = courseId == null;

  const { mutate } = api.user.updateCoursePermissions.useMutation({
    onSuccess() {
      toast.success("User updated");
    },
    onError(error) {
      handleError(error);
    },
  });
  function onSubmit() {
    if (courseId == null) {
      return;
    }
    mutate({
      userId: userId,
      courseId: courseId,
      permissions: [
        "read:users",
        "add:lessons",
        "add:tags",
        "add:courses",
        "edit:lessons",
        "edit:tags",
        "edit:courses",
      ],
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>Show Dialog</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to give this user admin permissions? They will be able
            to do all admin actions on the selected course. You can make fine
            graided changes by going to the user&aposs page.
          </AlertDialogDescription>
          <PickerForm
            frameworks={courses}
            setValue={setCourseId}
            value={courseId ?? ""}
          />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>

          <AlertDialogAction
            className={cn("bg-red-900 text-white")}
            disabled={isDisabled}
            onClick={() => onSubmit()}
          >
            Grand Admin
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function PickerForm(props: {
  frameworks: CourseData[];
  value: string;
  setValue: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  const { frameworks, value, setValue } = props;

  function handleChange(value: string) {
    setValue(value);
  }
  Array;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? frameworks.find((framework) => framework.id === value)?.name
            : "Select a Course..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search courses..." className="h-9" />
          <CommandEmpty>No Course found.</CommandEmpty>
          <CommandGroup>
            {frameworks.map((framework) => (
              <CommandItem
                key={framework.id}
                value={framework.id}
                onSelect={(currentValue) => {
                  handleChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                {framework.name ?? "Clear"}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === framework.id ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
