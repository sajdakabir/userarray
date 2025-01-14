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
      {props.children}
      <Toaster />
    </GoogleOAuthProvider>
  );
}
