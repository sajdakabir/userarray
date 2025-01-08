"use client";

import { FC } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Circle } from "lucide-react";

type LinnerConnectProps = {
  token: string;
};

const LinnerConnect: FC<LinnerConnectProps> = ({ token }) => {
  const handleConnect = async () => {
    alert("Hello");
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
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Connect with Linear
            </h1>
            <p className="text-sm text-zinc-400">
              Automate issue workflow when tasks are created and updated
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-[#0C0C0C] border border-zinc-800 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Circle className="w-1.5 h-1.5 text-zinc-300 mt-2 fill-current" />
                <p className="text-sm text-zinc-300">Linear automatically syncs issue status and updates in real-time.</p>
              </div>
              <div className="flex items-start gap-3">
                <Circle className="w-1.5 h-1.5 text-zinc-300 mt-2 fill-current" />
                <p className="text-sm text-zinc-300">Track progress and collaborate with your team seamlessly.</p>
              </div>
              <div className="flex items-start gap-3">
                <Circle className="w-1.5 h-1.5 text-zinc-300 mt-2 fill-current" />
                <p className="text-sm text-zinc-300">Linear will not require additional permissions.</p>
            </div>
          </div>

            <div className="space-y-3">
            <Button 
              onClick={handleConnect}
              className="w-full bg-white text-black hover:bg-zinc-100 h-9 font-normal"
            >
              Connect Linear
            </Button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="w-full text-sm text-zinc-400 hover:text-zinc-300"
            >
              I'll do this later
            </button>
          </div>
        </div>
      </div>
      </main>
    </div>
  );
};

export default LinnerConnect;