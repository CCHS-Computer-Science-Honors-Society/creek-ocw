"use client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { CheckIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

type SubjectData = {
  value: string;
  label: string;
};

export function PickerForm(props: { subjects: SubjectData[] }) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = React.useState(
    searchParams.get("subjectId") ?? "None",
  );
  const { subjects } = props;

  function handleChange(value: string) {
    if (value === "" || value === " " || value == null || value === "clear") {
      return router.push(pathname);
    }
    setValue(value);
    router.push(`${pathname}/?s=${value}`);
    router.refresh();
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? subjects.find((subject) => subject.value === value)?.label
            : "Select a Subject..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search categories..." className="h-9" />
          <CommandEmpty>No Subject found.</CommandEmpty>
          <CommandGroup>
            {subjects.map((subject) => (
              <CommandItem
                key={subject.value}
                value={subject.value}
                onSelect={(currentValue) => {
                  handleChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                {subject.label ?? "No Item"}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === subject.value ? "opacity-100" : "opacity-0",
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
