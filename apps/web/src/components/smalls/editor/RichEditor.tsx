"use client";

import {
  BubbleMenu,
  EditorContent,
  FloatingMenu,
  useEditor,
} from "@tiptap/react";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import { cn } from "@/lib/utils";
import BoldText from "../custom-icons/BoldText";
import ItalicText from "../custom-icons/ItalicText";
import StrikeText from "../custom-icons/StrikeText";
import { useEffect } from "react";

type Props = {
  content: string;
  setContent: (content: string) => void;
  className?: string;
  placeholder?: string;
  editable: boolean;
};

export const TextEditor: React.FC<Props> = ({
  content,
  setContent,
  className,
  placeholder,
  editable,
}) => {
  const editor = useEditor({
    extensions: [
      TaskList.configure({
        itemTypeName: "taskItem",
      }),
      TaskItem.configure({
        nested: true,
      }),
      Link.configure({
        autolink: true,
        openOnClick: true,
        HTMLAttributes: {
          class: "markdown-link",
        },
        validate: (href) => /^https?:\/\//.test(href),
      }),
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder:
          placeholder || "Write description. Hit ⏎ for markdown format",
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-base prose-ul:data-[type=taskList]:list-none text-focus-text-hover prose-headings:text-focus-text-hover prose-headings:font-medium prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-strong:text-focus-text-hover prose-strong:font-semibold max-w-none focus:outline-none prose-pre:bg-[#282c34] prose-pre:text-[#abb2bf]",
      },
    },
    autofocus: "end",
    content: content,
    onBlur: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent(content);
    editor.setEditable(editable);
  }, [content, editor, editable]);

  if (!editor) {
    return null;
  }

  return (
    <>
      {editor && (
        <BubbleMenu
          className="bubble-menu"
          tippyOptions={{ duration: 100 }}
          editor={editor}
        >
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "is-active" : ""}
          >
            <BoldText />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "is-active" : ""}
          >
            <ItalicText />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive("strike") ? "is-active" : ""}
          >
            <StrikeText />
          </button>
        </BubbleMenu>
      )}

      {editor && (
        <FloatingMenu
          className={`floating-menu ${
            editor.getHTML() == "<p></p>" ? "hidden" : "flex"
          } gap-x-4 text-nonfocus-text`}
          tippyOptions={{ duration: 100 }}
          editor={editor}
        >
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={
              editor.isActive("heading", { level: 1 }) ? "is-active" : ""
            }
          >
            H1
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={
              editor.isActive("heading", { level: 2 }) ? "is-active" : ""
            }
          >
            H2
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={
              editor.isActive("heading", { level: 3 }) ? "is-active" : ""
            }
          >
            H3
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "is-active" : ""}
          >
            Bullet
          </button>
          <button
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={editor.isActive("bulletList") ? "is-active" : ""}
          >
            Task
          </button>
        </FloatingMenu>
      )}

      <EditorContent
        className={cn(
          "flex-grow text-focus-text [&>.ProseMirror.tiptap]:focus-within:outline-none",
          className
        )}
        editor={editor}
      />
    </>
  );
};
