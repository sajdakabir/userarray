"use client";

import { NextButton } from "@/components/ui/custom-buttons";
import { useEffect } from "react";
import Image from "next/image";
import ErrorPage from "@/views/specials/error/Error";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return <ErrorPage reset={reset} />;
}
