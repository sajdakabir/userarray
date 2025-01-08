import { Cycle } from "@/lib/types/Cycle";
import { WorkspaceMember } from "@/lib/types/Workspaces";
import { format, parseISO } from "date-fns";

/**
 * Generates an avatar string from a given name.
 * The avatar string consists of the first letter of the first name
 * and the first letter of the last name, both in uppercase.
 * If the last name is not provided, only the first letter of the first name is used.
 *
 * @param {string} name - The full name from which to generate the avatar.
 * @returns {string} The generated avatar string.
 */
export const GetAvatarFromName = (firstName?: string, lastName?: string) => {
  if (!firstName) return "U"; // Default to "U" for userArray if no name is provided
  
  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
  
  return `${firstInitial}${lastInitial}`;
};

/**
 * Truncates a given string to a specified length and appends an ellipsis ("...") if the string exceeds that length.
 *
 * @param {string} input - The string to be truncated.
 * @param {number} limit - The maximum length of the truncated string.
 * @returns {string} - The truncated string with an ellipsis appended if it exceeds the specified length, otherwise the original string.
 */
export const truncateString = (input: string, limit: number) => {
  if (input.length > limit) {
    return input.substring(0, limit) + "...";
  }
  return input;
};

/**
 * Returns the closest Monday from today's date.
 * If today is Monday, it returns today's date.
 * Otherwise, it searches within the past 5 days and future 5 days to find the closest Monday.
 *
 * @returns {Date} The closest Monday from today.
 */
export const closestMondayFromToday = (): Date => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)

  // If today is Monday, return today
  if (dayOfWeek === 1) {
    return today;
  }

  // Calculate the past 5 days and future 5 days
  const daysToCheck = 5;
  let closestMonday = new Date(today);
  let closestDistance = Number.MAX_SAFE_INTEGER;

  for (let i = -daysToCheck; i <= daysToCheck; i++) {
    const tempDate = new Date(today);
    tempDate.setDate(today.getDate() + i);

    if (tempDate.getDay() === 1) {
      const distance = Math.abs(today.getTime() - tempDate.getTime());
      if (distance < closestDistance) {
        closestMonday = tempDate;
        closestDistance = distance;
      }
    }
  }
  return closestMonday;
};

/**
 * Returns an array of dates that are the closest Monday from today and the subsequent dates
 * after adding specific days (0, 6, 7, and 13 days) to that Monday.
 *
 * @returns {Date[]} An array of Date objects representing the closest Monday and the dates
 *                   after adding 6, 7, and 13 days to that Monday.
 */
export const getDatesAfterClosestMondays = (): Date[] => {
  const closestMonday = closestMondayFromToday();

  const datesAfterMondays: Date[] = [];

  // Add 0, 6, 7, and 1 day to the closest Monday
  for (let i = 0; i <= 3; i++) {
    const date = new Date(closestMonday);
    if (i === 0) {
      datesAfterMondays.push(date); // Push the Monday itself
    } else if (i === 1) {
      date.setDate(closestMonday.getDate() + 6); // Add 6 days
      datesAfterMondays.push(date);
    } else if (i === 2) {
      date.setDate(closestMonday.getDate() + 7); // Add 7 days
      datesAfterMondays.push(date);
    } else if (i === 3) {
      date.setDate(closestMonday.getDate() + 13); // Add 1 day
      datesAfterMondays.push(date);
    }
  }
  return datesAfterMondays;
};

/**
 * Finds a cycle by its ID from the provided cycles object.
 *
 * @param cycles - An object containing arrays of upcoming and completed cycles, and the current cycle.
 * @param id - The ID of the cycle to find.
 * @returns The cycle with the matching ID, or undefined if no match is found.
 */
export const findCycle = (
  cycles: {
    upcoming: Cycle[];
    current: Cycle;
    completed: Cycle[];
  },
  id: string
): Cycle | undefined => {
  if (cycles.current._id === id) return cycles.current;
  const found1 = cycles.upcoming.find((c) => c._id === id);
  if (found1) return found1;
  const found2 = cycles.completed.find((c) => c._id === id);
  return found2;
};

/** Formats a date object to a string in the format "yyyy-MM-dd".
 * @param dte The date to be formatted.
 * @returns Returns an object containing the day, day of the week, month, and formatted date.
 */
export const getDate = (dte: Date) => {
  const day = dte.getDate();
  const dayOfWeek = dte.toLocaleString("default", { weekday: "long" });
  const month = dte.toLocaleString("default", { month: "long" });
  const formatted = format(dte, "yyyy-MM-dd");
  return { day, dayOfWeek, month, formatted };
};

/**
 * Sorts an array such that a specified element always stays on top.
 *
 * @param {Array} arr - The array to be sorted.
 * @param {*} topElement - The element that should always be on top.
 * @returns {Array} The sorted array with the specified element on top.
 */
export const sortWithTopElement = (
  arr: WorkspaceMember[],
  topElement: string
): Array<WorkspaceMember> => {
  return arr.sort((a, b) => {
    if (a.member._id === topElement) return -1; // a should come before b
    if (b.member._id === topElement) return 1; // b should come before a
    return 0; // a and b are equal in terms of sorting
  });
};

/**
 * Formats a given Date object into a string with the format "yyyy-MM-dd".
 *
 * @param {Date} date - The date to be formatted.
 * @returns {string} The formatted date string.
 */
export const formattedDate = (date: Date): string => {
  return format(date, "yyyy-MM-dd");
};

/**
 * Formats a given date string into a human-readable time format.
 *
 * @param {string} dateStr - The date string to be formatted.
 * @returns {string} - The formatted time string in "hh:mm a" format.
 */
export const getActivityTime = (dateStr: string): string => {
  const date = parseISO(dateStr);
  return format(date, "hh:mm a");
};

/**
 * Formats a given date string into a human-readable date time format.
 *
 * @param {string} dateStr - The date string to be formatted.
 * @returns {string} - The formatted date string in "MMMM d, yyyy, hh:mma" format.
 */
export const getActivityDateTime = (dateStr: string): string => {
  const date = parseISO(dateStr);
  return format(date, "MMMM d, yyyy, hh:mma");
};
