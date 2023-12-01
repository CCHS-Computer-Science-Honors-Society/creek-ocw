"use client";
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Editor } from "@tiptap/react";
import React from "react";
import { ToggleGroup } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";

interface MenuBarProps {
  editor: Editor | null;
}

export const TopBar: React.FC<MenuBarProps> = ({ editor }: MenuBarProps) => {
  if (!editor) {
    return null;
  }
  // Map format strings to corresponding editor methods
  const formatActions: Record<string, () => any> = {
    Bold: () => editor.chain().focus().toggleBold(),
    Italic: () => editor.chain().focus().toggleItalic(),
    Strike: () => editor.chain().focus().toggleStrike(),
    Code: () => editor.chain().focus().toggleCode(),
    Paragraph: () => editor.chain().focus().setParagraph(),
    Heading1: () => editor.chain().focus().toggleHeading({ level: 1 }),
    Heading2: () => editor.chain().focus().toggleHeading({ level: 2 }),
    Heading3: () => editor.chain().focus().toggleHeading({ level: 3 }),
    Heading4: () => editor.chain().focus().toggleHeading({ level: 4 }),
    Heading5: () => editor.chain().focus().toggleHeading({ level: 5 }),
    Heading6: () => editor.chain().focus().toggleHeading({ level: 6 }),
    BulletList: () => editor.chain().focus().toggleBulletList(),
    OrderedList: () => editor.chain().focus().toggleOrderedList(),
    CodeBlock: () => editor.chain().focus().toggleCodeBlock(),
    Blockquote: () => editor.chain().focus().toggleBlockquote(),
    HorizontalRule: () => editor.chain().focus().setHorizontalRule(),
    HardBreak: () => editor.chain().focus().setHardBreak(),
    Undo: () => editor.chain().focus().undo(),
    Redo: () => editor.chain().focus().redo(),
    ClearMarks: () => editor.chain().focus().unsetAllMarks(),
    ClearNodes: () => editor.chain().focus().clearNodes(),
    // Add any additional formatting actions you need here
  };
  const toggleFormat = (format: string) => () => {
    const action = formatActions[format];
    if (action) {
      action().run();
    }
  };

  const isActive = (format: string, options: Record<string, any> = {}) => {
    return editor.isActive(format, options) ? "is-active" : "";
  };

  return (
    <ToggleGroup type="multiple">
      <Button
        value="bold"
        type="button"
        variant={"outline"}
        onClick={toggleFormat("Bold")}
        disabled={!editor.can().chain().toggleBold().run()}
        className={isActive("bold")}
      >
        Bold
      </Button>
      <Button
        value="italic"
        onClick={toggleFormat("Italic")}
        disabled={!editor.can().chain().toggleItalic().run()}
        variant={"outline"}
        type="button"
        className={isActive("italic")}
      >
        Italic
      </Button>
      <Button
        value="strike"
        type="button"
        variant={"outline"}
        onClick={toggleFormat("Strike")}
        disabled={!editor.can().chain().toggleStrike().run()}
        className={isActive("strike")}
      >
        Strike
      </Button>
      <Button
        value="code"
        type="button"
        variant={"outline"}
        onClick={toggleFormat("Code")}
        disabled={!editor.can().chain().toggleCode().run()}
        className={isActive("code")}
      >
        Code
      </Button>
      <Button
        value="paragraph"
        type="button"
        variant={"outline"}
        onClick={toggleFormat("Paragraph")}
        className={isActive("paragraph")}
      >
        Paragraph
      </Button>
      <Button
        value="heading1"
        type="button"
        variant={"outline"}
        onClick={toggleFormat("Heading1")}
        className={isActive("heading", { level: 1 })}
      >
        H1
      </Button>
      <Button
        value="heading2"
        variant={"outline"}
        type="button"
        onClick={toggleFormat("Heading2")}
        className={isActive("heading", { level: 2 })}
      >
        H2
      </Button>
      <Button
        value="heading3"
        variant={"outline"}
        type="button"
        onClick={toggleFormat("Heading3")}
        className={isActive("heading", { level: 3 })}
      >
        H3
      </Button>
      <Button
        value="heading4"
        variant={"outline"}
        type="button"
        onClick={toggleFormat("Heading4")}
        className={isActive("heading", { level: 4 })}
      >
        H4
      </Button>
      <Button
        value="heading5"
        variant={"outline"}
        type="button"
        onClick={toggleFormat("Heading5")}
        className={isActive("heading", { level: 5 })}
      >
        H5
      </Button>
      <Button
        value="heading6"
        variant={"outline"}
        type="button"
        onClick={toggleFormat("Heading6")}
        className={isActive("heading", { level: 6 })}
      >
        H6
      </Button>
      <Button
        value="bulletList"
        variant={"outline"}
        type="button"
        onClick={toggleFormat("BulletList")}
        className={isActive("bulletList")}
      >
        Bullet List
      </Button>
      <Button
        value="orderedList"
        variant={"outline"}
        type="button"
        onClick={toggleFormat("OrderedList")}
        className={isActive("orderedList")}
      >
        Ordered List
      </Button>
      <Button
        value="codeBlock"
        type="button"
        variant={"outline"}
        onClick={toggleFormat("CodeBlock")}
        className={isActive("codeBlock")}
      >
        Code Block
      </Button>
      <Button
        type="button"
        variant={"outline"}
        value="blockquote"
        onClick={toggleFormat("Blockquote")}
        className={isActive("blockquote")}
      >
        Blockquote
      </Button>
      <Button
        value="horizontalRule"
        variant={"outline"}
        type="button"
        onClick={toggleFormat("HorizontalRule")}
      >
        Horizontal Rule
      </Button>
      <Button
        type="button"
        value="hardBreak"
        variant={"outline"}
        onClick={toggleFormat("HardBreak")}
      >
        Hard Break
      </Button>
      <Button
        value="undo"
        variant={"outline"}
        type="button"
        onClick={toggleFormat("Undo")}
        disabled={!editor.can().chain().undo().run()}
      >
        Undo
      </Button>
      <Button
        value="redo"
        type="button"
        onClick={toggleFormat("Redo")}
        variant={"outline"}
        disabled={!editor.can().chain().redo().run()}
      >
        Redo
      </Button>
    </ToggleGroup>
  );
};
