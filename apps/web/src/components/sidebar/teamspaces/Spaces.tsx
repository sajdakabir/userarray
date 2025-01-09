"use client";

import EachSpace from "./EachSpace";
import { Divide, Orbit, Plus, Zap } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NextButton } from "@/components/ui/custom-buttons";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { USER_WORKSPACE } from "@/utils/constants/api-endpoints";
import axios, { AxiosError } from "axios";

import { dataStore, userStore } from "@/utils/store/zustand";
import { SingleSpace } from "@/lib/types/Spaces";
import Spinner from "@/components/loaders/Spinner";

const Spaces = (props: { accessToken: string }) => {
  // Global states
  const myTeams = dataStore((state) => state.myTeams);

  const fetchTeam= dataStore((state) => state.fetchMyTeams);
 
  const { toast } = useToast();

  useEffect(() => {

    fetchTeam(props.accessToken);
  },[])

  if(myTeams.length<1)return <div className="flex items-center gap-3 text-sm text-zinc-600 "> <button className="flex gap-1 mt-2 items-center" disabled> <Zap size={14} /> Cycle</button>  <button className="flex gap-1 mt-2 items-center" disabled> <Orbit size={14} /> Plan</button>  </div>

  return (
    <div className="w-full">
      

      {myTeams.length > 0 ? (
        <div className="flex flex-col gap-2 w-full pr-2">
          {myTeams.map((space) => (
            <EachSpace
            space={space}
              key={space._id}
              
            />
          ))}
        </div>
      ) : (
        <div className="pr-2 mt-16 max-w-60 flex flex-col gap-y-4 text-center text-focus-text text-sm">
          <p className="px-4">Your workspace is empty!</p>
          <button
            // onClick={() => isOpen(true)}
            className="underline text-focus-text-hover"
          >
            Create a space
          </button>{" "}
          <p className="px-6">To organize your team works</p>
        </div>
      )}
    </div>
  );
};

export default Spaces;
