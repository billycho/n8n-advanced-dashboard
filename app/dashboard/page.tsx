import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddUserDialog } from "@/components/features/add-user-dialog"

const stats = [
  { title: "Revenue", value: "$12,450" },
  { title: "Users", value: "1,284" },
  { title: "Orders", value: "342" },
  { title: "Growth", value: "+18%" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your business</p>
        </div>

        <div className="max-w-[100px]">
          <AddUserDialog />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm">
            <li>John purchased Pro Plan</li>
            <li>Sarah created a new account</li>
            <li>Michael submitted support ticket</li>
            <li>Emma upgraded subscription</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
