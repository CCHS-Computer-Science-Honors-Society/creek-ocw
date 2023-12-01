"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { options } from "prettier-plugin-tailwindcss";

export default function SignIn(props: {
  className?: string;
  callback?: string;
}) {
  const { className, callback } = props;
  return (
    <Button
      onClick={() =>
        signIn("google", { callbackUrl: callback ?? window.location.href })
      }
      className={className ? className : "w-full text-white"}
      variant="outline"
    >
      <div className="flex items-center justify-center">
        <IconGoogle className="mr-2 h-5 w-5" />
        Login with Google
      </div>
    </Button>
  );
}

function IconGoogle(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>
  );
}

export const BackButton = (props: {
  className?: string;
  callback?: string;
}) => {
  const { className, callback } = props;
  const router = useRouter();
  return (
    <Button
      onClick={() => router.back()}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "absolute left-4 top-4 md:left-8 md:top-8",
      )}
    >
      <>
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </>
    </Button>
  );
};
