"use client";
import React, { useState, useEffect } from "react";
import { FC } from "react";
import { LinearTeam } from "@/lib/types/linearTeam";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "@/utils/constants/api-endpoints";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";

type TeamCreateProps = {
  token: string;
  response: LinearTeam[];
};

const SelectTeam: FC<TeamCreateProps> = ({ token, response }) => {
  const router = useRouter();
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [workspaceName, setWorkspaceName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const storedWorkspace = localStorage.getItem("workspace_slug");
    setWorkspaceName(storedWorkspace);
  }, []);

  const handleTeamSelect = (teamId: string) => {
    setSelectedTeamId(teamId);
    setIsOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedTeamId || !workspaceName) {
      alert("Please select a team and ensure workspace is set.");
      return;
    }

    setLoading(true);

    const teamObject = response.find(
      (team) => team.id.toString() === selectedTeamId
    );
    if (!teamObject) {
      alert("Team not found in response.");
      setLoading(false);
      return;
    }

    const data = {
      linearTeamId: teamObject.id,
      name: teamObject.name,
      key: teamObject.key,
    };

    try {
      const postResponse = await fetch(
        `${BACKEND_URL}/workspaces/${workspaceName}/teams/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (postResponse.ok) {
        router.push("/dashboard");
      } else {
        alert("Failed to create team. Please try again.");
      }
    } catch (error) {
      console.error("Error creating team:", error);
      alert("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  const selectedTeam = response.find(team => team.id.toString() === selectedTeamId);

  return (
    <div className="min-h-screen bg-[#0C0C0C] flex flex-col">
      <header className="flex items-center justify-between px-5 py-2.5 border-b border-white/10">
        <span className="text-white font-medium text-sm">
          userArray
        </span>
        <nav className="flex items-center gap-4">
          <button 
            onClick={() => window.open('https://github.com/sajdakabir/userarray', '_blank')}
            className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            GitHub
          </button>
          <button 
            onClick={() => window.open('https://userarray.com/changelog', '_blank')}
            className="text-xs bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md text-white transition-colors cursor-pointer"
          >
            Demo
          </button>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center -mt-20">
        <div className="w-full max-w-[360px] space-y-5">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-10 h-10">
              <img 
                src="/linear-white-logo.svg" 
                alt="Linear Logo" 
                className="w-full h-full"
              />
            </div>
            <div className="text-center space-y-1.5">
              <h1 className="text-xl font-semibold tracking-tight text-white">
                Sync Linear team with your userArray public board
              </h1>
              <p className="text-xs text-zinc-400">
                Choose a team to connect with "{workspaceName}"
              </p>
            </div>
          </div>

          <div className="bg-white/5 rounded-md p-3 space-y-3">
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 text-white">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-xs text-white">
                Issues and current cycle with status from your Linear team will be publicly visible at userarray/{workspaceName}
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 text-white">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-xs text-white">
                You can customize later in settings which issues to sync
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-[#0C0C0C] border border-zinc-800 rounded-md px-3 py-2 text-left text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/10 transition-colors hover:bg-white/5"
              >
                <div className="flex items-center justify-between">
                  <span className={selectedTeam ? 'text-white' : 'text-zinc-500'}>
                    {selectedTeam ? selectedTeam.name : 'Select a team'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-[#1C1C1C] border border-zinc-800 rounded-md shadow-lg overflow-hidden">
                  <div className="max-h-48 overflow-y-auto">
                    {response.map((team) => (
                      <button
                        key={team.id.toString()}
                        type="button"
                        onClick={() => handleTeamSelect(team.id.toString())}
                        className="w-full px-3 py-2 text-left text-sm text-white hover:bg-white/5 flex items-center justify-between group"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="w-5 h-5 flex items-center justify-center rounded bg-white/5 text-xs font-medium text-white">
                            {team.key}
                          </span>
                          <span>{team.name}</span>
                        </div>
                        {selectedTeamId === team.id.toString() && (
                          <Check className="w-3.5 h-3.5 text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Button 
                type="submit"
                disabled={loading || !selectedTeamId}
                className="w-full bg-white hover:bg-zinc-100 text-black h-8 text-sm font-normal disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && (
                  <div className="mr-2 h-3 w-3 animate-spin rounded-full border-[1.5px] border-black border-t-transparent" />
                )}
                Continue with Linear
              </Button>
              <button 
                type="button"
                onClick={() => router.push('/dashboard')}
                className="w-full text-xs text-zinc-400 hover:text-white transition-colors"
              >
                I'll do this later
              </button>
            </div>
          </form>
        </div>
      </main>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2">
        <div className="flex gap-1.5">
          {[...Array(7)].map((_, i) => (
            <div 
              key={i} 
              className={`w-1 h-1 rounded-full ${i === 6 ? 'bg-white' : 'bg-white/20'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectTeam;
