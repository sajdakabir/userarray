"use client";
import React, { FC, useEffect } from "react";
import { Issue, IssueStatus } from "@/lib/types/Issue";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { CheckSquare, Plus } from "lucide-react";
import ItemCard from "../smalls/items/ItemCard";

interface IssueCardProps {
  issue: Issue[];
  issueStatus: IssueStatus[];
  token:string
}

const IssueCard: FC<IssueCardProps> = ({ issue, issueStatus,token }) => {
  return (
    <div className="overflow-hidden ml-16">
      <div className="text-sm flex justify-start gap-x-10 pr-8">
        {issueStatus &&
          issueStatus.length !== 0 &&
          issueStatus.map((state) => {
            const taskCount = issue.filter(
              (issue) => issue.state.id === state.id
            ).length;
            const allTasks = issue.filter(
              (issue) => issue.state.id === state.id
            );
            return (
              <div
                key={state.id}
                //   onDrop={handleTodoDrop}
                //   onDragOver={handleDragOver}
                className="w-[295px] flex flex-col"
              >
                <div className="flex items-center justify-between px-4">
                  <h4 className="flex items-center gap-1 text-focus-text-hover font-semibold">
                    <CheckSquare
                      size={16}
                      className="mr-1 text-less-highlight"
                    />
                    {state.name}
                    <span className="text-nonfocus-text font-normal">
                      {taskCount} tasks
                    </span>
                  </h4>
                  {/* <Dialog open={todoOpen} onOpenChange={setTodoIsOpen}> */}
                  <Dialog>
                    <DialogTrigger
                      className="outline-none focus:outline-none"
                      asChild={true}
                    >
                      <button className="text-focus-text-hover rounded-md hover:bg-sidebar p-1">
                        <Plus size={16} />
                      </button>
                    </DialogTrigger>
                    {/* <CreateItem
                        token={props.token}
                        status={statuses[1]}
                        isPlan
                        space={stateStorage.spaces[spaceIndex]}
                        setIsOpen={setTodoIsOpen}
                      /> */}
                  </Dialog>
                </div>

                {taskCount !== 0 ? (
                  <div className="flex flex-col gap-y-2 mt-6 pt-2 mb-1 pb-4 overflow-hidden hover:overflow-y-auto px-4 overflow-x-hidden">
                    {allTasks.map((task) => (
                      <ItemCard
                        key={task.uuid}
                        //   token={token}
                        item={task}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-8 text-focus-text text-sm ml-4">
                    You don&apos;t have any todo items yet
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default IssueCard;
