"use client";

import { useAIAgents } from "@/features/ai-agents/hooks";
import { useReports } from "@/features/reports/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { isToday, isThisWeek, parseISO } from "date-fns";
import { Bot, Activity, FileText, CalendarDays } from "lucide-react";

export default function DashboardPage() {
  const { data: agents, isLoading: isAgentsLoading } = useAIAgents();
  const { data: reports, isLoading: isReportsLoading } = useReports();

  const isLoading = isAgentsLoading || isReportsLoading;

  // Compute Metrics
  const totalAgents = agents?.length || 0;
  // Assume 'prod' environment means 'Active' for overview purposes
  const activeAgents = agents?.filter((a) => a.environment === "prod").length || 0;

  const todayReports = reports?.filter((r) => {
    try {
      return isToday(parseISO(r.report_date));
    } catch {
      return false;
    }
  }).length || 0;

  const weekReports = reports?.filter((r) => {
    try {
      return isThisWeek(parseISO(r.report_date));
    } catch {
      return false;
    }
  }).length || 0;

  // Get Latest 5
  const latestAgents = [...(agents || [])]
    .sort((a, b) => new Date((b as any).createdAt || 0).getTime() - new Date((a as any).createdAt || 0).getTime())
    .slice(0, 5);

  const latestReports = [...(reports || [])]
    .sort((a, b) => new Date(b.report_date || (b as any).createdAt || 0).getTime() - new Date(a.report_date || (a as any).createdAt || 0).getTime())
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">High-level metrics for your AI Agents and Reports</p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Active AI Agents</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAgents}</div>
            <p className="text-xs text-muted-foreground mt-1">Agents in production</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total AI Agents</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAgents}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all environments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports Today</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayReports}</div>
            <p className="text-xs text-muted-foreground mt-1">Activity from today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports This Week</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weekReports}</div>
            <p className="text-xs text-muted-foreground mt-1">Activity from this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Tables Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Latest AI Agents */}
        <Card className="col-span-1 shadow-md border-primary/10">
          <CardHeader>
            <CardTitle>5 Latest AI Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Environment</TableHead>
                  <TableHead className="text-right">Model</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestAgents.length > 0 ? (
                  latestAgents.map((agent) => (
                    <TableRow key={agent._id}>
                      <TableCell className="font-medium">{agent.name}</TableCell>
                      <TableCell>
                        <Badge variant={agent.environment === "prod" ? "default" : "secondary"} className="capitalize">
                          {agent.environment || "dev"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right capitalize text-muted-foreground">
                        {agent.model || "N/A"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                      No AI Agents found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Latest Reports */}
        <Card className="col-span-1 shadow-md border-primary/10">
          <CardHeader>
            <CardTitle>5 Latest Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestReports.length > 0 ? (
                  latestReports.map((report) => (
                    <TableRow key={report._id}>
                      <TableCell className="font-medium truncate max-w-[150px]">
                        {report.agent?.name || "Unknown Agent"}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            report.report_status === "success" 
                              ? "default" 
                              : report.report_status === "failed" 
                                ? "destructive" 
                                : "outline"
                          } 
                          className={report.report_status === "success" ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                          {report.report_status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {new Date(report.report_date).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                      No reports found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
