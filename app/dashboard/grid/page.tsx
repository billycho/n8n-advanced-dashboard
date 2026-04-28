"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const blocks = [
  { title: "Analytics", span: "col-span-2 row-span-1", height: "h-40" },
  { title: "Revenue", span: "col-span-1 row-span-1", height: "h-40" },
  { title: "Users", span: "col-span-1 row-span-2", height: "h-full" },
  { title: "Traffic", span: "col-span-2 row-span-1", height: "h-48" },
  { title: "Conversion", span: "col-span-1 row-span-1", height: "h-48" },
  { title: "Growth", span: "col-span-1 row-span-1", height: "h-32" },
]

export default function TailwindGridDemoPage() {
  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-4xl font-bold text-white">Tailwind Grid Demo</h1>

        <div className="grid auto-rows-[120px] grid-cols-1 gap-6 md:grid-cols-4">
          {blocks.map((block) => (
            <Card
              key={block.title}
              className={`${block.span} ${block.height} rounded-3xl border border-white/10 bg-slate-900 text-white shadow-xl`}
            >
              <CardHeader>
                <CardTitle>{block.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-full rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
