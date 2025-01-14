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
    <div className="h-16 border-b border-[#30363d] bg-[#171717] flex items-center px-6 sticky top-0 z-50">
      <div className="flex items-center gap-2 flex-1">
        {/* Logo and Name */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center mr-1">
            <span className="text-[#424a53] font-medium text-xl">(</span>
            <span className="text-[#424a53] font-medium text-xl">)</span>
          </div>
          <span className="text-focus-text-hover font-semibold text-lg">userarray</span>
        </Link>

        {/* Separator */}
        <span className="text-[#424a53] mx-2">/</span>

        {/* Workspace Name */}
        <Link 
          href={`/${workspace}`}
          className="text-focus-text-hover font-semibold hover:text-nonfocus-text transition-colors text-lg"
        >
          {workspace}
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6 ml-10">
          <Link
            href={`/${workspace}/feedback`}
            className={`text-base px-3 py-1.5 rounded-md transition-colors ${
              isActivePath('/feedback')
                ? 'text-focus-text-hover bg-[#1F1F1F]'
                : 'text-nonfocus-text hover:text-focus-text-hover'
            }`}
          >
            Feedback
          </Link>
          <Link
            href={`/${workspace}/plan`}
            className={`text-base px-3 py-1.5 rounded-md transition-colors ${
              isActivePath('/plan')
                ? 'text-focus-text-hover bg-[#1F1F1F]'
                : 'text-nonfocus-text hover:text-focus-text-hover'
            }`}
          >
            All Issues
          </Link>
          <Link
            href={`/${workspace}/cycle`}
            className={`text-base px-3 py-1.5 rounded-md transition-colors ${
              isActivePath('/cycle')
                ? 'text-focus-text-hover bg-[#1F1F1F]'
                : 'text-nonfocus-text hover:text-focus-text-hover'
            }`}
          >
            Current Cycle
          </Link>
        </div>
      </div>

      {/* Profile Section */}
      <div className="flex items-center">
        <button className="p-2.5 rounded-full hover:bg-[#1F1F1F] transition-colors">
          <User size={22} className="text-focus-text-hover" />
        </button>
      </div>
    </div>
  );
};

export default TopBar;
