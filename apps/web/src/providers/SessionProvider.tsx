"use client";

import React, { ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "@/components/ui/toaster";

interface Props {
  children: ReactNode;
}

export function SessionProvider(props: Props) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {(props.children as any)}
      <Toaster />
    </GoogleOAuthProvider>
  );
}
