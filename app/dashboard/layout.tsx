import Link from "next/link"
import { Home, Users, BarChart3, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid md:grid-cols-[240px_1fr]">
      <aside className="border-r bg-muted/40 p-4 space-y-4">
        <h2 className="text-xl font-bold">AI Agents Dashboard</h2>

        <nav className="space-y-2">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Home className="h-4 w-4" />
              Overview
            </Button>
          </Link>

          <Link href="/dashboard/ai-agents">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Users className="h-4 w-4" />
              AI Agents
            </Button>
          </Link>

          
          <Link href="/dashboard/settings">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </Link>

          <Link href="/dashboard/analytics">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics (Dev)
            </Button>
          </Link>
          
          <Link href="/dashboard/dashboard-var1">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Settings className="h-4 w-4" />
              Dashboard Var 1 (Dev)
            </Button>
          </Link>
        </nav>
      </aside>

      <main className="p-6 bg-secondary">{children}</main>
    </div>
  )
}
