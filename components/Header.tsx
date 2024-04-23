"use client";

import {
  SignInButton,
  SignedOut,
  SignedIn,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ThemeToggler from "./ThemeToggler";

const Header = () => {
  const { isSignedIn } = useUser();

  return (
    <header className="flex items-center justify-between border-b border-gray-300 px-6 py-3 dark:border-gray-800">
      <Link href="/" className="flex items-center space-x-2">
        {/* <Image
          src="https://unsplash.it/50/50"
          alt="TeraStore"
          width={50}
          height={50}
        /> */}
        <h1 className="text-xl font-bold">TeraStore</h1>
      </Link>

      <div className="flex items-center space-x-2">
        <ThemeToggler />
        {/* Weird bug when using signedin/signedout shows sign in button even when signedin sometimes */}
        {isSignedIn ? (
          <SignedIn>
            <UserButton />
          </SignedIn>
        ) : (
          <SignedOut>
            <SignInButton />
          </SignedOut>
        )}
      </div>
    </header>
  );
};

export default Header;
