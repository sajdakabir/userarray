"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import { TerminalSquare } from "lucide-react";
import { SlugCheck } from "@/lib/types/Workspaces";
import { NextButton } from "@/components/ui/custom-buttons";
import { GET_USER, USER_WORKSPACE } from "@/utils/constants/api-endpoints";

const CreateWorkspace = (props: { accessToken: string }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [workspace, setWorkspace] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [error, setError] = useState<string>("");

  const authHeader = {
    headers: {
      Authorization: "Bearer " + props.accessToken,
    },
  };

  const handleSubmit = async () => {
    if (!workspace) {
      setError("Please enter a workspace name");
      return;
    } else if (!slug) {
      setError("Please Enter a slug name");
      return;
    }
    else if (slug.includes(" ")) {
      setError("Slug cannot contain spaces");
      return;
    }
    setLoading(true);

    try {
      // Check if Workspace available
      const checkRes = await axios.get(
        USER_WORKSPACE + `/workspace-slug-check?slug=${slug}`,
        authHeader
      );
      const checkAvailable: SlugCheck = checkRes.data;
      if (!checkAvailable.response) {
        setError("Slug name is taken");
        setLoading(false);
        return;
      }

      // Create Workspace
      const body = {
        slug: slug,
        name: workspace,
      };
      await axios.post(USER_WORKSPACE, body, authHeader);

      // Update User Profile
      const userbody = {
        onboarding: {
          workspace_create: true,
        },
      };
      await axios.patch(GET_USER, userbody, authHeader);

      // Reload the page on success
      location.reload();
    } catch (error) {
      const e = error as AxiosError;
      console.error(e.response?.data);
      setError("Something Went Wrong!");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-auth-background grid place-items-center">
      <section className="md:w-[450px] w-96 px-8">
        <div className="px-8 2xl:px-16 mb-6">
          <h2 className="text-lg text-focus-text font-medium mb-4">
            Create Your Workspace
          </h2>

          <div>
            <div className="h-16 w-fit rounded-full bg-divider flex items-center gap-2 px-4">
              <TerminalSquare
                strokeWidth={1.5}
                size={32}
                className="text-focus-text-hover"
              />
              {workspace && (
                <span className="text-xl text-focus-text-hover font-medium">
                  {workspace}
                </span>
              )}
            </div>
            
          </div>
        </div>

        <div className="w-full flex flex-col gap-2 px-8 2xl:px-16">
          <div className="flex flex-col">
            <label className="text-focus-text mb-2" htmlFor="workspace">
              Workspace Name
            </label>
            <input
              type="workspace"
              name="workspace"
              id="workspace"
              value={workspace}
              onChange={(e) => {
                setWorkspace(e.target.value);
                setError("");
              }}
              placeholder="workspace"
              autoComplete="workspace"
              required={true}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-focus-text mb-2" htmlFor="slug">
              Workspace URL
            </label>
            <h3
              className={`${
                slug ? "text-focus-text-hover" : "text-focus-text"
              } mb-3 text-md font-medium rounded-md`}
            >
              {slug ? `app.march.cat/${slug}` : "app.march.cat/"}
            </h3>
            <input
              type="slug"
              name="slug"
              id="slug"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setError("");
              }}
              placeholder="URL"
              autoComplete="slug"
              required={true}
            />

            {error && (
              <span className="text-sm mt-1 text-red-600">{error}</span>
            )}
          </div>

          <NextButton
            text="Next"
            loading={loading}
            className={"mt-3"}
            handleClick={handleSubmit}
          />
        </div>
      </section>
    </main>
  );
};

export default CreateWorkspace;
