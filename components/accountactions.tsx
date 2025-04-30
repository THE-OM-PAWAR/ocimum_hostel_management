import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SidebarInput } from "@/components/ui/sidebar"
import { ArrowRight } from "lucide-react"

export function SidebarOptInForm() {
  return (
    <Card className="shadow-none">
      <form>
        <CardContent className="grid gap-2.5 p-4">
          <SidebarInput type="email" placeholder="Email" />
          <Button
              onClick={handleLogout}
              variant="outline"
              className={cn(
                "w-full flex items-center gap-2",
                isSidebarCollapsed && "justify-center p-2"
              )}
            >
              <ArrowRight className="h-4 w-4" />
              {!isSidebarCollapsed && ("Log Out")}
            </Button>
        </CardContent>
      </form>
    </Card>
  )
}
