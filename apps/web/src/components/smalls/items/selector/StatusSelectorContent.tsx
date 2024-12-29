import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Status } from "@/lib/types/Items";
import { Check } from "lucide-react";
import { FC } from "react";

type StatusSelectorContentProps = {
  status: Status | undefined;
  statuses: Status[];
  setStatus: (a: Status) => void;
};

const StatusSelectorContent: FC<StatusSelectorContentProps> = ({
  status,
  statuses,
  setStatus,
}) => {
  return (
    <div className="flex flex-col gap-[2px]">
      {statuses.map((sta) => (
        <DropdownMenuItem
          key={sta.value}
          onClick={() => {
            setStatus(sta);
          }}
          className={`text-xs group py-1 px-2 rounded-md text-left hover:bg-sidebar-button-hover hover:text-focus-text-hover`}
        >
          <p className="flex capitalize items-center">
            {status && sta.value === status.value ? (
              <Check
                className="mr-2 text-less-highlight"
                size={14}
                strokeWidth={2.5}
              />
            ) : (
              <Check
                className="mr-2 text-nonfocus-text opacity-0 group-hover:opacity-50 duration-150"
                size={14}
              />
            )}
            <span className="flex items-center gap-x-2">
              <sta.icon size={14} />
              {sta.value}
            </span>
          </p>
        </DropdownMenuItem>
      ))}
    </div>
  );
};

export default StatusSelectorContent;
