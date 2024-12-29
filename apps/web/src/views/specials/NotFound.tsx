import Link from "next/link";
import Image from "next/image";

const NotFound = () => {
  return (
    <main className="absolute w-screen h-screen bg-dashboard">
      <div className="flex flex-col items-center justify-center h-full">
        <Image
          className="p-1 mb-2"
          src={"/new_logo.png"}
          alt={"march-logo"}
          priority={true}
          height={80}
          width={80}
        />
        <h2 className="text-focus-text-hover font-medium text-3xl mt-8">
          Sorry, Page not found
        </h2>

        <Link
          href="/workspace"
          className="text-sm font-medim text-focus-text mt-8 p-2 hover:bg-sidebar-button-active rounded-[10px] hover:text-focus-text-hover"
        >
          Back to march
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
