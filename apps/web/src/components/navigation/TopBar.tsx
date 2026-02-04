import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { User } from 'lucide-react';

interface TopBarProps {
  workspace: string;
}

const TopBar = ({ workspace }: TopBarProps) => {
  const pathname = usePathname();
  const isActivePath = (path: string) => pathname.includes(path);

  return (
    <div className="h-14 border-b border-[#30363d] bg-[#171717] flex items-center px-4 sticky top-0 z-50">
      <div className="flex items-center gap-2 flex-1">
        {/* Logo and Name */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/new_logo.png"
            alt="UserArray"
            width={24}
            height={24}
            className="rounded-sm"
          />
          <span className="text-focus-text-hover font-semibold">userarray</span>
        </Link>

        {/* Separator */}
        <span className="text-[#424a53] mx-1">/</span>

        {/* Workspace Name */}
        <Link 
          href={`/${workspace}`}
          className="text-focus-text-hover font-semibold hover:text-nonfocus-text transition-colors"
        >
          {workspace}
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-4 ml-8">
          <Link
            href={`/${workspace}/issue`}
            className={`text-sm px-3 py-1 rounded-md transition-colors ${
              isActivePath('/plan')
                ? 'text-focus-text-hover bg-[#1F1F1F]'
                : 'text-nonfocus-text hover:text-focus-text-hover'
            }`}
          >
            Plan
          </Link>
          <Link
            href={`/${workspace}/cycle`}
            className={`text-sm px-3 py-1 rounded-md transition-colors ${
              isActivePath('/cycle')
                ? 'text-focus-text-hover bg-[#1F1F1F]'
                : 'text-nonfocus-text hover:text-focus-text-hover'
            }`}
          >
            Cycle
          </Link>
        </div>
      </div>

      {/* Profile Section */}
      <div className="flex items-center">
        <button className="p-2 rounded-full hover:bg-[#1F1F1F] transition-colors">
          <User size={20} className="text-focus-text-hover" />
        </button>
      </div>
    </div>
  );
};

export default TopBar;
