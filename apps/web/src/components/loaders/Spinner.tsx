import { Loader2 } from "lucide-react";
import Image from "next/image";

const Spinner = () => {
  return (
    <main className="h-screen grid place-items-center bg-bg-gradient-dark w-screen">
      <div className="flex flex-col gap-6 items-center">
        <Image
          className="p-1"
          src={"/new_logo.png"}
          alt={"march-logo"}
          priority={true}
          height={80}
          width={80}
        />
        <Loader2 size={40} className="custom-spin text-white" />
      </div>
    </main>
  );
};

export default Spinner;
