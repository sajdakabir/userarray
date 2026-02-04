"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "@/components/ui/toaster";

interface Props {
  children: ReactNode;
}

export function SessionProvider(props: Props) {
  const [mounted, setMounted] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{props.children}</>;
  }
  
  return (
    <GoogleOAuthProvider clientId={clientId}>
      {props.children}
      <Toaster />
    </GoogleOAuthProvider>
  );
}
