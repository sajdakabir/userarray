"use client";

import { NextButton } from "@/components/ui/custom-buttons";
import { useEffect, useState } from "react";
import { USER_WORKSPACE } from "@/utils/constants/api-endpoints";
import axios, { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import { dataStore, userStore } from "@/utils/store/zustand";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const SpaceSettingClient = (props: {
  id: string;
  accessToken: string;
  slug: string;
}) => {
  // Global states

  const setSlug = userStore((state) => state.setSlug);
  const setActive = userStore((state) => state.setCurrent);

  const stateStorage = dataStore((state) => state.stateStorage);
  const workspaces = dataStore((state) => state.workspaces);
  const buildStateStorage = dataStore((state) => state.buildStateStorage);

  const spaces = stateStorage!.spaces;
  const workspace = workspaces.find((w) => w.slug === props.slug);
  // Getting the index of the current space from the array of spaces
  const index = spaces.findIndex((space) => space._id === props.id);

  // Local states
  const [name, setName] = useState<string>(spaces[index].name);
  const [iden, setIden] = useState<string>(spaces[index].identifier);

  const [changed, setChanged] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [deload, setDeload] = useState<boolean>(false);

  const { toast } = useToast();

  useEffect(() => {
    setActive(`${spaces[index].name}-gen`);
    setSlug(props.slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (name !== spaces[index].name || iden !== spaces[index].identifier)
      setChanged(true);
    else setChanged(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iden, name]);

  const handleNameChange = (e: { target: { value: string } }) => {
    const _name = e.target.value;
    setName(_name);
    const res = _name.substring(0, 3).toUpperCase();
    setIden(res);
  };

  const handleUpdate = async () => {
    if (!name || !iden) {
      toast({
        title: "Please enter a name and identifier!",
      });
      return;
    } else if (name.includes(" ") || iden.includes(" ")) {
      toast({
        title: "Name and identifier can't contain spaces!",
      });
      return;
    }
    setLoading(true);
    try {
      await axios.patch(
        USER_WORKSPACE + `/${props.slug}/spaces/${spaces[index].name}`,
        {
          name: name,
          identifier: iden,
        },
        {
          headers: {
            Authorization: "Bearer " + props.accessToken,
          },
        }
      );

      setChanged(false);
      toast({
        title: "Space updated successfully!",
      });
      setLoading(false);
      // Update global state with latest updated data from backend
      await buildStateStorage(props.accessToken, props.slug, workspace!);
    } catch (error) {
      setLoading(false);
      const e = error as AxiosError;
      console.error(e.message);
      toast({
        variant: "destructive",
        title: "Something Went Wrong!",
      });
    }
  };

  const deleteSpace = async () => {
    setDeload(true);
    try {
      await axios.delete(
        USER_WORKSPACE + `/${props.slug}/spaces/${spaces[index].name}`,
        {
          headers: {
            Authorization: "Bearer " + props.accessToken,
          },
        }
      );
    } catch (error) {
      const e = error as AxiosError;
      console.error(e.message);
      toast({
        variant: "destructive",
        title: "Could not delete space",
      });
      return;
    }

    setLoading(false);
    toast({
      title: "Space Deleted successfully!",
    });
    // Update global state with latest updated data from backend
    // As space is deleted, move user to workspace settings page
    window.location.href = `/${props.slug}/settings`;
  };

  return (
    <section className="flex-grow min-h-screen right-0 bg-dashboard md:px-24 md:py-16 overflow-y-auto">
      <div className="w-4/5">
        <form className="w-72 mx-auto md:mx-0">
          <h2 className="text-xl font-medium text-focus-text-hover">
            {spaces[index].name} space settings
          </h2>

          <h4 className="text-focus-text text-sm mt-2">
            Manage all the settings for space
          </h4>

          <div className="flex flex-col gap-2 mt-16">
            <div className="flex flex-col">
              <label
                className="text-focus-text mb-2 text-sm"
                htmlFor="spacename"
              >
                Space Name
              </label>
              <input
                type="spacename"
                name="spacename"
                id="spacename"
                value={name}
                onChange={handleNameChange}
                required={true}
                className="py-[6px] text-sm"
              />
            </div>
            <div className="flex flex-col">
              <label
                className="text-focus-text mb-2 text-sm"
                htmlFor="spaceidentity"
              >
                Space Identifier
              </label>
              <input
                type="spaceidentity"
                name="spaceidentity"
                id="spacename"
                value={iden}
                onChange={(e) => {
                  setIden(e.target.value);
                  setChanged(true);
                }}
                className="uppercase py-[6px] text-sm"
                maxLength={4}
                required={true}
              />
            </div>
            <NextButton
              type="button"
              handleClick={handleUpdate}
              text="Update"
              loading={loading}
              disabled={!changed}
              className={`mt-6 text-sm py-[6px] ${
                changed ? "" : "bg-focus-text"
              }`}
            />
          </div>

          <div className="h-[1px] w-full bg-classic-button my-10"></div>

          <h4 className="text-focus-text text-sm">
            Delete {spaces[index].name} permanantly
          </h4>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="mt-4 hover:text-focus-text-hover bg-red-500 text-sm py-[6px] w-full rounded-lg font-medium">
                Delete Space
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-dashboard sm:rounded-[10px] p-6 text-focus-text-hover border-nonfocus-text border-none w-[25rem]">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your space and remove your work items from march.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-focus-text-hover text-sm text-gray-800 font-medium px-3 py-1 rounded-lg flex justify-center items-center mr-3">
                  Cancel
                </AlertDialogCancel>
                <NextButton
                  type="button"
                  handleClick={deleteSpace}
                  text={`Delete Space`}
                  loading={deload}
                  className={`text-black hover:text-focus-text-hover bg-red-500 text-sm px-3 py-1 w-fit`}
                />
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </form>
      </div>
    </section>
  );
};

export default SpaceSettingClient;
