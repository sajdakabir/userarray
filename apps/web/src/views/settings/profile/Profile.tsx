"use client";

import axios, { AxiosError } from "axios";
import { GetAvatarFromName } from "@/utils/helpers";
import { useEffect, useState } from "react";
import { FormButton, NextButton } from "@/components/ui/custom-buttons";
import { GET_USER } from "@/utils/constants/api-endpoints";
import { useToast } from "@/components/ui/use-toast";
import { dataStore, userStore } from "@/utils/store/zustand";
import { User } from "@/lib/types/Users";

const ProfileClient: React.FC<{ accessToken: string }> = (props) => {
  const fetchUser = dataStore((state) => state.fetchUser);
  const setCurrent = userStore((state) => state.setCurrent);
  const temp = dataStore((state) => state.user);
  const user: User = temp!;

  const [name, setName] = useState<string>(user.fullName);
  const [username, setUserName] = useState<string>(user.userName);
  const [changed, setChanged] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { toast } = useToast();

  useEffect(() => {
    setCurrent("profile");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (name !== user.fullName || username !== user.userName) setChanged(true);
    else setChanged(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, name]);

  const handleUpdate = async () => {
    if (username === user.userName && name === user.fullName) {
      // TODO: toast("You didn't change anything!");
      return;
    }
    setLoading(true);
    try {
      await axios.patch(
        GET_USER,
        {
          userName: username,
          fullName: name,
        },
        {
          headers: {
            Authorization: "Bearer " + props.accessToken,
          },
        }
      );

      setChanged(false);
      toast({
        title: "Profile updated successfully!",
      });
      // Update the User state with latest data from backend
      fetchUser(props.accessToken);
    } catch (error) {
      const e = error as AxiosError;
      console.error(e.message);
      toast({
        variant: "destructive",
        title: "Something Went Wrong!",
      });
    }

    setLoading(false);
  };

  return (
    <section className="flex-grow min-h-screen right-0 bg-dashboard md:px-24 md:py-16 overflow-y-auto">
      <div className="w-4/5">
        <form className="mx-auto md:mx-0">
          <h2 className="text-xl font-medium text-focus-text-hover">Profile</h2>

          <h4 className="text-focus-text text-sm mt-2">
            Manage all the settings for your account profile
          </h4>

          <div className="w-72 flex items-center justify-between mt-16">
            {user.avatar ? (
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="h-28 w-28 rounded-full bg-avatar"
                  src={user.avatar}
                  alt={user.fullName}
                />
              </div>
            ) : (
              <div className="h-28 w-28 rounded-full bg-bg-gradient-light grid place-items-center text-xl text-focus-text-hover font-medium">
                {GetAvatarFromName(user.fullName)}
              </div>
            )}
            <FormButton type="button" text="Upload Image" />
          </div>

          <div className="w-72 flex flex-col gap-4 mt-10 text-sm">
            <div className="flex flex-col">
              <label className="text-focus-text mb-2" htmlFor="email">
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
                autoComplete="name"
                required={true}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-focus-text mb-2" htmlFor="email">
                User Name
              </label>
              <input
                type="username"
                name="username"
                id="username"
                value={username}
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
                autoComplete="username"
                required={true}
              />
            </div>
            <NextButton
              type="button"
              handleClick={handleUpdate}
              text="Update"
              loading={loading}
              disabled={!changed}
              className={`mt-4 py-2 ${changed ? "" : "bg-focus-text"}`}
            />
          </div>
        </form>
      </div>
    </section>
  );
};

export default ProfileClient;
