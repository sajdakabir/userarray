"use client";

import { dataStore, userStore } from "@/utils/store/zustand";
import { useEffect, useMemo } from "react";
import ItemTodo from "@/components/smalls/items/ItemTodo";
import { CalendarCheck, Circle, Inbox } from "lucide-react";
import { Item } from "@/lib/types/Items";

const InboxPage = (props: { accessToken: string; slug: string }) => {
  // Global states
  const setCurrent = userStore((state) => state.setCurrent);
  const setSlug = userStore((state) => state.setSlug);
  const stateStorage = dataStore((state) => state.stateStorage);

  useEffect(() => {
    setCurrent(`${props.slug}-inbox`);
    setSlug(props.slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Local States
  const items = useMemo<Item[]>(() => {
    if (!stateStorage) return [];
    const inbox = stateStorage.inbox;
    return inbox.filter((itm) => itm.dueDate === null);
  }, [stateStorage]);

  const plannedItems = useMemo<Item[]>(() => {
    if (!stateStorage) return [];
    const inbox = stateStorage.inbox;
    return inbox.filter(
      (itm) => itm.dueDate !== null && itm.status !== "done"
    );
  }, [stateStorage]);

  return (
    <section className="min-h-screen overflow-y-auto px-20 py-8 flex-grow right-0 bg-dashboard">
      {items.length + plannedItems.length === 0 ? (
        <div className="text-center h-full w-full grid place-items-center">
          <div>
            <h2 className="text-xl font-medium text-focus-text-hover">
              You&apos;r not assigned to any task!
            </h2>
            <h4 className="text-focus-text text-sm mt-4">
              We&apos;ll collect all your work and tasks here.
            </h4>
          </div>
        </div>
      ) : (
        <div className="">
          <div className="">
            <h2 className="text-xl flex items-center font-medium text-focus-text-hover">
              <Inbox className="mr-2" size={20} />
              Inbox
            </h2>
            <h4 className="text-focus-text text-sm mt-2 flex items-center">
              Total {items.length + plannedItems.length} tasks are assigned to
              you
            </h4>
          </div>

          <div className="flex flex-col mt-12 justify-start text-focus-text">
            <div className="">
              <h3 className="text-sm text-less-highlight flex items-center gap-2">
                <Circle size={16} />
                Todo
              </h3>

              <div className="mt-2">
                {items.length !== 0 ? (
                  <div className="flex flex-col my-6 mx-auto">
                    {items.map((task) => (
                      <ItemTodo
                        key={task.uuid}
                        token={props.accessToken}
                        item={task}
                        assignee={false}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-8 ml-3 text-focus-text text-sm">
                    You don&apos;t have any task today
                  </div>
                )}
              </div>
            </div>
            {/* <div className="w-[1px] bg-divider mx-10 mb-4  min-h-full" /> */}
            <div className="flex-grow mt-8">
              <h3 className="text-sm text-less-highlight flex items-center gap-2">
                <CalendarCheck size={16} />
                Planned
              </h3>

              <div className="mt-2">
                {plannedItems.length !== 0 ? (
                  <div className="flex flex-col my-6 mx-auto">
                    {plannedItems.map((task) => (
                      <ItemTodo
                        key={task.uuid}
                        token={props.accessToken}
                        item={task}
                        assignee={false}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-8 text-focus-text text-sm">
                    You don&apos;t have any planned task
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default InboxPage;
