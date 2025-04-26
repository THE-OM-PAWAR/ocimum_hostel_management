"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home, Building2, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const breadcrumbItems = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join('/')}`;
    let label = segment.charAt(0).toUpperCase() + segment.slice(1);
    let icon = null;

    switch (segment) {
      case 'dashboard':
        icon = <Home className="h-4 w-4" />;
        break;
      case 'blocks':
        icon = <Building2 className="h-4 w-4" />;
        label = 'Block';
        break;
      case 'settings':
        icon = <Settings className="h-4 w-4" />;
        break;
    }

    return {
      href,
      label,
      icon,
    };
  });

  if (breadcrumbItems.length === 0) return null;

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
      {breadcrumbItems.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
          <Link
            href={item.href}
            className={cn(
              "flex items-center hover:text-foreground transition-colors",
              index === breadcrumbItems.length - 1 && "text-foreground pointer-events-none"
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