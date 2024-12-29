"use client";

import React, { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { GoogleOAuthProvider } from "@react-oauth/google";

interface Props {
  children: ReactNode;
}

export function SessProvider(props: Props) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      {props.children}
      <Toaster />
    </GoogleOAuthProvider>
  );
}
