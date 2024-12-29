import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Status } from "@/lib/types/Items";
import StatusSelectorContent from "./StatusSelectorContent";

interface StatusSelectorProps {
  setStatus: (a: Status) => void;
  status: Status | undefined;
  statuses: Status[];
}

const StatusSelector: React.FC<StatusSelectorProps> = ({
  setStatus,
  status,
  statuses,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="border text-xs border-item-border text-focus-text hover:bg-gray-600/30 hover:text-focus-text-hover px-2 py-1 rounded-md flex items-center justify-start gap-x-[6px]">
          {status ? (
            <>
              <status.icon size={14} />
              <span className="capitalize">{status.value}</span>
            </>
          ) : (
            <span>
              {statuses[statuses.length - 1].value === "done"
                ? "Status"
                : "Effort"}
            </span>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-sidebar rounded-[10px] p-1 text-focus-text border-sidebar-button-active w-fit min-w-24">
        <StatusSelectorContent
          status={status}
          statuses={statuses}
          setStatus={setStatus}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StatusSelector;
