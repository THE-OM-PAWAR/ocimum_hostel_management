"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  LayoutDashboard,
  Settings,
  Users,
  CreditCard,
  Bell,
  BarChart3,
  Menu,
  ChevronLeft,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { OnboardingDialog } from "@/components/onboarding-dialog";
import { Breadcrumbs } from "@/components/breadcrumbs";

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
    title: "Payments",
    icon: <CreditCard className="h-5 w-5" />,
    href: "/payments",
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
  collapsed?: boolean;
}

function SidebarItem({ icon, title, href, isActive, collapsed }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
        collapsed && "justify-center px-2"
      )}
    >
      {icon}
      {!collapsed && <span>{title}</span>}
    </Link>
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userName, setUserName] = useState("");
  const pathname = usePathname();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setUserName(user.fullName || "User Profile");
    }
  }, [user]);

  const mobileNavItems = navigationItems.slice(0, 5);

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "hidden md:flex fixed h-screen border-r bg-card transition-all duration-300",
          isSidebarCollapsed ? "w-[80px]" : "w-[240px]"
        )}
      >
        <div className="flex w-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b px-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              {!isSidebarCollapsed && (
                <span className="text-xl font-bold">HostelHub</span>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navigationItems.map((item) => (
              <SidebarItem
                key={item.href}
                {...item}
                isActive={pathname === item.href}
                collapsed={isSidebarCollapsed}
              />
            ))}
          </nav>

          {/* User */}
          <div className="border-t p-4">
            <Button
              onClick={() => user && router.push(`/profile/${user.id}`)}
              variant="outline"
              className={cn(
                "w-full flex items-center gap-2",
                isSidebarCollapsed && "justify-center p-2"
              )}
            >
              <User className="h-4 w-4" />
              {!isSidebarCollapsed && userName}
            </Button>
          </div>
        </div>

        {/* New Collapse Button */}
        <Button
          variant="secondary"
          size="sm"
          className={cn(
            "absolute top-4 -right-3 h-6 w-6 rounded-full",
            "hover:bg-accent hover:text-accent-foreground",
            "transition-transform duration-200",
            isSidebarCollapsed && "rotate-180"
          )}
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-40">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
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
              <Button onClick={() => user && router.push(`/profile/${user.id}`)} variant="outline" className="w-full flex items-center gap-2">
                <User className="h-4 w-4" />
                {userName}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className={cn(
        "flex-1 transition-all duration-300",
        isSidebarCollapsed ? "md:ml-[80px]" : "md:ml-[240px]"
      )}>
        <div className="min-h-screen overflow-y-auto">
          <div className="container py-8 px-4 md:px-8">
            <Breadcrumbs />
            {children}
          </div>
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