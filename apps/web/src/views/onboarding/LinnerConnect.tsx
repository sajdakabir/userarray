"use client";

import { PendingInvitation } from "@/lib/types/Workspaces";
import { FC, useState } from "react";
import AcceptInvitation from "./AcceptInvitation";
import CreateWorkspace from "./CreateWorkspace";

type LinnerConnectProps = {
  token: string;
};

const LinnerConnect: FC<LinnerConnectProps> = ({ token }) => {
 
    const handleConnect = async () => {
        alert("Hello")
        // try {
        //     const response = await fetch('https://api.linear.app/graphql', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization': `Bearer YOUR_LINEAR_API_KEY`
        //         },
        //         body: JSON.stringify({ query: '{ viewer { id name } }' })
        //     });
        //     const data = await response.json();
        //     console.log('Linear Data:', data);
        //     alert('Connected to Linear successfully!');
        // } catch (error) {
        //     console.error('Error connecting to Linear:', error);
        //     alert('Failed to connect to Linear');
        // }
    };
  return (
    <>
     
     <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
            <h1 className="text-4xl font-bold mb-4">Connect with Linear</h1>
            <p className="mb-6">Click the button below to connect with Linear and view all your issues here.</p>
            <button 
                onClick={handleConnect} 
                className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-300 transition"
            >
                Connect to Linear
            </button>
        </div>
     
    </>
  );
};

export default LinnerConnect;