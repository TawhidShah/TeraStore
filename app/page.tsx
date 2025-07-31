import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import homeCardContent from "@/constants/homeCardContent";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center pt-20 text-center">
      <h1 className="mb-4 text-5xl font-bold md:text-6xl">
        Welcome to{" "}
        <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          TeraStore
        </span>
      </h1>
      <h2 className="mb-8 text-lg text-gray-700 md:text-xl dark:text-gray-400">
        Securely store, access, and manage your files with ease.
      </h2>

      <SignedIn>
        <DashboardLinkButton text="Go to Dashboard" />
      </SignedIn>
      <SignedOut>
        <DashboardLinkButton text="Get Started" />
      </SignedOut>

      <div className="mt-16 flex max-w-lg flex-col items-center gap-8 lg:max-w-6xl lg:flex-row">
        {homeCardContent.map((feature, index) => (
          <Card key={index} className="border-0">
            <CardHeader className="text-center">
              <feature.icon className="mx-auto mb-4 h-8 w-8 text-blue-500" />
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-700 dark:text-gray-400">
                {feature.content}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}

const DashboardLinkButton = ({ text }: { text: string }) => (
  <Button className="bg-blue-500 text-white hover:bg-blue-600" asChild>
    <Link href="/dashboard">
      {text}
      <ArrowRight className="ml-2 h-4 w-4" />
    </Link>
  </Button>
);
