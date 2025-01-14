"use client";
import { NextButton } from "@/components/ui/custom-buttons";
import CustomLogin from "@/server/actions/auth/custom-login";
import { useState } from "react";

const TempSignin = () => {
  const [c_email, setCEmail] = useState<string>("");
  const [c_pass, setCPass] = useState<string>("");

  const handleCustomLogin = async () => {
    await CustomLogin(c_email, c_pass);
  };

  return (
    <div id="hidden" className="flex flex-col gap-2 mt-6 w-full">
      <input
        type="email"
        name="c_email"
        id="c_email"
        value={c_email}
        onChange={(e) => {
          setCEmail(e.target.value);
        }}
        placeholder="email"
      />
      <input
        type="password"
        name="c_pass"
        id="c_pass"
        value={c_pass}
        onChange={(e) => {
          setCPass(e.target.value);
        }}
        placeholder="password"
      />
      <NextButton text="Login" type="submit" handleClick={handleCustomLogin} />
    </div>
  );
};

export default TempSignin;
