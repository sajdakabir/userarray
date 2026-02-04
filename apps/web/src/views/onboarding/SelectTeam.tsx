"use client";
import React, { useState } from "react";
import { FC } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import axios from "axios";
import { LinearTeam } from "@/types/linearTeam";
import { BACKEND_URL } from "@/config/apiConfig";
import Image from "next/image";

type TeamCreateProps = {
  token: string;
  response: LinearTeam[];
  workspace:string
};

const SelectTeam: FC<TeamCreateProps> = ({ token, response,workspace }) => {
  const router = useRouter();
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);

  

  const handleTeamSelect = (teamId: string) => {
    setSelectedTeamId(teamId);
    setIsOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    if (!selectedTeamId || !workspace) {
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
      // Create team via POST request
      const postResponse = await fetch(
        `${BACKEND_URL}/workspaces/${workspace}/teams/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
  
      if (!postResponse.ok) {
        alert("Failed to create team. Please try again.");
       
        return;
      }
  
      // Update onboarding status
      const onboardingData = {
        onboarding: {
          team_create: true,
        },
        hasFinishedOnboarding: true,
      };
  
      // Sending PATCH request to update user information
      const patchResponse = await axios.patch(
        `${BACKEND_URL}/users/me`,
        onboardingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (patchResponse.status === 200) {
        setLoading(false);
        router.push(`/${workspace}/feedback`);
      } else {
        alert("Failed to update user onboarding.");
      }
    } catch (error) {
      console.error("Error creating team:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);  // Ensure loading is set to false after completion
    }
  };
  
  

  const selectedTeam = response.find(
    (team) => team.id.toString() === selectedTeamId
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="flex items-center justify-between px-5 py-2.5 border-b border-gray-200">
        <span className="text-black font-medium text-sm">userArray</span>
        <nav className="flex items-center gap-4">
          <button
            onClick={() =>
              window.open("https://github.com/sajdakabir/userarray", "_blank")
            }
            className="text-xs text-gray-600 hover:text-black transition-colors cursor-pointer"
          >
            GitHub
          </button>
          <button
            onClick={() =>
              window.open("https://userarray.com/changelog", "_blank")
            }
            className="text-xs bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-md text-black transition-colors cursor-pointer"
          >
            Demo
          </button>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center -mt-20">
        <div className="w-full max-w-[360px] space-y-5">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-10 h-10">
              <Image
                src="/linear-white-logo.svg"
                alt="Linear Logo"
                width={40}
                height={40}
                className="w-full h-full"
              />
            </div>
            <div className="text-center space-y-1.5">
              <h1 className="text-xl font-semibold tracking-tight text-black">
                Sync Linear team with your userArray public board
              </h1>
              <p className="text-xs text-gray-600">
                Choose a team to connect with {workspace}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-md p-3 space-y-3">
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 text-black">
                <svg
                  viewBox="0 0 24 24"
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M20 6L9 17l-5-5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-xs text-gray-700">
                Issues and current cycle with status from your Linear team will
                be publicly visible at userarray/{workspace}
              </p>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 text-black">
                <svg
                  viewBox="0 0 24 24"
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M20 6L9 17l-5-5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-xs text-gray-700">
                You can customize later in settings which issues to sync
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-left text-black text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={selectedTeam ? "text-black" : "text-gray-500"}
                  >
                    {selectedTeam ? selectedTeam.name : "Select a team"}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-600 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </div>
              </button>

              {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg overflow-hidden">
                  <div className="max-h-48 overflow-y-auto">
                    {response.map((team) => (
                      <button
                        key={team.id.toString()}
                        type="button"
                        onClick={() => handleTeamSelect(team.id.toString())}
                        className="w-full px-3 py-2 text-left text-sm text-black hover:bg-gray-100 flex items-center justify-between group"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="w-5 h-5 flex items-center justify-center rounded bg-gray-100 text-xs font-medium text-black">
                            {team.key}
                          </span>
                          <span>{team.name}</span>
                        </div>
                        {selectedTeamId === team.id.toString() && (
                          <Check className="w-3.5 h-3.5 text-black" />
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
                className="w-full bg-white hover:bg-gray-50 text-black border border-gray-300 h-8 text-sm font-normal disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && (
                  <div className="mr-2 h-3 w-3 animate-spin rounded-full border-[1.5px] border-black border-t-transparent" />
                )}
                Continue with Linear
              </Button>
              {/* <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="w-full text-xs text-zinc-400 hover:text-white transition-colors"
              >
                I will  do this later
              </button> */}
            </div>
          </form>
        </div>
      </main>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2">
        <div className="flex gap-1.5">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className={`w-1 h-1 rounded-full ${i === 6 ? "bg-black" : "bg-gray-300"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectTeam;
