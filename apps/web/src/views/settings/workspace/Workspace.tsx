"use client";

import axios, { AxiosError } from "axios";
import { GetAvatarFromName } from "@/utils/helpers";
import { useEffect, useState } from "react";
import { FormButton, NextButton } from "@/components/ui/custom-buttons";
import { USER_WORKSPACE } from "@/utils/constants/api-endpoints";
import { useToast } from "@/components/ui/use-toast";
import { dataStore, userStore } from "@/utils/store/zustand";
import { Workspace } from "@/lib/types/Workspaces";

const WorkspaceClient: React.FC<{
  accessToken: string;
  slug: string;
}> = (props) => {
  // Global states
  const slug = userStore((state) => state.slug);
  const setSlug = userStore((state) => state.setSlug);
  const setActive = userStore((state) => state.setCurrent);
  const workspaces = dataStore((state) => state.workspaces);
  const fetchWorkspaces = dataStore((state) => state.fetchWorkspaces);

  const found = workspaces.find((workspace) => workspace.slug === slug);
  // I am damn sure we found !! cause wrong slug will be directed to error page
  const workspace: Workspace = found ? found : workspaces[0];

  const [name, setName] = useState<string>(workspace.name);
  const [changed, setChanged] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { toast } = useToast();

  useEffect(() => {
    setActive("workGen");
    setSlug(props.slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdate = async () => {
    if (!name) {
      toast({
        title: "Please enter a workspace name!",
      });
      return;
    } else if (name.includes(" ")) {
      toast({
        title: "Workspace name can't contain spaces!",
      });
      return;
    }

    setLoading(true);

    try {
      await axios.patch(
        USER_WORKSPACE + `/${slug}`,
        {
          name: name,
        },
        {
          headers: {
            Authorization: "Bearer " + props.accessToken,
          },
        }
      );

      setChanged(false);
      toast({
        title: "Workspace updated successfully!",
      });
      // Update the Global state with latest data from backend
      fetchWorkspaces(props.accessToken);
    } catch (error) {
      const e = error as AxiosError;
      console.error(e.message);
      toast({
        variant: "destructive",
        title: "Something Went Wrong!",
      });
    }

    setLoading(false);
  };

  return (
    <section className="flex-grow min-h-screen right-0 bg-dashboard md:px-24 md:py-16 overflow-y-auto">
      <div className="w-4/5">
        <form className="mx-auto md:mx-0">
          <h2 className="text-xl font-medium text-focus-text-hover">
            Workspace
          </h2>

          <h4 className="text-focus-text text-sm mt-2">
            Manage all the settings for your organization
          </h4>

          <div className="w-72 flex items-center justify-between mt-16">
            <div className="h-28 w-28 rounded-3xl bg-bg-gradient-light grid place-items-center text-4xl text-focus-text-hover font-medium">
              {GetAvatarFromName(workspace.name)}
            </div>
            <FormButton type="button" text="Upload Avatar" />
          </div>

          <div className="flex flex-col gap-4 mt-10 w-72">
            <div className="flex flex-col">
              <label className="text-focus-text mb-2 text-sm" htmlFor="name">
                Workspace Name
              </label>
              <input
                type="name"
                name="name"
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setChanged(true);
                }}
                autoComplete="name"
                required={true}
                className="py-[6px]"
              />
            </div>
            <NextButton
              type="button"
              handleClick={handleUpdate}
              text="Update"
              loading={loading}
              disabled={!changed}
              className={` text-sm py-2 ${changed ? "" : "bg-focus-text"}`}
            />
          </div>
        </form>
      </div>
    </section>
  );
};

export default WorkspaceClient;
