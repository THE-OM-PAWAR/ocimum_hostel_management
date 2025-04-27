"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  Home,
  Building2,
  User,
  Settings,
  BoxSelect,
  BoxIcon,
  LayoutDashboardIcon,
  Wallet2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const { user } = useUser();

  const breadcrumbItems = [
    // Always show user name as first item if available
    ...(user?.fullName
      ? [
          {
            label: user.fullName,
            href: "/dashboard",
            icon: <Home className="h-4 w-4" />,
            isUserName: true,
          },
        ]
      : []),

    // Map remaining segments
    ...segments
      .map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        let label = segment;
        let icon = null;

        // Handle dynamic segments and route mapping
        if (index === 1 && segments[0] === "dashboard") {
          label = "Block";
          icon = <Building2 className="h-4 w-4" />;
        } else if (index === 3 && segments[2] === "tenants") {
          label = "Tenant";
          icon = <User className="h-4 w-4" />;
        } else {
          switch (segment) {
            case "dashboard":
              label = "Dashboard";
              icon = <LayoutDashboardIcon className="h-4 w-4" />;
              break;
            case "tenants":
              label = "Tenants";
              icon = <User className="h-4 w-4" />;
              break;
            case "settings":
              label = "Settings";
              icon = <Settings className="h-4 w-4" />;
              break;
            case "room-components":
              label = "Room Components";
              icon = <BoxSelect className="h-4 w-4" />;
              break;
            case "room-types":
              label = "Room Types";
              icon = <BoxIcon className="h-4 w-4" />;
              break;
            case "payment-settings":
              label = "Payment Settings";
              icon = <Wallet2 className="h-4 w-4" />;
              break;
            case "maintenance":
              label = "Maintenance";
              break;
            case "notifications":
              label = "Notifications";
              break;
            case "access-control":
              label = "Access Control";
              break;
          }
        }

        // Skip dynamic IDs from the breadcrumb
        if (index === 1 && segments[0] === "dashboard") {
          return {
            href,
            label,
            icon,
          };
        } else if (
          segments[index - 1] === "dashboard" ||
          segments[index - 1] === "tenants"
        ) {
          return null;
        } else if (index === 2 && segments[2] === "tenants") {
        }

        return {
          href,
          label,
          icon,
        };
      })
      .filter(Boolean), // Remove null items
  ];

  if (breadcrumbItems.length === 0) return null;

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      {breadcrumbItems.map((item, index) => 
        item && (
          <div key={item.href} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
          <Link
            href={item.href}
            className={cn(
              "flex items-center hover:text-foreground transition-colors",
              index === breadcrumbItems.length - 1 &&
                "text-foreground pointer-events-none",
              item.isUserName && "text-lg font-bold text-foreground"
            )}
          >
            {item.icon && <span className="mr-2">{item.icon}</span>}
            <span>{item.label}</span>
          </Link>
        </div>
      ))}
    </nav>
  );
}
