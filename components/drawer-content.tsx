'use client';

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { closeDrawer } from "@/store/slices/drawerSlice";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { RootState } from "@/store";
import { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";

export function DrawerContent() {
  const dispatch = useAppDispatch();
  const { page, content } = useAppSelector((state: RootState) => state.drawer);

  if (!page || !content.type) return null;

  const renderIcon = (iconName?: string) => {
    if (!iconName) return null;
    const Icon = Icons[iconName as keyof typeof Icons] as LucideIcon;
    return Icon ? <Icon className="h-5 w-5" /> : null;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">{content.title}</h2>
        {content.description && (
          <p className="text-sm text-muted-foreground mt-1">{content.description}</p>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {content.actions?.map((action, index) => (
            <div key={index}>
              <Button
                variant={action.variant || 'default'}
                className={cn(
                  "w-full justify-start gap-2",
                  action.variant === 'destructive' && "text-destructive",
                  action.disabled && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => {
                  if (!action.disabled) {
                    action.onClick();
                    dispatch(closeDrawer(undefined));
                  }
                }}
                disabled={action.disabled}
              >
                {renderIcon(action.icon)}
                <div className="flex flex-col items-start">
                  <span>{action.label}</span>
                  {action.description && (
                    <span className="text-xs text-muted-foreground">
                      {action.description}
                    </span>
                  )}
                </div>
              </Button>
              {index < (content.actions?.length || 0) - 1 && (
                <Separator className="my-4" />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {content.data && (
        <div className="p-4 border-t">
          <pre className="text-xs text-muted-foreground">
            {JSON.stringify(content.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 