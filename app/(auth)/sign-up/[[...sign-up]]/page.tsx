"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="w-full">
      <SignUp 
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