"use client";

import { FC, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";

type LinearProps = {
  token: string;
};

const LinearConnect: FC<LinearProps> = ({ token }) => {
  const [accessLinearToken, setAccessLinearToken] = useState<string | null>(null);

  const handleAuthenticate = useCallback(async () => {
    try {
      const response = await axios.get(`/api/auth/linear`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("response saju : ", response.data);
      const { authUrl } = response.data;

      console.log("Redirecting to Linear OAuth URL:");
      window.location.href = authUrl;
    } catch (error) {
      console.error("Error in initiating Linear OAuth login:", error);
    }
  }, [token]);

  useEffect(() => {
    if (accessLinearToken) {
      alert(accessLinearToken); // This will alert the token once it's available
    }
  }, [accessLinearToken]);

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
        <div className="w-full max-w-[420px] space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12">
              <img 
                src="/linear-white-logo.svg" 
                alt="Linear Logo" 
                className="w-full h-full"
              />
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                Connect with Linear
              </h1>
              <p className="text-sm text-zinc-400">
                Automate issue workflow when Linear issues are created and updated.
              </p>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4 space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-white">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="text-sm text-white">
                  Linear links the issue and the GitHub pull request automatically.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-white">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="text-sm text-white">
                  Linear syncs the issue status when a pull request is opened, closed, merged, or reverted.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-white">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="text-sm text-white">
                  Linear <span className="font-medium">will not</span> ask for code read permissions.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={handleAuthenticate}
              className="w-full bg-white hover:bg-zinc-100 text-black h-10 font-normal"
            >
              Authenticate with Linear
            </Button>
      <button
              onClick={() => window.location.href = '/dashboard'}
              className="w-full text-sm text-zinc-400 hover:text-white transition-colors"
      >
              I'll do this later
      </button>
          </div>
        </div>
      </main>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
        <div className="flex gap-2">
          {[...Array(7)].map((_, i) => (
            <div 
              key={i} 
              className={`w-1.5 h-1.5 rounded-full ${i === 2 ? 'bg-white' : 'bg-white/20'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LinearConnect;


