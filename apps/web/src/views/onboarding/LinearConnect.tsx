"use client";

import { NextButton } from "@/components/ui/custom-buttons";
import useLinear  from "@/server/userLinear";

const ConnectLinear = (props: {
  accessToken: string;
}) => {
    const handleLogin = useLinear(props.accessToken)
  return (
    <main className="min-h-screen bg-auth-background grid place-items-center">
      <section className="md:w-[450px] w-96 px-8">
        <div className="px-8 2xl:px-16 mb-6">

          <div className="flex flex-col gap-3 mt-6 md:px-8 2xl:px-20">
            <NextButton
              handleClick={handleLogin.handleLogin}
              className="text-sm"
              text="Connect with linear"
            />
          </div>
        </div>

      </section>
    </main>
  );
};

export default ConnectLinear;
