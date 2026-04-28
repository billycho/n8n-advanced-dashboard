import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const analytics = [
  { label: "Page Views", value: "24,892" },
  { label: "Conversion Rate", value: "4.8%" },
  { label: "Bounce Rate", value: "32%" },
  { label: "Avg Session", value: "3m 12s" },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Track platform performance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {analytics.map((item) => (
          <Card key={item.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{item.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
