import { FC, useEffect, useMemo, useState } from "react";
import { itemActivityStore } from "@/utils/store/activity-store";
import { userStore } from "@/utils/store/zustand";
import { ItemActivity, ItemComment } from "@/lib/types/Activity";
import { getItemActivities } from "@/server/fetchers/items/get-activities";
import { Item } from "@/lib/types/Items";
import ItemActivityComponent from "./ItemActivity";
import axios, { AxiosError } from "axios";
import { USER_WORKSPACE } from "@/utils/constants/api-endpoints";
import { toast } from "@/components/ui/use-toast";
import ActivityList from "@/components/activity/ActivityList";
import { getUpdatedItemActivities } from "./ActivityHelper";

type ItemActivityProps = {
  token: string;
  space: string;
  itemId: string;
  item: Item | undefined;
};

const ItemActivitySection: FC<ItemActivityProps> = ({
  token,
  space,
  itemId,
  item,
}) => {
  const slug = userStore((state) => state.slug);
  const itemActivities = itemActivityStore((state) => state.itemActivity);
  const setItemActivity = itemActivityStore((state) => state.setItemActivity);

  const [comment, setComment] = useState<string>("");
  // const [loading, setLoading] = useState<boolean>(true);

  const activity: ItemActivity[] | ItemComment[] = useMemo(() => {
    const spaceIndex = itemActivities.findIndex((item) => item.space === space);
    if (spaceIndex !== -1) {
      const activityIndex = itemActivities[spaceIndex].itemActivity.findIndex(
        (act) => act._id === itemId
      );
      if (activityIndex !== -1) {
        return itemActivities[spaceIndex].itemActivity[activityIndex].activity;
      }
      return [];
    }
    return [];
  }, [itemActivities, space, itemId]);

  const fetchHistory = async () => {
    const history = await getItemActivities(token, slug, space, itemId);
    const updatedActivityState = getUpdatedItemActivities(
      itemActivities,
      history,
      space,
      itemId
    );
    setItemActivity(updatedActivityState);
    // setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
    const intervalId = setInterval(() => {
      fetchHistory();
    }, 10000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]); // Re-render when item changes

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
        USER_WORKSPACE + `/${slug}/spaces/${space}/items/${itemId}/comments/`,
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
        <ItemActivityComponent
          key={act._id}
          token={token}
          space={space}
          itemId={itemId}
          activity={act}
          fetchHistory={fetchHistory}
        />
      ))}
    </ActivityList>
  );
};

export default ItemActivitySection;
