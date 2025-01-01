"use client";

import Image from "next/image";
import axios, { AxiosError } from "axios";
import { FormEvent, useState } from "react";
import { CheckCircle2, ChevronLeft, XCircle } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import LoginWithGoogle from "@/server/actions/auth/google-login";
import { MAGIC_LOGIN } from "@/utils/constants/api-endpoints";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const Signin = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [errortext, setErrorText] = useState<string>("");
  const [magicsent, setMagicsent] = useState<boolean>(false);

  const handleLoginWithEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const formdata = new FormData(e.currentTarget);
    const email = formdata.get("email");
    
    if (typeof email !== "string") {
      setErrorText("Please enter an email address");
      return;
    }

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
      setLoading(true);
      await LoginWithGoogle(codeResponse.code);
      setLoading(false);
    },
    onError: () => {
      console.error("Google login failed");
    },
    flow: "auth-code",
  });

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
              &ldquo;This platform has revolutionized how we collaborate and manage our projects. It's simple, efficient, and incredibly powerful.&rdquo;
            </p>
            <footer className="text-sm text-muted-foreground">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>
      <div className="relative p-4 lg:p-8 h-full flex items-center bg-[#09090B]">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
        <div className="relative mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Welcome back
            </h1>
            <p className="text-sm text-zinc-400">
              Enter your email to sign in to your account
            </p>
          </div>

          <div className="grid gap-6">
            <form onSubmit={handleLoginWithEmail}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  {(success || error) && !magicsent && (
                    <div
                      className={`${
                        success ? "bg-emerald-500/15 text-emerald-500" : "bg-destructive/15 text-destructive"
                      } flex items-center gap-2 rounded-md p-3 text-sm`}
                    >
                      {success ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                      <span>
                        {success
                          ? "Magic Link sent to your email"
                          : "Something went wrong!"}
                      </span>
                    </div>
                  )}
                  <div className="grid gap-1">
                    <Label className="sr-only" htmlFor="email">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      placeholder="name@example.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={loading}
                      onChange={() => setErrorText("")}
                      className={`${
                        errortext ? "ring-destructive" : ""
                      } bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-400 focus-visible:ring-zinc-500 focus-visible:ring-offset-0`}
                    />
                    {errortext && (
                      <p className="text-sm text-destructive">{errortext}</p>
                    )}
                  </div>
                </div>
                <Button 
                  disabled={loading} 
                  className="w-full bg-zinc-50 text-zinc-900 hover:bg-zinc-200"
                >
                  {loading && (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent" />
                  )}
                  Sign In with Email
                </Button>
              </div>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-900 px-2 text-zinc-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="w-full">
              <Button
                variant="outline"
                type="button"
                disabled={loading}
                onClick={() => googleLogin()}
                className="w-full bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-300"
              >
                <div className="flex items-center justify-center">
                  {loading ? (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current" />
                  ) : (
                    <Image
                      src="/google.svg"
                      alt="Google"
                      width={15}
                      height={15}
                      className="mr-2 h-4 w-4"
                    />
                  )}
                  <span>Google</span>
                </div>
              </Button>
            </div>
          </div>

          <p className="text-center text-sm text-zinc-400">
            By clicking continue, you agree to our{" "}
            <a
              href="/terms"
              className="underline underline-offset-4 hover:text-zinc-300"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="underline underline-offset-4 hover:text-zinc-300"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
