"use client";

import { Orbit, Zap } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";

const Spaces = ({ accessToken }: { accessToken: string }) => {
  const [workspace, setWorkspace] = useState<string | null>(null);

  // Memoize workspace and avoid re-renders
  const memoizedWorkspace = useMemo(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("workspace_slug");
    }
    return null;
  }, []);

  useEffect(() => {
    setWorkspace(memoizedWorkspace);
  }, [memoizedWorkspace]);

  return (
    <div className="w-full">
      <div className="flex mt-2 pl-3 gap-[2px]">
        {/* Render only when workspace is available */}
        {workspace ? (
          <>
            <Link
              href={`/${workspace}/cycle`}
              className="text-hx flex items-center gap-2 justify-start px-2 py-1 rounded-md border border-transparent hover:border-divider"
            >
              <Zap size={14} />
              Cycle
            </Link>
            <Link
              href={`/${workspace}/plan`}
              className="text-hx flex items-center gap-2 justify-start px-2 py-1 rounded-md border border-transparent hover:border-divider"
            >
              <Orbit size={14} />
              Plan
            </Link>
          </>
        ) : (
          <>
            <button
              disabled
              className="text-hx flex items-center gap-2 justify-start px-2 py-1 rounded-md border border-transparent text-zinc-500"
            >
              <Zap size={14} />
              Cycle
            </button>
            <button
              disabled
              className="text-hx text-zinc-500 flex items-center gap-2 justify-start px-2 py-1 rounded-md border border-transparent "
            >
              <Orbit size={14} />
              Plan
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Spaces;
