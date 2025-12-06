"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter, usePathname, useParams } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  LayoutDashboard,
  Settings,
  Users,
  ArrowRight,
  CreditCard,
  Bell,
  BarChart3,
  Menu,
  ChevronLeft,
  User,
  MoreVertical,
  FileText,
  LogOut,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";
import { NotificationButton } from "@/components/notification-button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openDrawer, closeDrawer } from "@/store/slices/drawerSlice";
import { DrawerContent as CustomDrawerContent } from "@/components/drawer-content";
import { RootState } from "@/store";

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
  // {
  //   title: "Payments",
  //   icon: <CreditCard className="h-5 w-5" />,
  //   href: "/payments",
  // },
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

function SidebarItem({
  icon,
  title,
  href,
  isActive,
  collapsed,
}: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        "hover:text-primary",
        isActive ? "text-primary" : "text-muted-foreground",
        collapsed && "justify-center px-2"
      )}
    >
      <div className={cn(
        "flex items-center gap-3",
        isActive && "text-primary"
      )}>
        {icon}
        {!collapsed && <span>{title}</span>}
      </div>
    </Link>
  );
}

function MobileNavItem({
  icon,
  href,
  isActive,
}: {
  icon: React.ReactNode;
  href: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center p-3 text-muted-foreground transition-colors hover:text-primary",
        isActive && "text-primary"
      )}
    >
      {icon}
      <span className="text-xs mt-1">{navigationItems.find(item => item.href === href)?.title}</span>
    </Link>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();
  const router = useRouter();
  const { signOut } = useClerk();
  const [pageTitle, setPageTitle] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const { isOpen, page } = useAppSelector((state: RootState) => state.drawer);
  const params = useParams();

  const getPageTitle = async (path: string) => {
    // Remove leading slash and split the path
    const pathParts = path.slice(1).split('/');
    
    // Handle main navigation items
    const mainNavItem = navigationItems.find(item => item.href === path);
    if (mainNavItem) return mainNavItem.title;

    // Handle sub-pages
    if (pathParts[0] === 'dashboard') {
      if (pathParts.length === 1) return 'Dashboard';
      
      // Handle hostel pages
      if (pathParts[1] && pathParts[1] !== 'settings') {
        try {
          const response = await fetch(`/api/users/${user?.id}/hostel/${pathParts[1]}`);
          if (response.ok) {
            const hostel = await response.json();
            if (pathParts[2] === 'settings') return `${hostel.name} Settings`;
            if (pathParts[2] === 'tenants' && pathParts[3]) {
              const tenantResponse = await fetch(`/api/users/${user?.id}/tenants/${pathParts[3]}`);
              if (tenantResponse.ok) {
                const tenant = await tenantResponse.json();
                return tenant.name;
              }
            }
            return hostel.name;
          }
        } catch (error) {
          console.error('Error fetching hostel details:', error);
        }
      }
    }
    
    if (pathParts[0] === 'hostels') {
      if (pathParts.length === 1) return 'Hostels';
      if (pathParts[2] === 'settings') return 'Hostel Settings';
      return 'Hostel Details';
    }
    if (pathParts[0] === 'tenants') {
      if (pathParts.length === 1) return 'Tenants';
      return 'Tenant Details';
    }
    if (pathParts[0] === 'payments') {
      if (pathParts.length === 1) return 'Payments';
      return 'Payment Details';
    }
    if (pathParts[0] === 'settings') {
      return 'Settings';
    }
    if (pathParts[0] === 'profile') {
      return 'Profile';
    }

    // Default case
    return pathParts[pathParts.length - 1]
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  useEffect(() => {
    const fetchTitle = async () => {
      setLoading(true);
      const title = await getPageTitle(pathname);
      setPageTitle(title);
      setLoading(false);
    };
    fetchTitle();
  }, [pathname, user?.id]);

  // Check onboarding status and redirect if needed
  useEffect(() => {
    const checkOnboarding = async () => {
      if (!user?.id || pathname === '/onboarding') return;
      
      try {
        const response = await fetch(`/api/users/${user.id}/onboarding-status`);
        const data = await response.json();
        
        if (!data.isOnboarded) {
          router.push('/onboarding');
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    };

    if (user?.id) {
      checkOnboarding();
    }
  }, [user?.id, pathname, router]);

  const handleLogout = () => {
    signOut(() => {
      router.push(`/`);
      console.log("User logged out");
    });
  };

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
                <span className="text-xl font-bold">Getstay</span>
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
          <Card className="shadow-none border-t p-4">
              <CardContent className="grid gap-2.5 p-4">
                <Button
                  onClick={() => user && router.push(`/profile/${user.id}`)}
                  variant="outline"
                  className="w-full flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  {!isSidebarCollapsed && (user?.fullName || "Profile")}
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="default"
                  className={cn(
                    "w-full flex items-center gap-2",
                    isSidebarCollapsed && "justify-center p-2"
                  )}
                >
                  <ArrowRight className="h-4 w-4" />
                  {!isSidebarCollapsed && "Log Out"}
                </Button>
              </CardContent>
          </Card>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 transition-all duration-300",
          isSidebarCollapsed ? "md:ml-[80px]" : "md:ml-[240px]"
        )}
      >
        <div className="min-h-screen overflow-y-auto">
          {/* Header with Toggle and Breadcrumbs */}
          <div className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 flex items-center w-full">
            <Button
              variant="ghost"
              size="icon"
              className="ml-4 hidden md:flex"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
              <ChevronLeft
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isSidebarCollapsed && "rotate-180"
                )}
              />
            </Button> 
            <div className="px-4 hidden md:flex">
              <Breadcrumbs />
            </div>
            {/* Mobile Header */}
            <div className="flex items-center justify-between w-full px-4 md:hidden">
              {pathname === "/dashboard" ? (
                <div className="flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold">Getstay</span>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.back()}
                      className="mr-2"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <span className="text-lg font-semibold">
                      {loading ? "Loading..." : pageTitle}
                    </span>
                  </div>  
                </div>
              )}
            </div>
            
            {/* Notification Button */}
            <div className="ml-auto mr-4">
              <NotificationButton />
            </div>
          </div>

          <div className="container max-sm:mb-8 py-8 px-4 md:px-8">{children}</div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
        <nav className="flex items-center justify-around">
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

      {/* Global Drawer */}
      <Drawer open={isOpen} onOpenChange={(open) => { if (!open) dispatch(closeDrawer(undefined)); }}>
        <DrawerContent>
          <CustomDrawerContent />
        </DrawerContent>
      </Drawer>

      <PWAInstallPrompt />
    </div>
  );
}