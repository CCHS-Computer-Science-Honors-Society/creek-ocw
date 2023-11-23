/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import TextAlign from "@tiptap/extension-text-align";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function EditorOutput(props: { content: any }) {
  const content = props.content || "hello world";
  const editor = useEditor({
    extensions: [StarterKit, TextAlign.configure({})],
    content: content,
    editable: false,
  });

  return <EditorContent editor={editor} />;
}
