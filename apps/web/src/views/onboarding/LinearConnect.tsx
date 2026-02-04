"use client";

import { useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Circle } from "lucide-react";
import axios from "axios";

type LinearProps = {
  token: string;
};

const LinearConnect = ({ token }: LinearProps) => {

  const handleConnect = useCallback(async () => {
    try {
      const response = await axios.get(`/api/auth/linear`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { authUrl } = response.data;

    
      window.location.href = authUrl;
    } catch (error) {
      console.error("Error in initiating Linear OAuth login:", error);
    }
  }, [token]);

 

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
        <span className="text-black font-medium">
          userArray
        </span>
        <nav className="flex items-center gap-6">
          <button 
            onClick={() => window.open('https://github.com/sajdakabir/userarray', '_blank')}
            className="text-sm text-gray-600 hover:text-black transition-colors cursor-pointer"
          >
            GitHub
          </button>
          <button 
            onClick={() => window.open('https://userarray.com/changelog', '_blank')}
            className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md text-black transition-colors cursor-pointer"
          >
            Demo
          </button>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center -mt-24">
        <div className="w-full max-w-[420px] space-y-4">
          <div className="text-center space-y-1">
            <div className="flex justify-center mb-4">
              <div className="p-3">
                <Image
                  src="/linear-white-logo.svg"
                  alt="Linear"
                  width={32}
                  height={32}
                />
              </div>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-black">
              Connect with Linear
            </h1>
            <p className="text-sm text-gray-600">
              mirror your Linear issues to userArray public board
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Circle className="w-1.5 h-1.5 text-gray-600 mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-700">fully customizable two way sync issues, status and lebels in real-time.</p>
              </div>
              <div className="flex items-start gap-3">
                <Circle className="w-1.5 h-1.5 text-gray-600 mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-700">let your users and contibutors view and comment on issues without needing to give them access to Linear.</p>
              </div>
              <div className="flex items-start gap-3">
                <Circle className="w-1.5 h-1.5 text-gray-600 mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-700">one click convert any feedback, commments into linear issues and send them to triage</p>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleConnect}
                className="w-full bg-white text-black border border-gray-300 hover:bg-gray-50 h-9 font-normal"
              >
                Connect Linear
              </Button>
              {/* <button
                onClick={() => window.location.href = '/dashboard'}
                className="w-full text-sm text-zinc-400 hover:text-zinc-300"
              >
                I will  do this later
              </button> */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LinearConnect;


