import Image from "next/image";
import Link from "next/link";

const Error = ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) => {
  const { status } = searchParams ?? { status: "" };
  let { message } = searchParams ?? { message: "" };

  const getMessage = (status: string | undefined) => {
    if (message) {
      return message;
    }

    if (!status) {
      return "Something went wrong";
    }

    switch (status) {
      case "404":
        return "Page not found";
      case "500":
        return "Internal server error";
      default:
        return "Something went wrong";
    }
  };

  message = getMessage(status);

  return (
    <main className="absolute w-screen h-screen bg-dashboard">
      <div className="flex flex-col items-center justify-center h-full">
        <Image
          className="p-1 mb-4"
          src={"/new_logo.png"}
          alt={"march-logo"}
          priority={true}
          height={80}
          width={80}
        />
        <h2 className="text-focus-text-hover text-3xl font-medium mt-8">
          Sorry, {message}
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

export default Error;
