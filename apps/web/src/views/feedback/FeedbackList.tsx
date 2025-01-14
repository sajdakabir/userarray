'use client'
import React, { useEffect } from "react";
import FeedbackItem from "./FeedbackItem";
import Sidebar from "./Sidebar";
import FeedBackSubmit from "./FeedBackSubmit";
import { useFeedBackStore } from "@/store/feebackStore";
import { BACKEND_URL } from "@/config/apiConfig";


interface FeedbackListProps {
  token: string;
  slug: string;
  workspace: boolean |null;
}


const FeedbackList: React.FC<FeedbackListProps> = ({ token,slug,workspace }) => {


    const {isLoading,allFeedback,fetchAllFeedback}=useFeedBackStore()

    useEffect(()=>{
        const url = token && workspace 
            ? `${BACKEND_URL}/public/workspaces/${slug}/feedback/`  
            : `${BACKEND_URL}/public/workspaces/${slug}/feedback/`;  
        
        fetchAllFeedback(token, url);
    },[slug, token, workspace])

        if(isLoading) return <> ...Loading </>
  return (
    <>
      
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
          {allFeedback.map((item, index) => (
            <FeedbackItem key={index} token={token} feedback={item} />
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
