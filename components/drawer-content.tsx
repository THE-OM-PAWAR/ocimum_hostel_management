'use client';

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { closeDrawer } from "@/store/slices/drawerSlice";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function DrawerContent() {
  const dispatch = useAppDispatch();
  const { page, content } = useAppSelector((state) => state.drawer);

  if (!page || !content.type) return null;

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
                  "w-full justify-start",
                  action.variant === 'destructive' && "text-destructive"
                )}
                onClick={() => {
                  action.onClick();
                  dispatch(closeDrawer());
                }}
              >
                {action.label}
              </Button>
              {index < (content.actions?.length || 0) - 1 && (
                <Separator className="my-4" />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
} 