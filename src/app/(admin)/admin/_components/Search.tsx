"use client";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

export function EmailSearch() {
  const router = useRouter();
  const pathname = usePathname();

  function handleChange(v: string) {
    if (v == "" || v == " ") {
      router.push(pathname);
    }
    router.push(`${pathname}/?email=${v}`);
  }

  return (
    <div className="w-full md:w-1/2">
      <Input
        className="h-[32px]  md:h-12"
        placeholder="Email: email@email.com"
        onChange={(event) => handleChange(event.target.value)}
      />
    </div>
  );
}

export function NameSearch() {
  const router = useRouter();
  const pathname = usePathname();

  function handleChange(v: string) {
    if (v == "" || v == " ") {
      router.push(pathname);
    }
    router.push(`${pathname}/?name=${v}`);
  }

  return (
    <div className="w-full md:w-1/2">
      <Input
        className="h-[32px] md:h-12"
        onChange={(event) => handleChange(event.target.value)}
        placeholder="Name: John Doe"
      />
    </div>
  );
}
