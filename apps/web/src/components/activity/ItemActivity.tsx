import { ItemActivity, ItemComment, isItemComment } from "@/lib/types/Activity";
import { userStore } from "@/utils/store/zustand";
import { useState } from "react";
import { getActivityTime } from "@/utils/helpers";
import axios, { AxiosError } from "axios";
import { USER_WORKSPACE } from "@/utils/constants/api-endpoints";
import { toast } from "@/components/ui/use-toast";
import ActivityComponent from "./ActivityComponent";
import CommentSection from "./CommentSection";
import { GetActivityIcon, ItemActivityString } from "./ActivityHelper";

type ItemActivityProps = {
  token: string;
  space: string;
  itemId: string;
  activity: ItemActivity | ItemComment;
  fetchHistory: () => Promise<void>;
};

const ItemActivityComponent: React.FC<ItemActivityProps> = ({
  token,
  space,
  itemId,
  activity,
  fetchHistory,
}) => {
  const slug = userStore((state) => state.slug);

  const [content, setContent] = useState<string>(activity.comment);
  const [editable, setEditable] = useState<boolean>(false);
  // const [isLoading, setIsLoading] = useState<boolean>(false);

  const updateComment = async () => {
    setEditable(false);
    try {
      await axios.patch(
        USER_WORKSPACE +
          `/${slug}/spaces/${space}/items/${itemId}/comments/${activity.uuid}`,
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
          `/${slug}/spaces/${space}/items/${itemId}/comments/${activity.uuid}`,
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
        ActivityString={<ItemActivityString activity={activity} />}
        time={getActivityTime(activity.updatedAt)}
      />
      {isItemComment(activity) && activity.verb === undefined ? (
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

export default ItemActivityComponent;
