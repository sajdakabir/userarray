"use client";

import { useEffect } from "react";
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

  return (
    <html>
      <body>
        <ErrorPage reset={reset} />
      </body>
    </html>
  );
}
