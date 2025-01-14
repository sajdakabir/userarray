"use client";

import { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from 'lucide-react';

interface TopBarProps {
  workspace: string;
}

const TopBar: FC<TopBarProps> = ({ workspace }) => {
  const pathname = usePathname();
  const isActivePath = (path: string) => pathname.includes(path);

  return (
    <div className="h-16 border-b border-[#E3E3E3] bg-white flex items-center px-4 sticky top-0 z-50">
      <div className="flex items-center gap-1.5 flex-1 text-sm">
        {/* Logo and Name */}
        <Link href="/" className="flex items-center gap-1.5 text-[#666] hover:text-black transition-colors">
          <div className="flex items-center">
            <span className="font-normal">(</span>
            <span className="font-normal">)</span>
          </div>
          <span className="font-medium">userarray</span>
        </Link>

        {/* Separator */}
        <span className="text-[#E3E3E3] mx-1.5">/</span>

        {/* Workspace Name */}
        <Link 
          href={`/${workspace}`}
          className="text-[#666] font-medium hover:text-black transition-colors"
        >
          {workspace}
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center ml-8 gap-5">
          <Link
            href={`/${workspace}/feedback`}
            className={`px-2 py-1 transition-colors ${
              isActivePath('/feedback')
                ? 'text-black font-medium'
                : 'text-[#666] hover:text-black'
            }`}
          >
            Feedback
          </Link>
          <Link
            href={`/${workspace}/plan`}
            className={`px-2 py-1 transition-colors ${
              isActivePath('/plan')
                ? 'text-black font-medium'
                : 'text-[#666] hover:text-black'
            }`}
          >
            All Issues
          </Link>
          <Link
            href={`/${workspace}/cycle`}
            className={`px-2 py-1 transition-colors ${
              isActivePath('/cycle')
                ? 'text-black font-medium'
                : 'text-[#666] hover:text-black'
            }`}
          >
            Current Cycle
          </Link>
        </div>
      </div>

      {/* Profile Section */}
      <div className="flex items-center">
        <button className="p-1.5 rounded-full hover:bg-[#F8F8F8] transition-colors">
          <User size={18} className="text-[#666]" />
        </button>
      </div>
    </div>
  );
};

export default TopBar;
