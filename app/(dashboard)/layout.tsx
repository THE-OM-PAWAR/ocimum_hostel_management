"use client";

import { useClerk, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
}

function SidebarItem({ icon, label, href, isActive }: SidebarItemProps) {
  return (
    <Link 
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        isActive && "bg-accent text-accent-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { signOut } = useClerk();
  const router = useRouter();

  return (
    <>
      <SignedIn>
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-60 bg-card border-r flex flex-col fixed h-screen">
            {/* Logo */}
            <div className="p-6 border-b">
              <div className="h-8 w-8 bg-primary rounded-lg"></div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
              <div className="space-y-2">
                <SidebarItem 
                  icon={<LayoutDashboard className="h-5 w-5" />}
                  label="Dashboard"
                  href="/dashboard"
                />
                <SidebarItem 
                  icon={<Settings className="h-5 w-5" />}
                  label="Settings"
                  href="/settings"
                />
              </div>
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3"
                onClick={() => signOut(() => router.push("/"))}
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 ml-60 min-h-screen bg-background">
            <div className="container py-8">
              {children}
            </div>
          </main>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}