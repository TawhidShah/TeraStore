"use client";

import { SignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const { user } = useUser();

  if (user) {
    router.replace("/dashboard");
    return null;
  }
  return (
    <div className="flex flex-1 items-center justify-center">
      <SignIn />
    </div>
  );
}
