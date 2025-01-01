"use client";

import Image from "next/image";
import axios, { AxiosError } from "axios";
import { FormEvent, useState } from "react";
import { CheckCircle2, ChevronLeft, XCircle } from "lucide-react";
import { ClassicButton, NextButton } from "@/components/ui/custom-buttons";
import { useGoogleLogin } from "@react-oauth/google";
import LoginWithGoogle from "@/server/actions/auth/google-login";
import { MAGIC_LOGIN } from "@/utils/constants/api-endpoints";
// import TempSignin from "./TempSignin";

const Signin = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [errortext, setErrorText] = useState<string>("");
  const [emailLogin, setEmailLogin] = useState<boolean>(false);
  const [magicsent, setMagicsent] = useState<boolean>(false);

  const handleLoginWithEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Regular expression for basic email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const formdata = new FormData(e.currentTarget);
    const email = formdata.get("email");
    if (typeof email !== "string") {
      setErrorText("Please enter an email address");
      return;
    }

    // Test the email against the regular expression
    if (!emailRegex.test(email)) {
      setErrorText("Please enter a valid email address");
      return;
    }
    setLoading(true);

    try {
      const { data } = await axios.post(MAGIC_LOGIN, { email: email });
      setSuccess(true);
      setMagicsent(true);
    } catch (error) {
      const e = error as AxiosError;
      console.log(e.response);
      setError(true);
    }

    setLoading(false);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      console.log(codeResponse);
      setLoading(true);
      await LoginWithGoogle(codeResponse.code);
      setLoading(false);
    },
    onError: () => {
      console.error("Google login failed");
    },
    flow: "auth-code",
    // ux_mode: "redirect",
    // redirect_uri: `${BACKEND_URL}/api/auth/callback/google`,
  });

  const InitialUI = () => {
    return (
      <section className="h-screen w-full grid place-items-center">
        <div className="w-80 md:w-[500px] md:px-8 mx-auto">
          <div className="flex flex-row items-center gap-x-4 justify-center">
            <Image
              className=""
              src={"/new_logo.png"}
              alt={"google-icon"}
              height={35}
              width={35}
            />
            <h2 className="text-lg font-semibold text-white">
              Welcome to march
            </h2>
          </div>
          <div className="flex flex-col gap-3 mt-6 md:px-8 2xl:px-20">
            <NextButton
              loading={loading}
              handleClick={() => googleLogin()}
              className="text-sm"
              text="Continue with Google"
            />
            <ClassicButton
              handleClick={() => {
                setEmailLogin(true);
              }}
              className="hover:shadow-md hover:shadow-black/30 text-sm"
              text={"Continue with email"}
            />
          </div>
        </div>
      </section>
    );
  };

  const EmailLogin = () => {
    return (
      <div className="mx-10 py-6 h-screen grid place-items-center">
        <div className="absolute left-0 top-0">
          <button
            onClick={() => {
              setEmailLogin(false);
            }}
            className="flex text-sm items-center gap-1 p-2 rounded-lg hover:bg-gray-600/30 text-focus-text hover:text-focus-text-hover ml-12 mt-12"
          >
            <ChevronLeft size={18} />
            Back
          </button>
        </div>

        <section className="w-80 md:w-[500px] md:px-8 grid place-items-center">
          <div className="w-full md:px-8 2xl:px-16">
            <div
              className={`${
                success ? "bg-green-500" : error ? "bg-red-500" : "hidden"
              } flex gap-2 p-2 rounded-lg mb-4 text-white w-full`}
            >
              {success ? <CheckCircle2 /> : error ? <XCircle /> : null}
              <span>
                {success
                  ? "Magic Link sent to Your Email"
                  : error
                  ? "Something Went Wrong !"
                  : null}
              </span>
            </div>
          </div>
          {!magicsent ? (
            <form
              onSubmit={handleLoginWithEmail}
              className="w-full flex flex-col gap-3 md:px-8 2xl:px-16 group"
              noValidate={true}
            >
              <div className="flex flex-col">
                <label className="text-focus-text mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="johndoe@email.com"
                  autoComplete="email"
                  onChange={() => {
                    setErrorText("");
                  }}
                  className={`peer ${errortext ? "border border-red-500" : ""}`}
                />
                <span
                  className={`mt-2 ${
                    errortext ? "block" : "hidden"
                  } text-sm text-red-500`}
                >
                  Please enter a valid email address
                </span>
              </div>
              <NextButton
                className=""
                text="Next"
                type="submit"
                loading={loading}
              />
            </form>
          ) : null}

          {/* ================================================ */}

          {/* <TempSignin /> */}
        </section>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-auth-background">
      {emailLogin ? <EmailLogin /> : <InitialUI />}
    </main>
  );
};

export default Signin;
