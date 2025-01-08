"use client";
import axios from "axios";
import { FC, useCallback, useEffect, useState } from "react";


type LinearProps = {
  token: string;
};

const LinearConnect: FC<LinearProps> = ({ token }) => {

  const [accessLinearToken, setAccessLinearToken] = useState<string | null>(null);


 
  const handleConnect = useCallback(async () => {
    try {
      const response = await axios.get(`/api/auth/linear`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log("response saju : ", response.data)
      const { authUrl } = response.data

      console.log("Redirecting to Linear OAuth URL:")
      window.location.href = authUrl
    } catch (error) {
      console.error("Error in initiating Linear OAuth login:", error)
    }
  }, [token])

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

export default LinearConnect;


