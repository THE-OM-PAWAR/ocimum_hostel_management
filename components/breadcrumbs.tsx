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

  const breadcrumbItems = [
    // Always show user name as first item if available
    ...(user?.fullName ? [{
      label: user.fullName,
      href: '/dashboard',
      icon: <Home className="h-4 w-4" />,
      isUserName: true
    }] : []),
    
    // Map remaining segments
    ...segments.map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join('/')}`;
      let label = segment;
      let icon = null;

      switch (segment) {
        case 'dashboard':
          label = 'Dashboard';
          break;
        case 'blocks':
          label = 'Block';
          icon = <Building2 className="h-4 w-4" />;
          break;
        case 'settings':
          label = 'Settings';
          icon = <Settings className="h-4 w-4" />;
          break;
        case 'room-components':
          label = 'Room Components';
          break;
        case 'room-types':
          label = 'Room Types';
          break;
        case 'payment-settings':
          label = 'Payment Settings';
          break;
        case 'maintenance':
          label = 'Maintenance';
          break;
        case 'notifications':
          label = 'Notifications';
          break;
        case 'access-control':
          label = 'Access Control';
          break;
        default:
          // If it's a blockId, keep it as "Block"
          if (index === 1 && segments[0] === 'blocks') {
            label = 'Block';
            icon = <Building2 className="h-4 w-4" />;
          }
      }

      return {
        href,
        label,
        icon,
      };
    }).filter(item => item.label !== 'Dashboard' || segments.length === 1) // Only show Dashboard when it's the only segment
  ];

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
              item.isUserName && "font-bold text-foreground"
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