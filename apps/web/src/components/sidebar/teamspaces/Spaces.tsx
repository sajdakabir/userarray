"use client";

import EachSpace from "./EachSpace";
import { Divide, Plus } from "lucide-react";
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

const Spaces = (props: { accessToken: string }) => {
  // Global states
  const slug = userStore((state) => state.slug);
  const workspaces = dataStore((state) => state.workspaces);
  const setWorkspaces = dataStore((state) => state.setWorkspaces);
  const stateStorage = dataStore((state) => state.stateStorage);
  const buildStateStorage = dataStore((state) => state.buildStateStorage);

  // Local States
  const [spaceName, setName] = useState<string>("");
  const [spaceId, setId] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [open, isOpen] = useState<boolean>(false);

  const { toast } = useToast();

  useEffect(() => {
    if (!spaceName || spaceName.length < 3) {
      setId(spaceName.toUpperCase());
    }
    const res = spaceName.substring(0, 3).toUpperCase();
    setId(res);
  }, [spaceName]);

  const spaces = useMemo(() => {
    if (!stateStorage) return [];
    return stateStorage.spaces;
  }, [stateStorage]);

  if (!stateStorage) return null;

  // const updateStateStorage = async (space: SingleSpace) => {
  //   let ws = workspaces;
  //   const index = workspaces.findIndex((w) => w.slug === slug);
  //   let work = ws[index];
  //   work.teams.push(space.response);
  //   ws[index] = work;
  //   setWorkspaces(ws);
  //   await buildStateStorage(props.accessToken, slug, work);
  // };

  // const createSpace = async () => {
  //   if (!spaceName || !spaceId) {
  //     setError("please enter a name and Identifier");
  //     return;
  //   } else if (spaceName.includes(" ") || spaceId.includes(" ")) {
  //     setError("Name and identifier can't contain spaces!");
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     const { data } = await axios.post(
  //       USER_WORKSPACE + `/${slug}/spaces`,
  //       {
  //         name: spaceName,
  //         identifier: spaceId,
  //       },
  //       {
  //         headers: {
  //           Authorization: "Bearer " + props.accessToken,
  //         },
  //       }
  //     );
  //     toast({
  //       title: "Space created successfully!",
  //     });
  //     isOpen(false);
  //     // update the state storage with the latest data
  //     await updateStateStorage(data);
  //   } catch (error) {
  //     const e = error as AxiosError;
  //     console.error(e.message);
  //     toast({
  //       variant: "destructive",
  //       title: "Something Went Wrong!",
  //     });
  //   }
  //   setLoading(false);
  // };

  return (
    <div className="w-full">
      {/* <p className="text-xs my-2 mx-2 flex items-center justify-between text-nonfocus-text">
        <span>Teamspaces</span>

        <Dialog open={open} onOpenChange={isOpen}>
          <DialogTrigger asChild>
            <button className="hover:text-focus-text-hover hover:bg-sidebar-button-hover rounded-md p-[2px]">
              <Plus size={16} />
            </button>
          </DialogTrigger>
          <DialogContent className="bg-dashboard pt-8 text-focus-text-hover border-nonfocus-text border-none w-[25rem]">
            <DialogHeader>
              <DialogTitle>Create Space</DialogTitle>
              <DialogDescription>
                Create a space to organize your team works
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col mt-3 gap-2 w-[18rem]">
              <div className="flex flex-col">
                <label className="text-focus-text mb-2 text-hx" htmlFor="name">
                  Space Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={spaceName}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError("");
                  }}
                  autoComplete="name"
                  className="text-sm py-[6px]"
                  required={true}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-focus-text mb-2 text-hx" htmlFor="id">
                  Space Identifier
                </label>
                <input
                  type="text"
                  name="id"
                  id="id"
                  value={spaceId}
                  onChange={(e) => {
                    setId(e.target.value);
                    setError("");
                  }}
                  autoComplete="id"
                  className="text-sm uppercase py-[6px]"
                  maxLength={4}
                  required={true}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
            <DialogFooter className="flex items-center justify-end gap-2 mt-6">
              <DialogClose className="bg-transparent text-sm border border-nonfocus-text hover:border-focus-text hover:bg-gray-600/30 text-white px-2 py-[7px] rounded-lg flex justify-center items-center">
                Cancel
              </DialogClose>
              <NextButton
                text="Create Space"
                type="submit"
                loading={loading}
                handleClick={createSpace}
                className="w-fit text-black p-2 text-sm"
              />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </p> */}

      {spaces.length > 0 ? (
        <div className="flex flex-col gap-2 w-full pr-2">
          {spaces.map((space) => (
            <EachSpace
              key={space._id}
              space={space}
              
            />
          ))}
        </div>
      ) : (
        <div className="pr-2 mt-16 max-w-60 flex flex-col gap-y-4 text-center text-focus-text text-sm">
          <p className="px-4">Your workspace is empty!</p>
          <button
            onClick={() => isOpen(true)}
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
