"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DatePickerProps = {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  text: string;
};

export function DatePicker({ text, date, setDate }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "border border-item-border text-focus-text hover:bg-gray-600/30 hover:text-focus-text-hover px-2 py-1 text-xs rounded-md flex items-center"
          )}
        >
          <CalendarIcon size={14} className="mr-1" />
          {date ? format(date, "do MMM") : <span>{text}</span>}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 mt-2 border-none bg-dropdown-menu rounded-[10px]">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
