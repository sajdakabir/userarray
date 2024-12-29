"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Spinner from "@/components/loaders/Spinner";
import { VerifyMagicLink } from "@/server/actions/auth/magic-link";

const Magic = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [expired, setExpired] = useState(false);
  const token = searchParams.get("token");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        router.push("/");
        return;
      }
      const res = await VerifyMagicLink(token);
      if (res) {
        router.replace("/workspace");
        return;
      } else {
        setExpired(true);
        return;
      }
    };

    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!expired ? (
        <Spinner />
      ) : (
        <main className="bg-sidebar h-screen grid place-content-center">
          <div className="text-focus-text-hover text-2xl">
            Your Magic Link Has Been Expired !
          </div>
        </main>
      )}
    </>
  );
};

export default Magic;
