"use client";

import { dataStore, userStore } from "@/utils/store/zustand";
import {  Orbit } from "lucide-react";
import { useEffect,  useState, } from "react";

import { usePathname } from "next/navigation";
import IssueCard from "@/components/issueCard/IsshueCard";

const PlanClient = (props: { token: string; slug: string; space: string }) => {
  
  const pathname = usePathname();
  const setCurrent = userStore((state) => state.setCurrent);

  const allIssues = dataStore((state) => state.fetchAllIssues);
  const issueStatus = dataStore((state) => state.issueStatus);
  const allLinearIssues = dataStore((state) => state.allLinearIssues);
  
  
 

  useEffect(() => {
   
    allIssues(props.token, pathname.split("/")[2],'plan');
  }, [pathname.split("/")[2]]);

  

 

  useEffect(() => {
    setCurrent(`${props.space}-plan`);
  }, [props.space, setCurrent]);

 
 

 


  return (
    <section className="h-screen flex flex-col gap-y-12 flex-grow right-0 bg-dashboard pt-8">
      <div className="mx-20">
        <h2 className="text-xl flex items-center font-medium text-focus-text-hover">
          <Orbit className="mr-2" size={20} />
          Plan
        </h2>
        <h4 className="text-focus-text text-sm mt-2 flex items-center">
          All your work items: your playground from where you push things to be
          executed.
        </h4>
      </div>

      
         
          
          <IssueCard token={props.token}  issue={allLinearIssues} issueStatus={issueStatus} />

         
       
    </section>
  );
};

export default PlanClient;
