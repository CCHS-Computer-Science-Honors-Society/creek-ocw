/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import TextAlign from "@tiptap/extension-text-align";
/* eslint-disable @typescript-eslint/ban-ts-comment */
import TextareaAutosize from "react-textarea-autosize";
import { useEditor, EditorContent, FloatingMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { editLesson } from "@/server/api/actions/lessons";
import { catchError, cn } from "@/lib/utils";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { type Lesson } from "@/server/db/schema";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { zodResolver } from "@hookform/resolvers/zod";
import { TopBar } from "./TopBar";

export const EditorPage = (props: {
  post: Pick<Lesson, "id" | "title" | "content" | "published">;
}) => {
  const { post } = props;
  const [isPending, startTransition] = React.useTransition();

  const schema = z.object({
    title: z.string().min(0),
  });
  type FormData = z.infer<typeof schema>;
  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const c = post.content ? post.content : "Untitled Post";
  const editor = useEditor({
    extensions: [StarterKit, TextAlign.configure({})],
    content: c,
  });
  if (!editor || editor === undefined || editor === null) return <div></div>;

  function onSubmit(data: FormData) {
    startTransition(() => {
      try {
        const title = data.title;
        void editLesson(editor!.getJSON(), title, post.id);
        toast.success("Saved!");
      } catch (error) {
        catchError(error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid w-full gap-10">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center space-x-10">
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              <>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </>
            </Link>
            <p className="text-sm text-muted-foreground">
              {post.published ? "Published" : "Draft"}
            </p>
          </div>
          <button type="submit" className={cn(buttonVariants())}>
            {isPending && <Skeleton className="mr-2 h-4 w-4 animate-spin" />}
            <span>Save</span>
          </button>
        </div>
        <div className="prose prose-stone dark:prose-invert mx-auto w-[800px]">
          <div>
            <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
              <button
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                className={
                  editor.isActive("heading", { level: 1 }) ? "is-active" : ""
                }
              >
                h1
              </button>
              <button
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={
                  editor.isActive("heading", { level: 2 }) ? "is-active" : ""
                }
              >
                h2
              </button>
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive("bulletList") ? "is-active" : ""}
              >
                bullet list
              </button>
            </FloatingMenu>
            <TextareaAutosize
              autoFocus
              id="title"
              defaultValue={post.title}
              placeholder="Post title"
              className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
              {...register("title")}
            />
            <TopBar editor={editor} />
            <EditorContent className="min-h-[500px]" editor={editor} />
          </div>
          <p className="text-sm text-gray-500">
            Use{" "}
            <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">
              Tab
            </kbd>{" "}
            to open the command menu.
          </p>
        </div>
      </div>
    </form>
  );
};

export default EditorPage;
