'use client';
import getLinearAllTeam from '@/server/fetchers/onboarding/getAllLinearTeams';
import React, { FC, useEffect, useState } from 'react';

type TeamCreateProps = {
    token: string;
};

const TeamCreate: FC<TeamCreateProps> = ({ token }) => {
    const [teams, setTeams] = useState<any[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<string>('');

    const fetchAllTeam = async () => {
        const response = await getLinearAllTeam(token, '/linear/getLinearTeams/');
        if (response) {
            setTeams(response);
        }
    };

    useEffect(() => {
        if (token) {
            fetchAllTeam();
        }
    }, [token]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        alert(e.target.value);
        setSelectedTeam(e.target.value);
    };

    return (
        <div>
            <p>Token: {token}</p>
            <h3>Linear Teams:</h3>
            <select value={selectedTeam} onChange={handleChange}>
                <option value="">Select a Team</option>
                {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                        {team.name}
                    </option>
                ))}
            </select>
            {selectedTeam && <p>Selected Team ID: {selectedTeam}</p>}
        </div>
    );
};

export default TeamCreate;
