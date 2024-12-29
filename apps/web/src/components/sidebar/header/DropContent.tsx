import {
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import { PlusCircle, PlusSquare, Settings, UserPlus } from "lucide-react";
import { SlugCheck, Workspace, WorkspaceBySlug } from "@/lib/types/Workspaces";
import Link from "next/link";
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
import { useState } from "react";
import { NextButton } from "@/components/ui/custom-buttons";
import axios, { AxiosError } from "axios";
import { USER_WORKSPACE } from "@/utils/constants/api-endpoints";
import { dataStore } from "@/utils/store/zustand";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

// million-ignore
const DropContent = (props: {
  workspaces: Workspace[];
  token: string;
  current: Workspace;
  setWorkspace: (slug: string) => void;
}) => {
  // Global States
  const workspaces = dataStore((state) => state.workspaces);
  const setWorkspaces = dataStore((state) => state.setWorkspaces);
  const setStateNull = dataStore((state) => state.setStateNull);

  // Local States
  const [wrkspcName, setName] = useState<string>("");
  const [wrkSlug, setWrkSlug] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [open, isOpen] = useState<boolean>(false);

  const router = useRouter();

  const authHeader = {
    headers: {
      Authorization: "Bearer " + props.token,
    },
  };

  const createWorkpace = async () => {
    if (!wrkspcName || !wrkSlug) {
      setError("please enter a name and slug");
      return;
    }
    else if (wrkspcName.includes(" ") || wrkSlug.includes(" ")) {
      setError("Name and slug can't contain spaces!");
      return;
    }

    setLoading(true);

    try {
      // Check if Workspace available
      const checkRes = await axios.get(
        USER_WORKSPACE + `/workspace-slug-check?slug=${wrkSlug}`,
        authHeader
      );
      const checkAvailable: SlugCheck = checkRes.data;
      if (!checkAvailable.response) {
        setError("Sorry, slug is already taken!");
        toast({
          title: "Please Choose another slug!",
        });
        setLoading(false);
        return;
      }

      // Create Workspace
      const body = {
        slug: wrkSlug,
        name: wrkspcName,
      };
      const res = await axios.post(USER_WORKSPACE, body, authHeader);
      const data: WorkspaceBySlug = res.data;
      let wrkspc = workspaces;
      wrkspc.push(data.response);
      setWorkspaces(wrkspc);
      toast({
        title: "Workspace created successfully!",
      });
      isOpen(false);
      // Set the State Storage null and redirect to new workspace
      // The Dataprovider will fetch the new data and show the loading screen
      setStateNull();
      router.replace(`/${data.response.slug}/today`);
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
    <div className="text-focus-text-hover">
      <DropdownMenuLabel className="px-2 pt-2">
        <div>
          <div className="mx-3">
            <div className="flex items-center gap-2 text-xs text-nonfocus-text font-medium">
              {props.current.name}
            </div>
          </div>
          <div>
            <div className="flex flex-col gap-1 items-start mt-1 mb-2">
              <Link
                href={`/${props.current.slug}/settings`}
                className="text-sm font-normal flex items-center gap-2 hover:bg-sidebar-button-active w-full pl-3 pr-2 py-1 rounded-lg"
              >
                <Settings size={14} />
                Workspace Settings
              </Link>
              <Link
                href={`/${props.current.slug}/settings/members`}
                className="text-sm font-normal flex items-center gap-2 hover:bg-sidebar-button-active w-full pl-3 pr-2 py-1 rounded-lg"
              >
                <UserPlus size={14} />
                Invite Members
              </Link>
            </div>
          </div>
        </div>
      </DropdownMenuLabel>

      <DropdownMenuSeparator className="bg-classic-button-hover mx-4 h-[1px]" />

      <div className="mx-2 mt-2 mb-2">
        <div className="mx-3">
          <div className="flex items-center gap-2 text-xs text-nonfocus-text font-medium">
            Switch Workspace
          </div>
        </div>
        {props.workspaces.length !== 0 ? (
          <div>
            <div className="flex flex-col gap-1 items-start my-2">
              {props.workspaces.map((workspace) => (
                <button
                  onClick={() => {
                    props.setWorkspace(workspace.slug);
                  }}
                  key={workspace._id}
                  className="text-hx flex items-center gap-2 hover:bg-sidebar-button-active w-full pl-3 pr-2 py-1 rounded-lg"
                >
                  <div className="bg-less-highlight h-5 w-5 rounded-md text-black">
                    {workspace.name.charAt(0)}
                  </div>
                  <span>{workspace.name}</span>
                </button>
              ))}
            </div>

            <DropdownMenuSeparator className="bg-classic-button-hover mx-2 mb-1 mt-2 h-[1px]" />
          </div>
        ) : null}

        <div className="mt-2 mb-1 flex flex-col items-start gap-y-[2px]">
          <Dialog open={open} onOpenChange={isOpen}>
            <DialogTrigger asChild>
              <div className="text-sm font-normal flex items-center gap-2 hover:bg-sidebar-button-active w-full pl-3 pr-2 py-1 rounded-lg">
                <PlusCircle size={14} />
                Create Workspace
              </div>
            </DialogTrigger>
            <DialogContent className="bg-dashboard pt-8 text-focus-text-hover border-nonfocus-text border-none w-[25rem]">
              <DialogHeader>
                <DialogTitle>Create Workspace</DialogTitle>
                <DialogDescription>
                  Create a new workspace to manage workloads
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col mt-3 gap-2 w-[18rem]">
                <div className="flex flex-col">
                  <label className="text-focus-text mb-2 text-hx" htmlFor="name">
                    Workspace Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={wrkspcName}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError("");
                    }}
                    autoComplete="name"
                    className="text-sm"
                    required={true}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-focus-text mb-2 text-hx" htmlFor="id">
                    Slug
                  </label>
                  <input
                    type="text"
                    name="id"
                    id="id"
                    value={wrkSlug}
                    onChange={(e) => {
                      setWrkSlug(e.target.value);
                      setError("");
                    }}
                    autoComplete="id"
                    className="text-sm"
                    required={true}
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
              <DialogFooter className="flex items-center justify-end gap-2 mt-6">
                <DialogClose className="bg-transparent text-sm border border-nonfocus-text hover:border-focus-text hover:bg-gray-600/30 text-white p-2 rounded-lg flex justify-center items-center">
                  Cancel
                </DialogClose>
                <NextButton
                  text="Create"
                  type="submit"
                  loading={loading}
                  handleClick={createWorkpace}
                  className="w-fit text-black px-3 py-2 text-sm"
                />
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Link
            href={"#"}
            className="text-sm font-normal flex items-center gap-2 hover:bg-sidebar-button-active w-full pl-3 pr-2 py-1 rounded-lg"
          >
            <PlusSquare size={14} />
            Join Workspace
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DropContent;
