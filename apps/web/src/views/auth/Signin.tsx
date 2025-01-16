"use client";

import Image from "next/image";
import axios, { AxiosError } from "axios";
import { FormEvent, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import LoginWithGoogle from "@/server/actions/auth/google-login";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { MAGIC_LOGIN } from "@/config/constant/cookie";

const Signin = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isSignUp = searchParams.get("mode") === "signup";

  const [loading, setLoading] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [errortext, setErrorText] = useState<string>("");
  const [magicsent, setMagicsent] = useState<boolean>(false);

  const toggleMode = () => {
    const newMode = isSignUp ? "" : "signup";
    router.replace(newMode ? `?mode=${newMode}` : "/");
  };

  const handleLoginWithEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const formdata = new FormData(e.currentTarget);
    const email = formdata.get("email");

    console.log(success);
    
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
      console.log("data", data);
    } catch (error) {
      const e = error as AxiosError;
      console.log(e.response);
      setError(true);
    }

    setLoading(false);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      setGoogleLoading(true);
      try {
        await LoginWithGoogle(codeResponse.code);
      } catch (error) {
        console.error("Google login failed:", error);
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      console.error("Google login failed");
      setGoogleLoading(false);
    },
    flow: "auth-code",
  });

  return (
    <div className="min-h-screen bg-[#0C0C0C] flex flex-col">
      <header className="flex items-center justify-between px-6 py-3 border-b border-white/10">
        <span className="text-white font-medium">
          userArray
        </span>
        <nav className="flex items-center gap-6">
          <button 
            onClick={() => window.open('https://github.com/sajdakabir/userarray', '_blank')}
            className="text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            GitHub
          </button>
          <button 
            onClick={() => window.open('https://userarray.com/changelog', '_blank')}
            className="text-sm bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-md text-white transition-colors cursor-pointer"
          >
            Demo
          </button>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center -mt-24">
        <div className="w-full max-w-[320px] space-y-4">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h1>
            <p className="text-sm text-zinc-400">
              {isSignUp
                ? "Create an account to get started"
                : "Sign in to your account to continue"}
            </p>
          </div>

          <div className="space-y-4">
            <Button
              variant="outline"
              type="button"
              disabled={googleLoading}
              onClick={() => googleLogin()}
              className="w-full bg-[#0C0C0C] border border-zinc-800 text-white hover:bg-zinc-900 hover:text-zinc-100 h-9 font-normal"
            >
              <div className="flex items-center justify-center gap-2">
                {googleLoading ? (
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Image
                    src="/google-colored.svg"
                    alt="Google"
                    width={16}
                    height={16}
                  />
                )}
                <span>Sign {isSignUp ? "up" : "in"} with Google</span>
              </div>
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0C0C0C] px-2 text-zinc-400">Or continue with</span>
              </div>
            </div>

            <form onSubmit={handleLoginWithEmail} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-zinc-400">
                  Email address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  className="bg-[#0C0C0C] border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-500 focus-visible:ring-offset-0 h-9"
                />
                {errortext && (
                  <p className="text-xs text-red-500">{errortext}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-zinc-100 h-9 font-normal"
                disabled={loading || magicsent}
              >
                {loading && (
                  <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-black border-t-transparent" />
                )}
                {magicsent ? (
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                ) : error ? (
                  <XCircle className="mr-2 h-4 w-4 text-red-500" />
                ) : null}
                {magicsent
                  ? "Check your email"
                  : `Sign ${isSignUp ? "up" : "in"} with email`}
              </Button>
            </form>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm text-zinc-400 hover:text-white"
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signin;
