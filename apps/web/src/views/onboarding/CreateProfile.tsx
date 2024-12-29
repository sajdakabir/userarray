"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { User as UserIcon } from "lucide-react";
import { GetAvatarFromName } from "@/utils/helpers";
import { NextButton } from "@/components/ui/custom-buttons";
import { GET_USER } from "@/utils/constants/api-endpoints";
import { UserResponse } from "@/lib/types/Users";
import { getUser } from "@/server/fetchers/user/getdetails";
import Image from "next/image";

const CreateProfile = (props: { accessToken: string }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [username, setUserName] = useState<string>("");
  const [user, setUser] = useState<UserResponse | null>(null);
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const us = await getUser(props.accessToken);
        setUser(us);
        us && setName(us.response.fullName);
      } catch (error) {
        setError("Error fetching data");
      }
    };
    fetchData();
  }, [props.accessToken]);

  const avatar = useMemo(() => {
    setError("");
    if (!name) {
      return "";
    }
    return GetAvatarFromName(name);
  }, [name]);

  const handleSubmit = async () => {
    if (!name) {
      setError("Please enter a name");
      return;
    } else if (!username) {
      setError("Please enter a username");
      return;
    }
    setLoading(true);

    const body = {
      fullName: name,
      userName: username,
      onboarding: {
        profile_complete: true,
      },
    };

    try {
      const { data } = await axios.patch(GET_USER, body, {
        headers: {
          Authorization: "Bearer " + props.accessToken,
        },
      });
      // On Success Refresh /onboarding page
    } catch (error) {
      console.error(error);
      setError("Something Went Wrong!");
    }
    location.reload();
    setLoading(false);
  };

  // TODO: take username

  return (
    <main className="min-h-screen bg-auth-background grid place-items-center">
      <section className="md:w-[450px] w-96 px-8">
        <div className="px-8 2xl:px-16 mb-6">
          <h2 className="text-xl text-focus-text font-medium mb-4">
            Complete Your profile
          </h2>

          <div className="flex flex-row items-center gap-3">
            {user && user.response.avatar ? (
              <Image
                src={user.response.avatar.toString()}
                className="rounded-full bg-vlack"
                alt={user.response.fullName}
                height={60}
                width={60}
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-classic-button grid place-items-center">
                {!avatar ? (
                  <UserIcon size={32} className="text-gray-300" />
                ) : (
                  <span className="text-xl text-focus-text-hover font-medium">
                    {avatar}
                  </span>
                )}
              </div>
            )}
            <h3 className="text-xl font-medium text-focus-text">
              {username && `@${username}`}
            </h3>
          </div>
        </div>

        <div className="w-full flex flex-col gap-3 px-8 2xl:px-16">
          <div className="flex flex-col">
            <label className="text-nonfocus-text text-sm mb-1" htmlFor="name">
              Full Name
            </label>
            <input
              type="name"
              name="name"
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              placeholder={"John Doe"}
              autoComplete="name"
              required={true}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-nonfocus-text text-sm mb-1" htmlFor="name">
              Username
            </label>
            <input
              type="username"
              name="username"
              id="username"
              value={username}
              onChange={(e) => {
                setUserName(e.target.value);
              }}
              placeholder="username"
              autoComplete="username"
              required={true}
            />

            {error && (
              <span className="text-sm mt-1 text-red-600">{error}</span>
            )}
          </div>
          <NextButton
            text="Next"
            loading={loading}
            className={"mt-3"}
            handleClick={handleSubmit}
          />
        </div>
      </section>
    </main>
  );
};

export default CreateProfile;
