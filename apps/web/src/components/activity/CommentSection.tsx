import React, { FC, useEffect, useRef } from "react";
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { dataStore } from "@/utils/store/zustand";

type CommentSectionProps = {
  content: string;
  setContent: (content: string) => void;
  actor: string;
  editable: boolean;
  setEditable: React.Dispatch<React.SetStateAction<boolean>>;
  updateComment: () => Promise<void>;
  deleteComment: () => Promise<void>;
};

const CommentSection: FC<CommentSectionProps> = ({
  content,
  setContent,
  actor,
  editable,
  setEditable,
  updateComment,
  deleteComment,
}) => {
  const user = dataStore((state) => state.user);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  return (
    <div className="flex items-start gap-x-[6px]">
      <textarea
        ref={textareaRef}
        value={content}
        autoFocus={true}
        onBlur={updateComment}
        disabled={!editable}
        onChange={(e) => setContent(e.target.value)}
        className={`ml-[42px] resize-none h-fit overflow-hidden focus:outline-none bg-transparent flex flex-grow p-2 max-w-[210px] border-[1px] text-xs ${
          editable ? "border-focus-text" : "border-divider"
        } rounded-[8px]`}
      />
      <Popover>
        <PopoverTrigger
          className={` ${
            user!._id === actor ? "" : "hidden"
          } mt-1 focus:outline-none outline-none hover:text-focus-text-hover`}
        >
          <EllipsisVertical size={14} />
        </PopoverTrigger>
        <PopoverContent className="bg-sidebar w-fit rounded-[10px] flex flex-col gap-y-1 text-focus-text-hover border-sidebar-button-active p-1">
          <PopoverClose
            onClick={() => setEditable((editable) => !editable)}
            className="text-xs flex items-center gap-x-[6px] p-1 px-2 rounded-md text-left hover:bg-sidebar-button-hover hover:text-focus-text-hover"
          >
            <Pencil size={12} />
            Edit
          </PopoverClose>
          <PopoverClose
            onClick={deleteComment}
            className="text-xs flex items-center gap-x-[6px] p-1 px-2 rounded-md text-left hover:bg-sidebar-button-hover hover:text-focus-text-hover"
          >
            <Trash2 size={12} />
            Delete
          </PopoverClose>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CommentSection;
