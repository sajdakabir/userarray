import { AllItems, Item, isItem } from "@/lib/types/Items";
import { Note, SingleNote } from "@/lib/types/Note";
import { USER_WORKSPACE } from "@/utils/constants/api-endpoints";
import { formattedDate } from "@/utils/helpers";
import axios, { AxiosError } from "axios";

type NotFoundResponse = {
  statusCode: number;
  message: string;
};

type TodayItems = {
  current: Item[];
  overdue: Item[];
};

type TodayResponse = {
  status: number;
  response: TodayItems;
};

/**
 * Type guard to check if the data is of type TodayItems
 * @param data - The data to check
 * @returns {boolean} - True if the data is of type TodayItems, false otherwise
 */
export function isTodayItems(data: any): data is TodayItems {
  return (
    typeof data === "object" &&
    data !== null &&
    Array.isArray(data.current) &&
    Array.isArray(data.overdue) &&
    data.current.every(isItem) &&
    data.overdue.every(isItem)
  );
}

/**
 * Type guard function to check if the given data is of type SingleNote.
 *
 * @param data - The data to check, which can be of type SingleNote or NotFoundResponse.
 * @returns A boolean indicating whether the data is of type SingleNote.
 */
function isSingleNote(data: SingleNote | NotFoundResponse): data is SingleNote {
  return (
    (data as SingleNote).response !== undefined ||
    (data as SingleNote).response !== null
  );
}

/**
 * Fetches a member's note by date from the specified workspace.
 *
 * @param {string} token - The authentication token.
 * @param {string} slug - The workspace identifier.
 * @param {string} member - The member identifier.
 * @param {Date} date - The date for which to fetch the note.
 * @returns {Promise<Note | undefined>} - The note if found, otherwise undefined.
 */
export const getMemberNoteByDate = async (
  token: string,
  slug: string,
  member: string,
  date: Date
): Promise<Note | undefined> => {
  const frmt_date = formattedDate(date);
  let noteResponse: undefined | Note = undefined;
  try {
    const note: {
      data: SingleNote | NotFoundResponse;
    } = await axios.get(
      USER_WORKSPACE + `/${slug}/notes/${member}/${frmt_date}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // If the note is found
    if (isSingleNote(note.data)) {
      noteResponse = note.data.response;
    }
    return noteResponse;
  } catch (error) {
    const e = error as AxiosError;
    console.error("Error:", e);
    return undefined;
  }
};

/**
 * Fetches the member board data by date.
 *
 * @param {string} token - The authentication token.
 * @param {string} slug - The workspace identifier.
 * @param {string} member - The member identifier.
 * @param {Date} date - The date for which to fetch the data.
 * @returns {Promise<{ note: Note | undefined, items: Item[] }>}
 */
export const getMemberBoardByDate = async (
  token: string,
  slug: string,
  member: string,
  date: Date
): Promise<{ note: Note | undefined; items: Item[] }> => {
  try {
    const note = await getMemberNoteByDate(token, slug, member, date);

    const itemResponse: { data: AllItems } = await axios.get(
      USER_WORKSPACE + `/${slug}/items/${member}/${formattedDate(date)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const items = itemResponse.data.response;

    return { note: note, items: items };
  } catch (error) {
    const e = error as AxiosError;
    console.error("Error:", e);
    return { note: undefined, items: [] };
  }
};

/**
 * Fetches the member board data for the specified date.
 *
 * @param {string} token - The authentication token.
 * @param {string} slug - The workspace identifier.
 * @param {string} member - The member identifier.
 * @returns {Promise<{ note: Note | undefined, items: TodayItems }>}
 */
export const getTodayMemberBoard = async (
  token: string,
  slug: string,
  member: string
): Promise<{ note: Note | undefined; items: TodayItems }> => {
  try {
    const itemResponse: { data: TodayResponse } = await axios.get(
      USER_WORKSPACE + `/${slug}/items/${member}/today`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const items = itemResponse.data.response;
    const note = await getMemberNoteByDate(token, slug, member, new Date());
    return { note: note, items: items };
  } catch (error) {
    const e = error as AxiosError;
    console.error("Error:", e);
    return { note: undefined, items: { current: [], overdue: [] } };
  }
};
