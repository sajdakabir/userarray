"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { GET_USER } from "@/config/apiConfig";

const CreateProfile = (props: { accessToken: string }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [error, setError] = useState<string>("");
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(GET_USER, {
          headers: {
            Authorization: `Bearer ${props.accessToken}`,
          },
        });
        
        setFirstName(response.data && response.data.response?.firstName)
        setLastName(response.data && response.data.response?.lastName)
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [props.accessToken]);

  const handleSubmit = async () => {
    if (firstName==="") {
      setError("Please enter your First name");
      return;
    }
    if (lastName==="" && lastName !== undefined) {
      setError("Please enter your Last name");
      return;
    }

    setLoading(true);

    try {
      await axios.patch(GET_USER, {
        firstName: firstName,
        lastName: lastName,
        onboarding: {
          profile_complete: true
        }
      }, {
        headers: {
          Authorization: "Bearer " + props.accessToken,
        },
      });

      location.reload()
    } catch (error: string | unknown) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong!");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
        <span className="text-black font-medium">
          userArray
        </span>
        <nav className="flex items-center gap-6">
          <button 
            onClick={() => window.open('https://github.com/sajdakabir/userarray', '_blank')}
            className="text-sm text-gray-600 hover:text-black transition-colors cursor-pointer"
          >
            GitHub
          </button>
          <button 
            onClick={() => window.open('https://userarray.com/changelog', '_blank')}
            className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md text-black transition-colors cursor-pointer"
          >
            Demo
          </button>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center -mt-24">
        <div className="w-full max-w-[320px] space-y-4">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-black">
              Complete your profile
            </h1>
            <p className="text-sm text-gray-600">
              Fill in your information to get started
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm text-gray-600">
                First Name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                autoComplete="given-name"
                className="bg-white border-gray-300 text-black placeholder:text-gray-400 focus-visible:ring-gray-500 focus-visible:ring-offset-0 h-9"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm text-gray-600">
                Last Name (optional)
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                autoComplete="family-name"
                className="bg-white border-gray-300 text-black placeholder:text-gray-400 focus-visible:ring-gray-500 focus-visible:ring-offset-0 h-9"
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>

            <Button 
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-black text-white hover:bg-gray-900 h-9 font-normal"
            >
              {loading && (
                <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              Continue
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateProfile;
