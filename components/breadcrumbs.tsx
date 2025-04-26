"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home, Building2, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const { user } = useUser();

  const breadcrumbItems = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join('/')}`;
    let label = segment;
    let icon = null;

    // Special handling for first segment (dashboard)
    if (index === 0 && segment === 'dashboard') {
      label = user?.fullName || 'Dashboard';
      icon = <Home className="h-4 w-4" />;
    }
    // Handle other segments
    else {
      switch (segment) {
        case 'blocks':
          label = 'Block';
          icon = <Building2 className="h-4 w-4" />;
          break;
        case 'settings':
          label = 'Settings';
          icon = <Settings className="h-4 w-4" />;
          break;
        default:
          // If it's a blockId, keep it as "Block"
          if (index === 1 && segments[0] === 'blocks') {
            label = 'Block';
            icon = <Building2 className="h-4 w-4" />;
          }
      }
    }

    return {
      href,
      label,
      icon,
    };
  });

  if (breadcrumbItems.length === 0) return null;

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      {breadcrumbItems.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
          <Link
            href={item.href}
            className={cn(
              "flex items-center hover:text-foreground transition-colors",
              index === breadcrumbItems.length - 1 && "text-foreground pointer-events-none",
              index === 0 && "font-bold"
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
