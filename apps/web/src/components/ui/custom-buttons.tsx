import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps {
  loading?: boolean;
  className?: string;
  text: string;
  type?: "submit" | "button" | "reset";
  disabled?: boolean;
  handleClick?: () => void;
}

export const NextButton = (props: ButtonProps) => {
  return (
    <button
      onClick={props.handleClick}
      disabled={props.loading || props.disabled}
      type={props.type}
      className={cn(
        "w-full bg-focus-text-hover font-medium px-2 py-[6px] rounded-lg flex justify-center items-center",
        props.className
      )}
    >
      {!props.loading ? (
        props.text ? (
          <span>{props.text}</span>
        ) : (
          <span>Next</span>
        )
      ) : (
        <Loader2 className="custom-spin" />
      )}
    </button>
  );
};

export const ClassicButton = (props: ButtonProps) => {
  return (
    <button
      onClick={props.handleClick}
      disabled={props.loading || props.disabled}
      type={props.type}
      className={cn(
        "w-full bg-divider text-focus-text-hover px-2 py-[6px] rounded-lg flex justify-center items-center",
        props.className
      )}
    >
      {!props.loading ? (
        <span>{props.text}</span>
      ) : (
        <Loader2 className="custom-spin" />
      )}
    </button>
  );
};

export const FormButton = (props: ButtonProps) => {
  return (
    <button
      onClick={props.handleClick}
      type={props.type}
      disabled={props.loading || props.disabled}
      className={cn(
        "bg-transparent text-sm border border-nonfocus-text hover:border-focus-text hover:bg-gray-600/30 text-focus-text-hover p-2 rounded-lg flex justify-center items-center",
        props.className
      )}
    >
      {!props.loading ? (
        <span>{props.text}</span>
      ) : (
        <Loader2 className="custom-spin" />
      )}
    </button>
  );
};
