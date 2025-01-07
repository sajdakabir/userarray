"use client";

import Image from "next/image";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { FormEvent, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import LoginWithGoogle from "@/server/actions/auth/google-login";
import { MAGIC_LOGIN } from "@/utils/constants/api-endpoints";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";

const Signin = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isSignUp = searchParams.get("mode") === "signup";

  const [loading, setLoading] = useState<boolean>(false);
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
              {isSignUp ? "Create your account" : "Sign in to your account"}
            </h1>
            <p className="text-sm text-zinc-400">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button onClick={toggleMode} className="text-white hover:text-zinc-300">
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </p>
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              type="button"
              disabled={loading}
              onClick={() => googleLogin()}
              className="w-full bg-[#0C0C0C] border border-zinc-800 text-white hover:bg-zinc-900 hover:text-zinc-100 h-9 font-normal"
            >
              <div className="flex items-center justify-center gap-2">
                <Image
                  src="/google-colored.svg"
                  alt="Google"
                  width={16}
                  height={16}
                />
                <span>Sign {isSignUp ? "up" : "in"} with Google</span>
              </div>
            </Button>

            <div className="relative py-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0C0C0C] px-2 text-zinc-500">Or continue with</span>
              </div>
            </div>

            <form onSubmit={handleLoginWithEmail} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-zinc-400">
                  Work Email
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
                  } bg-[#0C0C0C] border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-zinc-500 focus-visible:ring-offset-0 h-9`}
                />
                {errortext && (
                  <p className="text-sm text-destructive">{errortext}</p>
                )}
              </div>

              {(success || error) && !magicsent && (
                <div
                  className={`${
                    success ? "bg-emerald-500/15 text-emerald-500" : "bg-destructive/15 text-destructive"
                  } flex items-center gap-2 rounded-md p-2 text-sm`}
                >
                  {success ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  <span>
                    {success
                      ? "Magic Link sent to your email"
                      : "Something went wrong!"}
                  </span>
                </div>
              )}

              <Button 
                disabled={loading || magicsent} 
                className="w-full bg-white text-black hover:bg-zinc-100 h-9 font-normal"
              >
                {loading && (
                  <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-black border-t-transparent" />
                )}
                {magicsent ? "Magic Link Sent" : "Send Magic Link"}
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-zinc-500">
            By {isSignUp ? "signing up" : "signing in"}, you agree to our{" "}
            <a
              href="/terms"
              className="text-zinc-400 hover:text-zinc-300"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="text-zinc-400 hover:text-zinc-300"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Signin;
