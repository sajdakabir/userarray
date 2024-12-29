import { Checkbox } from "@/components/ui/checkbox";
import { Item } from "@/lib/types/Items";
import { CompactSpace } from "@/lib/types/Spaces";
import { truncateString } from "@/utils/helpers";

const ArchivedItem = (props: {
  item: Item;
  space: CompactSpace;
  handleUnarchive: (uuid: string) => void;
}) => {

  return (
    <div
      key={props.item.uuid}
      className="h-14 w-[30rem] item p-2 flex items-center"
    >
      <div className="w-10 h-full flex justify-center items-center">
        <Checkbox
          className="data-[state=checked]:bg-focus-text-hover data-[state=checked]:text-black border-none"
          checked={true}
          onCheckedChange={() => props.handleUnarchive(props.item.uuid)}
        />
      </div>
      <div
        className="active:scale-100 flex grow items-center justify-between"
      >
        <div className="flex-grow ml-2">
          <p className="text-highlight text-sm line-through">
            {truncateString(props.item.name, 40)}
          </p>
        </div>
        <div className="text-xs uppercase font-extralight text-less-highlight mr-2">
          {props.space.identifier}-{props.item.sequenceId}
        </div>
      </div>
    </div>
  );
};

export default ArchivedItem;
