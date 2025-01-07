"use client";
import { FC, useEffect, useState } from "react";

type LinnerProps = {
  token: string;
};

const LinnerConnect: FC<LinnerProps> = ({ token }) => {

  const [accessLinearToken, setAccessLinearToken] = useState<string | null>(null);

  // This will get the token from the cookie on initial load using js-cookie
 
  const handleConnect = () => {
    const clientId = process.env.NEXT_PUBLIC_LINEAR_CLIENT_ID || "61c4c0f7c6ee94ecd209c19ed2f996b1";
    const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_LINEAR_REDIRECT_URL || "http://localhost:3000/auth/linear");
    const authUrl = `https://linear.app/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=read`;

    window.location.href = authUrl; // Redirect to Linear OAuth page
  };

  useEffect(() => {
    if (accessLinearToken) {
      alert(accessLinearToken); // This will alert the token once it's available
    }
  }, [accessLinearToken]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-4xl font-bold mb-4">Connect with Linear</h1>
      <p className="mb-6">Click the button below to connect with Linear and view all your issues here.</p>
      <button
        onClick={handleConnect}
        className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-300 transition"
      >
        Connect to Linear
      </button>
    </div>
  );
};

export default LinnerConnect;
