/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import TextAlign from "@tiptap/extension-text-align";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function EditorOutput(props: { content: any; title: string }) {
  const title = props.title || "hello world";
  const content = props.content || "hello world";
  const editor = useEditor({
    extensions: [StarterKit, TextAlign.configure({})],
    content: content,
    editable: false,
  });

  return (
    <div>
      <h1 className="text-5xl font-bold">{title}</h1>
      <EditorContent editor={editor} />
    </div>
  );
}
