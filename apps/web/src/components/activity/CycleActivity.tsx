import {
  CycleActivity,
  CycleComment,
  ItemActivity,
  ItemComment,
  isCycleComment,
  isItemComment,
} from "@/lib/types/Activity";
import { USER_WORKSPACE } from "@/utils/constants/api-endpoints";
import { userStore } from "@/utils/store/zustand";
import axios, { AxiosError } from "axios";
import React, { FC, useState } from "react";
import { toast } from "../ui/use-toast";
import CommentSection from "./CommentSection";
import ActivityComponent from "./ActivityComponent";
import { getActivityTime } from "@/utils/helpers";
import { CycleActivityString, GetActivityIcon } from "./ActivityHelper";

type CycleActivityProps = {
  token: string;
  space: string;
  cycleId: string;
  activity: CycleActivity | CycleComment;
  fetchHistory: () => Promise<void>;
};

const CycleActivityComponent: FC<CycleActivityProps> = ({
  token,
  space,
  cycleId,
  activity,
  fetchHistory,
}) => {
  const slug = userStore((state) => state.slug);

  const [content, setContent] = useState<string>(activity.comment);
  const [editable, setEditable] = useState<boolean>(false);
  //   const [isLoading, setIsLoading] = useState<boolean>(false);

  const updateComment = async () => {
    setEditable(false);
    try {
      await axios.patch(
        USER_WORKSPACE +
          `/${slug}/spaces/${space}/cycles/${cycleId}/comments/${activity.uuid}`,
        {
          comment: content,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
    } catch (error) {
      const e = error as AxiosError;
      console.error(e.response?.data);
      toast({
        variant: "destructive",
        title: "Could not update comment",
      });
    }
  };

  const deleteComment = async () => {
    setEditable(false);
    try {
      await axios.delete(
        USER_WORKSPACE +
          `/${slug}/spaces/${space}/cycles/${cycleId}/comments/${activity.uuid}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      toast({
        title: "Your comment was deleted!",
      });
      await fetchHistory();
    } catch (error) {
      const e = error as AxiosError;
      console.error(e.response?.data);
      toast({
        variant: "destructive",
        title: "Could not delete comment",
      });
    }
  };

  return (
    <div className="mb-4">
      <ActivityComponent
        Icon={<GetActivityIcon activity={activity} />}
        ActivityString={<CycleActivityString activity={activity} />}
        time={getActivityTime(activity.updatedAt)}
      />
      {isCycleComment(activity) && activity.verb === undefined ? (
        <CommentSection
          actor={activity.actor}
          content={content}
          setContent={setContent}
          editable={editable}
          setEditable={setEditable}
          updateComment={updateComment}
          deleteComment={deleteComment}
        />
      ) : null}
    </div>
  );
};

export default CycleActivityComponent;
