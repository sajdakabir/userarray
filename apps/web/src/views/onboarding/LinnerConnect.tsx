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
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-gradient-to-b from-zinc-900 via-[#0f172a] to-black p-10 text-white lg:flex border-r border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#1f2937,transparent)]" />
        <div className="absolute inset-0 bg-[url('/stars.png')] opacity-50" />
        <div className="absolute inset-0 bg-[url('/stars.png')] opacity-30 animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Image
            src="/new_logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="mr-2"
          />
          <span>march</span>
        </div>
        <div className="relative z-20 mt-auto space-y-6">
          <div className="space-y-2">
            <div className="text-sm text-zinc-500 uppercase tracking-wider">Top Extension:</div>
            <div className="flex items-center gap-3">
              <div className="bg-zinc-900 rounded-lg p-2">
                <Image
                  src="/linear-logo.svg"
                  alt="Linear"
                  width={24}
                  height={24}
                />
              </div>
              <span className="text-zinc-300">Linear Integration</span>
            </div>
            <p className="text-sm text-zinc-400 mt-2">
              Streamline your project management and issue tracking within march.
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-zinc-500 uppercase tracking-wider">Favorite Feature:</div>
            <p className="text-lg text-zinc-100">
              &ldquo;Linear automatically syncs and updates in real-time, making collaboration seamless.&rdquo;
            </p>
          </div>
        </div>
      </div>
      <div className="relative p-4 lg:p-8 h-full flex items-center bg-[#09090B]">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
        <div className="relative mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="bg-zinc-900 rounded-xl p-3 mb-2">
              <Image
                src="/linear-logo.svg"
                alt="Linear"
                width={40}
                height={40}
              />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Connect with Linear
            </h1>
            <p className="text-sm text-zinc-400">
              Automate issue workflow when tasks are created and updated.
            </p>
          </div>

          <div className="space-y-4">
            <div className="text-sm text-zinc-500 uppercase tracking-wider">Integration Features:</div>
            <div className="bg-zinc-900/50 rounded-xl p-4 space-y-3 border border-zinc-800">
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
          </div>

          <div className="grid gap-4">
            <Button 
              onClick={handleConnect}
              className="w-full bg-white text-zinc-900 hover:bg-zinc-100 flex items-center justify-center gap-2"
            >
              Authenticate with Linear
            </Button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="text-sm text-zinc-400 hover:text-zinc-300"
            >
              I'll do this later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinnerConnect;