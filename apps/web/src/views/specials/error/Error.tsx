"use client";

import React from "react";
import Image from "next/image";
import { NextButton } from "@/components/ui/custom-buttons";

type ErrorProps = {
  reset: () => void;
};

const ErrorPage: React.FC<ErrorProps> = ({ reset }) => {
  return (
    <div className="absolute w-screen flex flex-col items-center justify-center h-screen bg-dashboard">
      <Image
        className="p-1 mb-4"
        src={"/new_logo.png"}
        alt={"march-logo"}
        priority={true}
        height={80}
        width={80}
      />
      <h1 className="text-focus-text-hover text-3xl my-6">
        Sorry, Something went wrong!
      </h1>
      <h2 className="text-focus-text text-lg font-light">
        Please report this error to the team
      </h2>
      <NextButton
        text="Refresh"
        handleClick={reset}
        className="mt-8 w-fit rounded-[10px]"
      />
    </div>
  );
};

export default ErrorPage;
