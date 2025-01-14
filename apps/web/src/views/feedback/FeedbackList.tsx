// FeedbackList.tsx
import React from "react";
import FeedbackItem from "./FeedbackItem";
import Sidebar from "./Sidebar";
import FeedBackSubmit from "./FeedBackSubmit";

interface FeedbackData {
  title: string;
  description: string;
  user: string;
  time: string;
  votes: number;
}

interface FeedbackListProps {
  token: string;
  slug: string;
  workspace: string;
}

const feedbackData: FeedbackData[] = [
  {
    title: "Display links as links in comments",
    description: "When I put a link in the comment, it's shown as text...",
    user: "Vladimir Ikryanov",
    time: "22 hours ago",
    votes: 1,
  },
  {
    title: "Embed widget",
    description:
      "Would be great if there's a widget embed especially for WordPress site.",
    user: "Guest",
    time: "2 days ago",
    votes: 2,
  },
];

const FeedbackList: React.FC<FeedbackListProps> = ({ token }) => {
  return (
    <>
      {token.slice(0, 2)}
      <div className="max-w-4xl mx-auto flex justify-between my-5 items-center">
        <h1 className="text-white text-xl">All Feedback </h1>
        <div>
          <input
            type="text"
            className=" bg-zinc-800 border-zinc-700 rounded-full px-5"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-12 gap-4">
        <div className="col-span-8">
          {feedbackData.map((item, index) => (
            <FeedbackItem key={index} {...item} />
          ))}
        </div>
        <div className="col-span-4 flex flex-col gap-4">
          <FeedBackSubmit />
          <Sidebar />
        </div>
      </div>
    </>
  );
};

export default FeedbackList;
