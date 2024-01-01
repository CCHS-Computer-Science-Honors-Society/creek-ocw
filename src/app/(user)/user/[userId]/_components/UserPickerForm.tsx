"use client";
import { cn } from "@/lib/utils";
import { type RouterOutputs } from "@/trpc/shared";
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
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";

export const UserPickerForm = (props: {
  data: RouterOutputs["user"]["findAll"];
  userId: string;
}) => {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = React.useState(props.userId ?? "");
  const { data } = props;

  function handleChange(value: string) {
    if (value == "" || value == " " || value == null || value === "clear") {
      return router.push(pathname);
    }
    setValue(value);
    router.push(`/user/${value}/?courseId=intro-cs&subjectId=intro-cs`);
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
            ? data.find((item) => item.id === value)?.name
            : "Select an Item..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search items..." className="h-9" />
          <CommandEmpty>No Item found.</CommandEmpty>
          <CommandGroup>
            {data.map((item) => (
              <CommandItem
                key={item.id}
                value={item.id}
                onSelect={(currentValue) => {
                  handleChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                {item.name ?? "Clear"}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === item.id ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
