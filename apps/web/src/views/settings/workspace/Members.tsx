"use client";

import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { USER_WORKSPACE } from "@/utils/constants/api-endpoints";
import { NextButton } from "@/components/ui/custom-buttons";
import { CircleEllipsisIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { dataStore, userStore } from "@/utils/store/zustand";

const MembersClient: React.FC<{
  accessToken: string;
  slug: string;
}> = (props) => {
  // Global properties
  const setActive = userStore((state) => state.setCurrent);
  const setSlug = userStore((state) => state.setSlug);

  // Local states
  const [message, setMessage] = useState<string>("It's time to get things done.");
  const [role, setRole] = useState<string>("member");
  const [email, setEmail] = useState<string>("");
  const [changed, setChanged] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const { toast } = useToast();

  useEffect(() => {
    if (email) setChanged(true);
    else setChanged(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  useEffect(() => {
    setActive("workMem");
    setSlug(props.slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stateStorage = dataStore((state) => state.stateStorage);
  if (!stateStorage) return null;

  const handleInvite = async () => {
    if (!email) {
      // TODO: toast("Please enter an email!");
      return;
    }
    // TODO: check if it's a valid email, else backend will throw 500
    setLoading(true);
    try {
      const body = {
        email: email,
        role: role,
        redirectUrl: "/",
        message: message,
      };
      await axios.post(USER_WORKSPACE + `/${props.slug}/invite`, body, {
        headers: {
          Authorization: "Bearer " + props.accessToken,
        },
      });

      setChanged(false);
      setOpen(false);
      toast({
        title: "Invitation sent successfully!",
      });
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
      <div className=" w-4/5">
        <div className="w-[32rem] mx-auto md:mx-0">
          <h2 className="text-xl font-medium text-focus-text-hover">Members</h2>

          <h4 className="text-focus-text text-sm mt-2">
            Manage all the members for your workspace
          </h4>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
              <div className="flex-grow my-12">
                <NextButton
                  text="Invite Members"
                  type="button"
                  className="w-fit px-4 py-2 text-sm"
                />
              </div>
            </DialogTrigger>
            <DialogContent className="bg-dashboard pt-8 text-focus-text-hover border-nonfocus-text border-none w-[28rem]">
              <DialogHeader>
                <DialogTitle>Invite New Member</DialogTitle>
              </DialogHeader>
              <form className="mt-4 flex flex-col gap-4">
                <div className="flex flex-col">
                  <label
                    className="text-focus-text mb-2 text-sm"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    className="text-sm"
                    placeholder="johndoe@email.com"
                    autoComplete="email"
                    required={true}
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    className="text-focus-text mb-2 text-sm"
                    htmlFor="role"
                  >
                    Invite As
                  </label>
                  <div className="flex items-center gap-3">
                    <div
                      className={`text-hx ${
                        role === "member"
                          ? "text-highlight border-highlight"
                          : "border-[#2a2c31] text-focus-text hover:text-focus-text-hover"
                      }  px-2 py-1 rounded-lg p-2 border-[1px] bg-[#4d4d4d0a] cursor-pointer`}
                      onClick={() => setRole("member")}
                    >
                      Member
                    </div>
                    <div
                      className={`text-hx ${
                        role === "admin"
                          ? "text-highlight border-highlight"
                          : "border-[#2a2c31] text-focus-text hover:text-focus-text-hover"
                      }  px-2 py-1 rounded-lg p-2 border-[1px] bg-[#4d4d4d0a] cursor-pointer`}
                      onClick={() => setRole("admin")}
                    >
                      Admin
                    </div>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label
                    className="text-focus-text mb-2 text-sm"
                    htmlFor="message"
                  >
                    Leave a message
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows={3}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                    }}
                    autoComplete="message"
                    required={true}
                    className="text-sm rounded-lg focus:outline-none p-2 border-[1px] border-[#2a2c31] bg-[#4d4d4d0a] text-focus-text-hover"
                  />
                </div>
              </form>
              <DialogFooter className="flex items-center justify-end gap-2 mt-4">
                <DialogClose className="bg-transparent text-sm border border-nonfocus-text hover:border-focus-text hover:bg-gray-600/30 text-white rounded-lg p-2 flex justify-center items-center">
                  Cancel
                </DialogClose>
                <NextButton
                  text="Invite"
                  type="submit"
                  loading={loading}
                  handleClick={handleInvite}
                  disabled={!changed}
                  className={`text-black text-sm w-fit py-2 ${
                    changed ? "" : "bg-focus-text"
                  }`}
                />
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="flex-grow flex flex-col gap-4">
            {stateStorage.members.map((M) => (
              <div
                key={M._id}
                className="flex items-center item hover:scale-100 justify-between p-2"
              >
                <div className="flex gap-2 text-focus-text-hover items-center">
                  <p className="text-sm">{M.member.fullName}</p>
                  <span
                    className={`text-xs select-none px-1 ${
                      M.status !== "pending"
                        ? "text-highlight border-highlight"
                        : "text-orange-300 border-orange-300"
                    } rounded-sm border`}
                  >
                    {M.status !== "pending" ? M.role : "invited"}
                  </span>
                </div>
                <p className="text-sm text-nonfocus-text">
                  {M.member.accounts.local.email ||
                    M.member.accounts.google.email}
                </p>
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none focus:outline-none">
                    <CircleEllipsisIcon
                      className="text-classic-button hover:text-focus-text-hover"
                      size={18}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-sidebar min-w-fit rounded-[10px] flex flex-col gap-y-1 text-focus-text-hover border-sidebar-button-active">
                    <Popover>
                      <button className="text-xs p-1 px-2 rounded-md text-left hover:bg-sidebar-button-hover hover:text-focus-text-hover">
                        Resend invite
                      </button>
                      <PopoverTrigger className="text-xs outline-none focus:outline-none p-1 px-2 rounded-md text-left hover:bg-sidebar-button-hover hover:text-focus-text-hover">
                        {M.status === "pending"
                          ? "Revoke invite"
                          : "Remove user"}
                      </PopoverTrigger>
                    </Popover>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MembersClient;
