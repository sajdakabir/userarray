"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { GET_USER } from "@/utils/constants/api-endpoints";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
const CreateProfile = (props: { accessToken: string }) => {
  const route=useRouter()
  const [loading, setLoading] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  // const [workspaceSlug, setWorkspaceSlug] = useState<string>("");
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
      setError(firstName);
      return;
    }
    if (lastName==="") {
      setError("Please enter your Last name");
      return;
    }
    // } else if (!workspaceSlug) {
    //   setError("Please enter a workspace name");
    //   return;
    // }

    // // Validate workspace slug format
    // const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    // if (!slugRegex.test(workspaceSlug)) {
    //   setError("Workspace name can only contain lowercase letters, numbers, and hyphens");
    //   return;
    // }

    setLoading(true);

    try {
      // First update the user profile
     const update_profile= await axios.patch(GET_USER, {
        firstName:firstName,
        lastName:lastName,
        onboarding: {
          profile_complete: true
        }
        
      }, {
        headers: {
          Authorization: "Bearer " + props.accessToken,
        },
      });
      console.log('update_profile',update_profile);
      

      // Then create the workspace
      // await axios.post(USER_WORKSPACE, {
      //   name: workspaceSlug,
      //   slug: workspaceSlug.toLowerCase(),
      // }, {
      //   headers: {
      //     Authorization: "Bearer " + props.accessToken,
      //   },
      // });

      // Finally, mark workspace creation as complete
      // await axios.patch(GET_USER, {
      //   onboarding: {
      //     workspace_create: true,
      //     workspace_invite: true
      //   },
      // }, {
      //   headers: {
      //     Authorization: "Bearer " + props.accessToken,
      //   },
      // });

      // On Success Refresh /onboarding page
      if(update_profile.status===200){

        route.push('/onboarding')
      }
    } catch (error: any) {
      console.error(error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong!");
      }
    }
    setLoading(false);
  };

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-[#18181B] p-10 text-white lg:flex border-r border-white/10">
        <div className="absolute inset-0 bg-[#18181B]" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Image
            src="/new_logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="mr-2"
          />
          march
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Create your workspace and start collaborating with your team. It's simple, efficient, and incredibly powerful.&rdquo;
            </p>
            <footer className="text-sm text-muted-foreground">Get Started</footer>
          </blockquote>
        </div>
      </div>
      <div className="relative p-4 lg:p-8 h-full flex items-center bg-[#09090B]">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
        <div className="relative mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Complete your profile
            </h1>
            <p className="text-sm text-zinc-400">
              Fill in your information to get started
            </p>
          </div>

          <div className="grid gap-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName" className="text-zinc-100">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  autoComplete="given-name"
                  className="bg-zinc-950/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-400 focus-visible:ring-zinc-500 focus-visible:ring-offset-0"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="workspaceSlug" className="text-zinc-100">
                  Last Name
                </Label>
                <Input
                  id="workspaceSlug"
                  name="workspaceSlug"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  className="bg-zinc-950/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-400 focus-visible:ring-zinc-500 focus-visible:ring-offset-0"
                />
                {/* <p className="text-xs text-zinc-400">
                  Only lowercase letters, numbers, and hyphens allowed
                </p> */}
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
              </div>

              <Button 
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-zinc-50 text-zinc-900 hover:bg-zinc-200"
              >
                {loading && (
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent" />
                )}
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
