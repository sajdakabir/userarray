// import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type NoteSkeletonProps = {
  className?: string;
};

export const NoteSkeleton = ({ className }: NoteSkeletonProps) => {
  return (
    <div className={cn("flex flex-col gap-y-2 text-focus-text h-32 mt-8", className)}>
      {/* <Skeleton className="h-5 w-80" />
      <Skeleton className="h-3 w-80 mt-4" />
      <Skeleton className="h-3 w-80" />
      <Skeleton className="h-8 mt-4 w-80" /> */}
    </div>
  );
};
