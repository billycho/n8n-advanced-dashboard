"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen gap-6" >

      {/* <div className="bg-blue-500 p-10">Hello</div> */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your business</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm">
            <li>John purchased Pro Plan</li>
            <li>Sarah created a new account</li>
          </ul>
        </CardContent>
      </Card>

      {/* THIS NOW FILLS REMAINING HEIGHT */}
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 grid gap-6 md:grid-cols-2 lg:grid-cols-2">

          <div className="flex flex-col gap-4">
            <Card>
              <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="flex items-center justify-center"><CardContent>1</CardContent></Card>
                <Card className="flex items-center justify-center"><CardContent>2</CardContent></Card>
                <Card className="flex items-center justify-center"><CardContent>3</CardContent></Card>
              </CardContent>
            </Card>

            <Card className="flex-1">
              <CardContent className="h-full">
                test 123
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-4">


            <Card className="flex-1">
              <CardContent className="h-full">
                test 123
              </CardContent>
            </Card>
            <Card>
              <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <Card className="flex items-center justify-center"><CardContent>1</CardContent></Card>
                <Card className="flex items-center justify-center"><CardContent>2</CardContent></Card>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* THIS NOW FILLS REMAINING HEIGHT */}
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          <div className="flex flex-col gap-4">
            <Card>
              <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="flex items-center justify-center"><CardContent>1</CardContent></Card>
                <Card className="flex items-center justify-center"><CardContent>2</CardContent></Card>
                <Card className="flex items-center justify-center"><CardContent>3</CardContent></Card>
                <Card className="flex items-center justify-center"><CardContent>4</CardContent></Card>
              </CardContent>
            </Card>

            <Card className="flex-1">
              <CardContent className="h-full">
                test 123
              </CardContent>
            </Card>
          </div>

          <Card />
          <Card />
          <Card />

        </CardContent>
      </Card>
      <Card>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center justify-center">1</CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-center">2</CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-center">3</CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-center">4</CardContent>
          </Card>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,345</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">567</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.5%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
