import { Label } from "@/lib/types/Labels";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Check } from "lucide-react";
import { FC } from "react";

type LabelSelectorContentProps = {
  labels: Label[];
  selected: Label[];
  onSelect: (selected: Label[]) => void;
};

const LabelSelectorContent: FC<LabelSelectorContentProps> = ({
  labels,
  selected,
  onSelect,
}) => {
  return (
    <>
      {labels.map((s) => {
        const labelStyle = {
          backgroundColor: s.color,
        };
        return (
          <DropdownMenuItem
            key={s._id}
            onClick={() => {
              if (!selected.some((ss) => ss._id === s._id)) {
                onSelect([...selected, s]);
              } else {
                onSelect(selected.filter((s_) => s._id !== s_._id));
              }
            }}
            className={`text-xs text-focus-text group py-1 px-2 rounded-md text-left hover:bg-sidebar-button-hover hover:text-focus-text-hover`}
          >
            <div className="flex items-center gap-x-2 capitalize cursor-default">
              {selected.some(
                (ss) => JSON.stringify(ss) == JSON.stringify(s)
              ) ? (
                <Check
                  className="text-less-highlight"
                  size={14}
                  strokeWidth={2.5}
                />
              ) : (
                <Check
                  className="text-nonfocus-text opacity-0 group-hover:opacity-50 duration-150"
                  size={14}
                />
              )}
              <div style={labelStyle} className="h-3 w-3 rounded-full" />
              {s.name}
            </div>
          </DropdownMenuItem>
        );
      })}
    </>
  );
};

export default LabelSelectorContent;
