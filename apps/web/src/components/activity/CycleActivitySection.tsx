import { CycleActivity, CycleComment } from "@/lib/types/Activity";
import { Cycle } from "@/lib/types/Cycle";
import { getCycleActivities } from "@/server/fetchers/cycle/get-activities";
import { USER_WORKSPACE } from "@/utils/constants/api-endpoints";
import { itemActivityStore } from "@/utils/store/activity-store";
import { userStore } from "@/utils/store/zustand";
import axios, { AxiosError } from "axios";
import React, { FC, useEffect, useMemo, useState } from "react";
import { toast } from "../ui/use-toast";
import ActivityList from "./ActivityList";
import { getUpdatedCycleActivities } from "./ActivityHelper";
import CycleActivityComponent from "./CycleActivity";

type CycleActivityProps = {
  token: string;
  space: string;
  cycleId: string;
  cycle: Cycle | undefined;
};

const CycleActivitySection: FC<CycleActivityProps> = ({
  token,
  space,
  cycleId,
  cycle,
}) => {
  const slug = userStore((state) => state.slug);
  const cycleActivities = itemActivityStore((state) => state.cycleActivity);
  const setCycleActivity = itemActivityStore((state) => state.setCycleActivity);

  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const activity: CycleActivity[] | CycleComment[] = useMemo(() => {
    const spaceIndex = cycleActivities.findIndex(
      (item) => item.space === space
    );
    if (spaceIndex !== -1) {
      const activityIndex = cycleActivities[spaceIndex].cycleActivity.findIndex(
        (act) => act._id === cycleId
      );
      if (activityIndex !== -1) {
        return cycleActivities[spaceIndex].cycleActivity[activityIndex]
          .activity;
      }
      return [];
    }
    return [];
  }, [cycleActivities, space, cycleId]);

  const fetchHistory = async () => {
    const history = await getCycleActivities(token, slug, space, cycleId);
    const updatedActivityState = getUpdatedCycleActivities(
      cycleActivities,
      history,
      space,
      cycleId
    );
    setCycleActivity(updatedActivityState);
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
    const intervalId = setInterval(() => {
      fetchHistory();
    }, 10000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycle]); // Re-render when item changes

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      // Trigger button click when Enter key is pressed
      if (comment === "") return;
      await postComment();
    }
  };

  const postComment = async () => {
    if (comment === "") return;
    const text = comment;
    setComment("");
    try {
      await axios.post(
        USER_WORKSPACE + `/${slug}/spaces/${space}/cycles/${cycleId}/comments`,
        {
          comment: text,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      await fetchHistory();
    } catch (error) {
      const e = error as AxiosError;
      console.error(e.response?.data);
      toast({
        variant: "destructive",
        title: "Could not post comment !",
      });
    }
  };

  return (
    <ActivityList
      length={activity.length}
      comment={comment}
      fetching={false}
      setComment={setComment}
      handleKeyDown={handleKeyDown}
    >
      {activity.map((act) => (
        <CycleActivityComponent
          key={act._id}
          token={token}
          space={space}
          cycleId={cycleId}
          activity={act}
          fetchHistory={fetchHistory}
        />
      ))}
    </ActivityList>
  );
};

export default CycleActivitySection;
