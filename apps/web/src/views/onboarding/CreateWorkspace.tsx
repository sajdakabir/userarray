"use client";

import { useState } from "react";
import axios, { AxiosError } from "axios";
import { TerminalSquare } from "lucide-react";
import { SlugCheck } from "@/lib/types/Workspaces";
import { GET_USER, USER_WORKSPACE } from "@/utils/constants/api-endpoints";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
      setError("Please enter a workspace URL");
      return;
    }
    else if (slug.includes(" ")) {
      setError("URL cannot contain spaces");
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
        setError("This URL is already taken");
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
      setError("Something went wrong!");
    }
    setLoading(false);
  };

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-[#18181B] p-10 text-white lg:flex border-r border-white/10">
        <div className="absolute inset-0 bg-[#18181B]" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Image
            src="/new_logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="mr-2"
          />
          march
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Create your workspace and start collaborating with your team. It's simple, efficient, and incredibly powerful.&rdquo;
            </p>
            <footer className="text-sm text-muted-foreground">Get Started</footer>
          </blockquote>
        </div>
      </div>
      <div className="relative p-4 lg:p-8 h-full flex items-center bg-[#09090B]">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
        <div className="relative mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Create your workspace
            </h1>
            <p className="text-sm text-zinc-400">
              Set up your team's central hub for collaboration
            </p>
          </div>

          <div className="grid gap-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="workspace" className="text-zinc-100">
                  Workspace Name
                </Label>
                <Input
                  id="workspace"
                  name="workspace"
                  value={workspace}
                  onChange={(e) => {
                    setWorkspace(e.target.value);
                    setError("");
                  }}
                  placeholder="My Awesome Team"
                  className="bg-zinc-950/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-400 focus-visible:ring-zinc-500 focus-visible:ring-offset-0"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="slug" className="text-zinc-100">
                  Workspace URL
                </Label>
                <div className="flex items-center gap-1 text-sm text-zinc-400 mb-1.5">
                  <span>app.march.cat/</span>
                  <span className="text-zinc-100">{slug || "your-workspace"}</span>
                </div>
                <Input
                  id="slug"
                  name="slug"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value.toLowerCase());
                    setError("");
                  }}
                  placeholder="your-workspace"
                  className="bg-zinc-950/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-400 focus-visible:ring-zinc-500 focus-visible:ring-offset-0"
                />
                <p className="text-xs text-zinc-400">
                  Only lowercase letters, numbers, and hyphens allowed
                </p>
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
              </div>

              <Button 
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-zinc-50 text-zinc-900 hover:bg-zinc-200"
              >
                {loading && (
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent" />
                )}
                Create Workspace
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkspace;
