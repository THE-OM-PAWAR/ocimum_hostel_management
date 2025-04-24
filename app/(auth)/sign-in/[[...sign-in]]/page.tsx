"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="w-full">
      <SignIn 
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "bg-card border shadow-sm",
          }
        }}
      />
    </div>
  );
}