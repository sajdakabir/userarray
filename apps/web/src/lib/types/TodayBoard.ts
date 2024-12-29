import { Item } from "./Items";
import { Note } from "./Note";

/**
 * A type representing items and notes for today.
 */
export type TodayBoard = {
  current: Item[]; // The current items for the day
  overdue: Item[]; // The overdue items for the day
  note: Note | null; // The note for the day
};

/**
 * A type representing a day board other than today.
 */
export type DayBoard = {
  date: string; // The date of the day
  items: Item[]; // The items for the day
  note: Note | null; // The note for the day
};

/**
 * A type representing a member's day board.
 */
export type MemberDayBoard = {
  id: "CURRENT_USER" | string; // The ID of the member
  today: TodayBoard; // The current day board for the member
  days: DayBoard[]; // The day boards for the member
};

/**
 * A type representing the response from the /:slug/today API for getting the current user's today's items and note for a given workspace.
 */
export type MyTodayResponse = {
  status: number;
  response: {
    note: Note | null;
    current: Item[];
    overdue: Item[];
  };
};
