"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import { TerminalSquare } from "lucide-react";
import { UserWorkspaces } from "@/lib/types/Workspaces";
import { ClassicButton, NextButton } from "@/components/ui/custom-buttons";
import { GET_USER, USER_WORKSPACE } from "@/utils/constants/api-endpoints";

const InviteMembers = (props: {
  accessToken: string;
  workSpaces: UserWorkspaces;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [skipLoading, setSkipLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("It's time to get things done.");
  const [role, setRole] = useState<string>("member");
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSkip = async () => {
    setSkipLoading(true);
    let noError: boolean = true;
    try {
      // Update User Profile
      const userbody = {
        hasFinishedOnboarding: true,
      };
      const { data } = await axios.patch(GET_USER, userbody, {
        headers: {
          Authorization: "Bearer " + props.accessToken,
        },
      });
    } catch (error) {
      noError = false;
      const e = error as AxiosError;
      console.error(e.response?.data);
      setError("Something Went Wrong!");
    }
    // Redirect to workspace if not error
    if (noError) window.location.href = "/workspace";
    setSkipLoading(false);
  };

  const handleSubmit = async () => {
    if (!email) {
      setError("Please enter member email");
      return;
    } else if (!message) {
      setError("Please leave a message");
      return;
    }
    setLoading(true);
    let noError: boolean = true;
    // Invite Member
    try {
      const body = {
        email: email,
        role: role,
        redirectUrl: "/",
        message: message,
      };
      await axios.post(
        USER_WORKSPACE + `/${props.workSpaces.response[0].slug}/invite/`,
        body,
        {
          headers: {
            Authorization: "Bearer " + props.accessToken,
          },
        }
      );
      // Update User Profile
      const userbody = {
        onboarding: {
          workspace_invite: true,
        },
        hasFinishedOnboarding: true,
      };
      const { data } = await axios.patch(GET_USER, userbody, {
        headers: {
          Authorization: "Bearer " + props.accessToken,
        },
      });
    } catch (error) {
      noError = false;
      const e = error as AxiosError;
      console.error(e.response?.data);
      setError("Something Went Wrong!");
    }
    // Redirect to workspace if not error
    if (noError) window.location.href = "/workspace";
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-auth-background grid place-items-center">
      <section className="md:w-[450px] w-96 px-8">
        <div className="px-8 2xl:px-16 mb-6">
          <h2 className="text-lg text-focus-text font-medium mb-4">
            Invite Members to Workspace
          </h2>

          <div className="h-16 w-fit rounded-full bg-divider flex items-center gap-2 px-4">
            <TerminalSquare
              strokeWidth={1.5}
              size={32}
              className="text-focus-text-hover"
            />

            <span className="text-xl text-focus-text-hover font-medium">
              {props.workSpaces.response[0].name}
            </span>
          </div>
        </div>

        <div className="w-full flex flex-col gap-2 px-8 2xl:px-16">
          <div className="flex flex-col">
            <label className="text-focus-text mb-2 text-sm" htmlFor="workspace">
              Member email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="johndoe@email.com"
              autoComplete="email"
              required={true}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-focus-text mb-2 text-sm" htmlFor="workspace">
              Select role
            </label>
            {/* <select
                className="w-full rounded-lg focus:outline-none p-2 border border-[#2a2c31] bg-[#4d4d4d0a] text-black"
                name="role"
                id="role"
                onChange={(e) => {
                  setRole(e.target.value);
                }}
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select> */}
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
            <label className="text-focus-text mb-2 text-sm" htmlFor="message">
              Leave a message
            </label>
            <input
              type="message"
              name="message"
              id="message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setError("");
              }}
              autoComplete="message"
              required={true}
            />

            {error && (
              <span className="text-sm mt-1 text-red-600">{error}</span>
            )}
          </div>

          <NextButton
            text="Next"
            loading={loading}
            className={"mt-4"}
            handleClick={handleSubmit}
          />

          <ClassicButton
            loading={skipLoading}
            text="Skip"
            className="hover:shadow-md hover:shadow-black/30"
            handleClick={handleSkip}
          />
        </div>
      </section>
    </main>
  );
};

export default InviteMembers;
