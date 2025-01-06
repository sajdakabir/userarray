"use client";

import { NoteSkeleton } from "@/components/loaders/NoteSkeleton";
import UserAvatar from "@/components/smalls/avatar/UserAvatar";
import { TextEditor } from "@/components/smalls/editor/RichEditor";
import ItemTodo from "@/components/smalls/items/ItemTodo";
import { Note, SingleNote } from "@/lib/types/Note";
import { WorkspaceMember } from "@/lib/types/Workspaces";
import { USER_WORKSPACE } from "@/utils/constants/api-endpoints";
import { formattedDate, getDate } from "@/utils/helpers";
import { dataStore, userStore } from "@/utils/store/zustand";
import axios, { AxiosError } from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Board, handleChange, createAndSetBoard } from "./today-helpers";

const TodayPage = (props: { accessToken: string; slug: string }) => {
  // Global state
  const user = dataStore((state) => state.user);
  const stateStorage = dataStore((state) => state.stateStorage);
  const setCurrent = userStore((state) => state.setCurrent);
  const setSlug = userStore((state) => state.setSlug);

  const dayBoards = dataStore((state) => state.dayBoards);
  const setDayBoards = dataStore((state) => state.setDayBoards);

  const members = useMemo(() => {
    if (!stateStorage) return [];
    return stateStorage.members.filter((m) => m.status !== "pending");
  }, [stateStorage]);

  // Initially set the current user as the member
  const [member, setMember] = useState<WorkspaceMember>(() => {
    const m = members.find((member) => member.member._id === user!._id);
    return m || members[0];
  });

  const getNoteContent = (note: Note | null | undefined) => {
    if (note) {
      return note.content;
    } else {
      return "<p></p>";
    }
  };

  // TODO: Add revalidation for member boards

  // Set the date to today
  const [date, setDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [board, setBoard] = useState<Board>({
    note: getNoteContent(dayBoards[0].today.note),
    current: dayBoards[0].today.current,
    overdue: dayBoards[0].today.overdue,
    notEditable: false,
  });
  // Set the date details
  const [dateDetails, setDateDetails] = useState<{
    day: number;
    dayOfWeek: string;
    month: string;
    formatted: string;
  }>(getDate(date));

  const handleDateChange = async (newDate: Date) => {
    setDate(newDate);
    const newBoard = await handleChange(
      member,
      dayBoards,
      setDayBoards,
      setIsLoading,
      newDate,
      user!,
      props.accessToken,
      props.slug
    );
    setBoard(newBoard);
  };

  const handleMemberChange = async (m: WorkspaceMember) => {
    setMember(m);
    const newBoard = await handleChange(
      m,
      dayBoards,
      setDayBoards,
      setIsLoading,
      date,
      user!,
      props.accessToken,
      props.slug
    );
    setBoard(newBoard);
  };

  // Update the date details when the date changes
  const changeDate = async (strategy: "increase" | "decrease") => {
    const d = date;
    if (strategy === "increase") {
      d.setDate(d.getDate() + 1);
    } else {
      d.setDate(d.getDate() - 1);
    }
    setDateDetails(getDate(d));
    await handleDateChange(d);
  };

  const handleNoteEdit = async (text: string) => {
    setBoard((prev) => ({
      ...prev,
      note: text,
    }));
    // Save the new text to the server
    try {
      const { data }: { data: SingleNote } = await axios.post(
        USER_WORKSPACE + `/${props.slug}/notes/create-update`,
        {
          date: formattedDate(date),
          content: text,
        },
        {
          headers: {
            Authorization: `Bearer ${props.accessToken}`,
          },
        }
      );

      // Save the new note in the state
      let tempBoards = dayBoards.slice();
      tempBoards[0].today.note = data.response;
      setDayBoards(tempBoards);
    } catch (error) {
      const e = error as AxiosError;
      console.error(e.response?.data);
    }
  };

  useEffect(() => {
    setCurrent(`${props.slug}-today`);
    setSlug(props.slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const revalidate = async () => {
    const newBoard = await createAndSetBoard(
      member,
      date,
      setIsLoading,
      props.accessToken,
      props.slug,
      setDayBoards,
      dayBoards,
      false
    );
    setBoard(newBoard);
  };

  useEffect(() => {
    // Fetch data immediately on mount
    if (member.member._id === user!._id) {
      return;
    }
    revalidate();

    // Set up interval to fetch data every 10 seconds
    const intervalId = setInterval(revalidate, 8000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!stateStorage) return null;

  return (
    <section className="min-h-screen overflow-y-auto px-20 py-8 flex-grow right-0 bg-dashboard">
      <div className="">
        <div className="max-w-[30rem] overflow-y-auto">
          <div className="group">
            <div>
              <h2 className="text-lg font-light">
                <span className="text-focus-text-hover">
                  {dateDetails.dayOfWeek}
                </span>{" "}
                <span className="text-focus-text">{dateDetails.month}</span>
              </h2>
              <h1
                className={`text-6xl font-light ${
                  dateDetails.formatted == formattedDate(new Date())
                    ? "text-less-highlight"
                    : "text-highlight"
                } mt-2`}
              >
                {dateDetails.day}
              </h1>
            </div>

            <div className="flex items-center justify-between mt-2">
              {/* Date Changer */}
              <div className="opacity-0 group-hover:opacity-100 duration-200 flex gap-x-4 p-1">
                <button
                  onClick={() => changeDate("decrease")}
                  disabled={
                    (new Date().getTime() - date.getTime()) /
                      (1000 * 3600 * 24) >=
                      7 || isLoading
                  }
                  className="border border-focus-text rounded-md p-[2px] text-focus-text disabled:text-divider disabled:border-divider"
                >
                  <ChevronLeft size={18} strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => changeDate("increase")}
                  disabled={
                    (date.getTime() - new Date().getTime()) /
                      (1000 * 3600 * 24) >=
                      7 || isLoading
                  }
                  className="border border-focus-text rounded-md p-[2px] text-focus-text disabled:text-divider disabled:border-divider"
                >
                  <ChevronRight size={18} strokeWidth={1.5} />
                </button>
              </div>

              {/* Members */}
              <div className="flex items-center gap-x-0">
                {members.map((m, index) => (
                  <button
                    onClick={() => handleMemberChange(m)}
                    key={m.uuid}
                    disabled={isLoading}
                    className="flex flex-col gap-y-[2px] items-center disabled:opacity-50"
                  >
                    <UserAvatar
                      index={index}
                      name={m.member.fullName || m.member.userName}
                      size={7}
                      image={m.member.avatar}
                      className="border-dashboard ml-0"
                    />

                    <div
                      className={`h-[2px] w-3 rounded-xl ${
                        m._id === member._id ? "bg-highlight" : "bg-transparent"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div
            className={`${isLoading ? "hidden" : ""} overflow-y-auto mt-8 px-2`}
          >
            <TextEditor
              editable={!board.notEditable}
              content={board.note}
              setContent={handleNoteEdit}
              className="[&>.ProseMirror.tiptap]:min-h-32 [&>.ProseMirror.tiptap]:prose-sm"
              placeholder="What's on your mind?"
            />
          </div>

          <NoteSkeleton className={isLoading ? "" : "hidden"} />
        </div>

        {board.current.length + board.overdue.length > 0 ? (
          <div className="flex flex-col mt-2 text-focus-text">
            <div className="flex-grow">
              <div className="">
                {board.current.length !== 0 ? (
                  <div className="flex flex-col my-10 -ml-1 mx-auto">
                    {board.current.map((task) => (
                      <ItemTodo
                        key={task.uuid}
                        token={props.accessToken}
                        item={task}
                        assignee
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            {board.overdue.length !== 0 ? (
              <>
                <div
                  className={`h-[1px] ${
                    board.current.length === 0 ? "hidden" : ""
                  } bg-divider max-w-[30rem]`}
                />
                <h3 className="text-sm mt-8 text-less-highlight flex items-center gap-2">
                  Overdue
                </h3>

                <div className="flex flex-col -ml-1 my-6">
                  {board.overdue.map((task) => (
                    <ItemTodo
                      key={task.uuid}
                      token={props.accessToken}
                      item={task}
                      assignee
                    />
                  ))}
                </div>
              </>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-col text-sm mt-16 text-focus-text-hover">
            {member.member._id === user!._id ? (
              <div>We&apos;ll collect your everyday tasks here.</div>
            ) : (
              <div>Board doesn&apos;t have any tasks to collect.</div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};



export default TodayPage;
