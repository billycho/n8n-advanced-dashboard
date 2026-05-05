"use client";

import { useRouter } from "next/navigation";
import { useReports } from "@/features/reports/hooks";
import { Eye, AlertCircle, CheckCircle2, AlertTriangle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function ReportsPage() {
  const router = useRouter();
  const { data: reports = [], isLoading } = useReports();

  const handleView = (reportId: string) => {
    router.push(`/dashboard/report/${reportId}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Success</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "warning":
        return <Badge variant="secondary" className="bg-yellow-500 text-white hover:bg-yellow-600">Warning</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agent Reports</h1>
          <p className="text-muted-foreground">Monitor performance and execution results from your AI agents</p>
        </div>
      </div>

      <Card className="shadow-md border-primary/10">
        <CardHeader>
          <CardTitle>Execution History</CardTitle>
          <CardDescription>A complete log of agent analyzer reports</CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[15%]">Date</TableHead>
                  <TableHead className="w-[15%]">Agent</TableHead>
                  <TableHead className="w-[10%]">Status</TableHead>
                  <TableHead className="w-[50%]">Summary</TableHead>
                  <TableHead className="w-[10%] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {reports.map((report) => (
                  <TableRow
                    key={report._id}
                    onClick={() => handleView(report._id)}
                    className="group cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium text-sm whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {format(new Date(report.report_date), "MMM d, HH:mm")}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="font-semibold truncate max-w-[150px]">
                        {report.agent?.name || "Unknown Agent"}
                      </div>
                      <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {report.agent?.category}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(report.report_status)}
                        <span className="hidden sm:inline">{getStatusBadge(report.report_status)}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <p className="text-sm text-muted-foreground line-clamp-1">
  {report.report_summary?.slice(0, 120)}
</p>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(report._id);
                        }}
                      >
                        <Eye className="h-4 w-4 text-blue-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {reports.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-12"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle className="h-8 w-8 text-muted-foreground/50" />
                        <p>No reports found. Once your agents start running, reports will appear here.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
