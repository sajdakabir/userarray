"use client";
import React, { useState, useEffect } from "react";
import { FC } from "react";
import { LinearTeam } from "@/lib/types/linearTeam";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "@/utils/constants/api-endpoints";

type TeamCreateProps = {
  token: string;
  response: LinearTeam[]; // Array of LinearTeam
};

const SelectTeam: FC<TeamCreateProps> = ({ token, response }) => {
  const router = useRouter();
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [workspaceName, setWorkspaceName] = useState<string | null>(null);

  useEffect(() => {
    const storedWorkspace = localStorage.getItem("workspace_slug");
    setWorkspaceName(storedWorkspace); // Set workspace name once component mounts
  }, []);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTeamId(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedTeamId || !workspaceName) {
      alert("Please select a team and ensure workspace is set.");
      return;
    }

    const teamObject = response.find(
      (team) => team.id.toString() === selectedTeamId
    );
    if (!teamObject) {
      alert("Team not found in response.");
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
        const postData = await postResponse.json();
        console.log("Team Created Successfully:", postData);

        const updateUser = await fetch(`${BACKEND_URL}/users/me`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            hasFinishedOnboarding: true,
            onboarding: { team_create: true },
          }),
        });

        if (updateUser.ok) {
          console.log("User updated successfully");
          router.push("/workspace");
        } else {
          console.error("Error updating user.");
        }
      } else {
        console.error("Error in POST request.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="team-select">Select a Team:</label>
      <select
        id="team-select"
        value={selectedTeamId}
        onChange={handleSelectChange}
      >
        <option value=""> Select a Team </option>
        {response.map((team, index) => (
          <option key={index} value={team.id.toString()}>
            {team.name}
          </option>
        ))}
      </select>
      <button type="submit" className="bg-white" disabled={!selectedTeamId}>
        Submit
      </button>
    </form>
  );
};

export default SelectTeam;
