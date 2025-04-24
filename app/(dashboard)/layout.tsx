"use client";

import { useClerk, UserButton } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  LayoutDashboard,
  Settings,
  Users,
  CreditCard,
  Home,
  Bell,
  BarChart3,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { OnboardingDialog } from "@/components/onboarding-dialog";

const navigationItems = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: "/dashboard",
  },
  {
    title: "Tenants",
    icon: <Users className="h-5 w-5" />,
    href: "/tenants",
  },
  {
    title: "Rooms",
    icon: <Home className="h-5 w-5" />,
    href: "/rooms",
  },
  {
    title: "Payments",
    icon: <CreditCard className="h-5 w-5" />,
    href: "/payments",
  },
  {
    title: "Analytics",
    icon: <BarChart3 className="h-5 w-5" />,
    href: "/analytics",
  },
  {
    title: "Settings",
    icon: <Settings className="h-5 w-5" />,
    href: "/settings",
  },
];

interface SidebarItemProps {
  icon: React.ReactNode;
  title: string;
  href: string;
  isActive?: boolean;
}

function SidebarItem({ icon, title, href, isActive }: SidebarItemProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
            )}
          >
            {icon}
            <span>{title}</span>
          </Link>
        </TooltipTrigger>
      </Tooltip>
    </TooltipProvider>
  );
}

function MobileNavItem({ icon, href, isActive }: { icon: React.ReactNode; href: string; isActive: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-1 justify-center p-3 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
        isActive && "bg-accent/50 text-accent-foreground"
      )}
    >
      {icon}
    </Link>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const pathname = usePathname();
  const { user } = useClerk();

  useEffect(() => {
    if (user) {
      setUserName(user.fullName || "User");
    }
  }, [user]);

  // Only show first 5 items in mobile navigation
  const mobileNavItems = navigationItems.slice(0, 5);

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex h-screen w-[240px] border-r bg-card">
        <div className="flex w-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b px-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">HostelHub</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navigationItems.map((item) => (
              <SidebarItem
                key={item.href}
                {...item}
                isActive={pathname === item.href}
              />
            ))}
          </nav>

          {/* User */}
          <div className="border-t p-4">
            <Button
              variant="outline"
              className="w-full flex justify-between items-center gap-2"
            >
              <div className="flex items-center gap-2">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      rootBox: "w-fit",
                      userButtonBox: "w-fit",
                      userButtonTrigger: "w-fit",
                    },
                  }}
                />
                <span className="text-sm font-medium">{userName}</span>
              </div>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="w-[240px] p-0">
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center border-b px-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">HostelHub</span>
              </div>
            </div>
            <nav className="flex-1 space-y-1 p-4">
              {navigationItems.map((item) => (
                <SidebarItem
                  key={item.href}
                  {...item}
                  isActive={pathname === item.href}
                />
              ))}
            </nav>
            <div className="border-t p-4">
              <Button
                variant="outline"
                className="w-full flex justify-between items-center gap-2"
              >
                <div className="flex items-center gap-2">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        rootBox: "w-fit",
                        userButtonBox: "w-fit",
                        userButtonTrigger: "w-fit",
                      },
                    }}
                  />
                  <span className="text-sm font-medium">{userName}</span>
                </div>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-background pb-16 md:pb-0">
        <div className="container py-8 px-4 md:px-8">
          {children}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background md:hidden">
        <nav className="flex items-center">
          {mobileNavItems.map((item) => (
            <MobileNavItem
              key={item.href}
              icon={item.icon}
              href={item.href}
              isActive={pathname === item.href}
            />
          ))}
        </nav>
      </div>
      <OnboardingDialog />
    </div>
  );
}