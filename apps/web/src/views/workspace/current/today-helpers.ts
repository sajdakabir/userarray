import { Item } from "@/lib/types/Items";
import { Note } from "@/lib/types/Note";
import { DayBoard, MemberDayBoard } from "@/lib/types/TodayBoard";
import { User } from "@/lib/types/Users";
import { WorkspaceMember } from "@/lib/types/Workspaces";
import {
  getMemberBoardByDate,
  getTodayMemberBoard,
} from "@/server/fetchers/items/get-today";
import { formattedDate } from "@/utils/helpers";
import { isToday } from "date-fns";

/**
 * type for the board data
 * includes the note and the current user's items
 */
export type Board = {
  note: string;
  notEditable: boolean;
  current: Item[];
  overdue: Item[];
};

/**
 * Retrieves the content of a note.
 *
 * @param {Note | null | undefined} note - The note object which may be null or undefined.
 * @returns {string} The content of the note if it exists, otherwise an empty paragraph.
 */
const getNoteContent = (note: Note | null | undefined): string => {
  if (note) {
    return note.content;
  } else {
    return "<p></p>";
  }
};

/**
 * Handles the change for a workspace member's board.
 *
 * @param fnMember - The workspace member whose board is being modified.
 * @param dayBoards - The current state of the member's day boards.
 * @param setDayBoards - Function to update the state of the member's day boards.
 * @param setIsLoading - Function to set the loading state.
 * @param fnDate - The date for which the board is being modified.
 * @param user - The current user.
 * @param token - The authentication token.
 * @param slug - The workspace slug.
 * @returns {Board} - The updated board.
 */
export const handleChange = async (
  fnMember: WorkspaceMember,
  dayBoards: MemberDayBoard[],
  setDayBoards: (dayBoards: MemberDayBoard[]) => void,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  fnDate: Date,
  user: User,
  token: string,
  slug: string
): Promise<Board> => {
  if (fnMember.member._id === user._id) {
    return await handleCurrentUserBoard(
      fnDate,
      dayBoards,
      setIsLoading,
      token,
      slug,
      setDayBoards,
      fnMember
    );
  } else {
    return await handleOtherUserBoard(
      fnMember,
      fnDate,
      dayBoards,
      setDayBoards,
      setIsLoading,
      token,
      slug
    );
  }
};

const handleCurrentUserBoard = async (
  fnDate: Date,
  dayBoards: MemberDayBoard[],
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  token: string,
  slug: string,
  setDayBoards: (dayBoards: MemberDayBoard[]) => void,
  fnMember: WorkspaceMember
): Promise<Board> => {
  if (isToday(fnDate)) {
    return {
      note: getNoteContent(dayBoards[0].today.note),
      current: dayBoards[0].today.current,
      overdue: dayBoards[0].today.overdue,
      notEditable: false,
    };
  } else {
    const noteItems = dayBoards[0].days.find(
      (d) => d.date === formattedDate(fnDate)
    );
    if (noteItems) {
      return {
        note: getNoteContent(noteItems.note),
        current: noteItems.items,
        overdue: [],
        notEditable: true,
      };
    } else {
      return await fetchAndSetBoard(
        fnDate,
        0,
        setIsLoading,
        token,
        slug,
        setDayBoards,
        dayBoards,
        fnMember
      );
    }
  }
};

const handleOtherUserBoard = async (
  fnMember: WorkspaceMember,
  fnDate: Date,
  dayBoards: MemberDayBoard[],
  setDayBoards: (dayBoards: MemberDayBoard[]) => void,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  token: string,
  slug: string
): Promise<Board> => {
  let bdIndex = dayBoards.findIndex((b) => b.id === fnMember.member._id);

  if (bdIndex !== -1) {
    const bd = dayBoards[bdIndex];
    if (isToday(fnDate)) {
      return {
        note: getNoteContent(bd.today.note),
        current: bd.today.current,
        overdue: bd.today.overdue,
        notEditable: true,
      };
    } else {
      const noteItems = bd.days.find((d) => d.date === formattedDate(fnDate));
      if (noteItems) {
        return {
          note: getNoteContent(noteItems.note),
          current: noteItems.items,
          overdue: [],
          notEditable: true,
        };
      } else {
        return await fetchAndSetBoard(
          fnDate,
          bdIndex,
          setIsLoading,
          token,
          slug,
          setDayBoards,
          dayBoards,
          fnMember
        );
      }
    }
  } else {
    return await createAndSetBoard(
      fnMember,
      fnDate,
      setIsLoading,
      token,
      slug,
      setDayBoards,
      dayBoards,
      true
    );
  }
};

const fetchAndSetBoard = async (
  fnDate: Date,
  bdIndex: number,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  token: string,
  slug: string,
  setDayBoards: (dayBoards: MemberDayBoard[]) => void,
  dayBoards: MemberDayBoard[],
  fnMember: WorkspaceMember
): Promise<Board> => {
  setIsLoading(true);
  let { note, items } = await getMemberBoardByDate(
    token,
    slug,
    fnMember.member._id,
    fnDate
  );

  let board: Board = {
    note: getNoteContent(note),
    current: items,
    overdue: [],
    notEditable: true,
  };

  let tempBoards = [...dayBoards];
  const temp: DayBoard = {
    date: formattedDate(fnDate),
    items: items,
    note: note || null,
  };

  tempBoards[bdIndex].days.push(temp);
  setDayBoards(tempBoards);

  setIsLoading(false);
  return board;
};


/**
 * Creates a new board for a member.
 *
 * @param fnMember - The workspace member whose board is being created.
 * @param fnDate - The date for which the board is being created.
 * @param setIsLoading - Function to set the loading state.
 * @param token - The authentication token.
 * @param slug - The workspace slug.
 * @param setDayBoards - Function to update the state of the member's day boards.
 * @param dayBoards - The current state of the member's day boards.
 * @param isNew - Whether the board is being created for the first time.
 * @returns {Board} - The updated board.
 */
export const createAndSetBoard = async (
  fnMember: WorkspaceMember,
  fnDate: Date,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  token: string,
  slug: string,
  setDayBoards: (dayBoards: MemberDayBoard[]) => void,
  dayBoards: MemberDayBoard[],
  isNew: boolean
): Promise<Board> => {
  setIsLoading(true);

  let index: number = -1;

  if (!isNew) {
    index = dayBoards.findIndex((b) => b.id === fnMember.member._id);
  }

  let temp: MemberDayBoard = {
    id: fnMember.member._id,
    today: {
      current: [],
      overdue: [],
      note: null,
    },
    days: [],
  };

  let board: Board = {
    note: "",
    current: [],
    overdue: [],
    notEditable: true,
  };

  const todayNoteItems = await getTodayMemberBoard(
    token,
    slug,
    fnMember.member._id
  );

  temp.today = {
    note: todayNoteItems.note || null,
    current: todayNoteItems.items.current,
    overdue: todayNoteItems.items.overdue,
  };

  if (isToday(fnDate)) {
    board = {
      note: getNoteContent(todayNoteItems.note),
      current: todayNoteItems.items.current,
      overdue: todayNoteItems.items.overdue,
      notEditable: true,
    };
  } else {
    const { note, items } = await getMemberBoardByDate(
      token,
      slug,
      fnMember.member._id,
      fnDate
    );

    board = {
      note: getNoteContent(note),
      current: items,
      overdue: [],
      notEditable: true,
    };

    temp.days.push({
      date: formattedDate(fnDate),
      items: items,
      note: note || null,
    });
  }

  setIsLoading(false);
  let tempBoards = [...dayBoards];

  if (isNew) {
    tempBoards.push(temp);
    setDayBoards(tempBoards);
  } else {
    tempBoards[index] = temp;
    setDayBoards(tempBoards);
  }

  return board;
};
