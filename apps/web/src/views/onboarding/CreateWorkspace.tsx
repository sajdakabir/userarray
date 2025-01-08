"use client";

import axios from "axios";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { GET_USER, USER_WORKSPACE } from "@/utils/constants/api-endpoints";

const CreateWorkspace = (props: { accessToken: string }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [workspaceName, setWorkspaceName] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [error, setError] = useState<string>("");

  const authHeader: { headers: { Authorization: string } } = {
    headers: {
      Authorization: "Bearer " + props.accessToken,
    },
  };
  
  const isValidSlug = (slug: string) => {
    return /^[a-z0-9-]+$/.test(slug);
  };

  const handleSubmit = async () => {
    if (!workspaceName) {
      setError("Please enter a board name");
      return;
    }
    if (!slug) {
      setError("Please enter a URL");
      return;
    }
    if (!isValidSlug(slug)) {
      setError("URL can only contain lowercase letters, numbers, and hyphens");
      return;
    }

    setLoading(true);

    try {
      // Check if Workspace available
      const checkRes = await axios.get(
        USER_WORKSPACE + `/workspace-slug-check?slug=${slug}`,
        authHeader
      );
      
      if (!checkRes.data.response) {
        setError("This URL is already taken");
        setLoading(false);
        return;
      }

      // Create workspace
      const response_workSpace = await axios.post(USER_WORKSPACE, {
        name: workspaceName,
        slug: slug
      }, authHeader);
      
      if(response_workSpace.status === 200) {
        localStorage.setItem("workspace_slug", slug);
        
        // Update user onboarding status
        await axios.patch(GET_USER, {
          onboarding: {
            workspace_create: true
          }
        }, authHeader);

        location.reload();
      }
    } catch (error: any) {
      console.error(error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong!");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] flex flex-col">
      <header className="flex items-center justify-between px-6 py-3 border-b border-white/10">
        <span className="text-white font-medium">
          userArray
        </span>
        <nav className="flex items-center gap-6">
          <button 
            onClick={() => window.open('https://github.com/sajdakabir/userarray', '_blank')}
            className="text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            GitHub
          </button>
          <button 
            onClick={() => window.open('https://userarray.com/changelog', '_blank')}
            className="text-sm bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-md text-white transition-colors cursor-pointer"
          >
            Demo
          </button>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center -mt-24">
        <div className="w-full max-w-[320px] space-y-4">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Create your public board
            </h1>
            <p className="text-sm text-zinc-400">
              Need custom domain? <a href="mailto:hello@userarray.com" className="text-white hover:text-zinc-200">Contact us</a>
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workspaceName" className="text-sm text-zinc-400">
                Board Name
              </Label>
              <Input
                id="workspaceName"
                name="workspaceName"
                value={workspaceName}
                onChange={(e) => {
                  const name = e.target.value;
                  setWorkspaceName(name);
                  // Auto-generate slug from workspace name
                  setSlug(name.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, ''));
                }}
                placeholder="Acme Corp"
                className="bg-[#0C0C0C] border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-500 focus-visible:ring-offset-0 h-9"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workspaceUrl" className="text-sm text-zinc-400">
                Public URL
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-500">userarray.com/</span>
                <Input
                  id="workspaceUrl"
                  name="workspaceUrl"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase())}
                  placeholder="acme-corp"
                  className="bg-[#0C0C0C] border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-500 focus-visible:ring-offset-0 h-9"
                />
              </div>
              <p className="text-xs text-zinc-500">
                Only lowercase letters, numbers, and hyphens are allowed
              </p>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>

            <Button 
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-white text-black hover:bg-zinc-100 h-9 font-normal"
            >
              {loading && (
                <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-black border-t-transparent" />
              )}
              Create public board
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateWorkspace;