"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useActivities, useN8nExecutions, useSyncActivities } from "@/features/activities/hooks";
import { AlertCircle, CheckCircle2, Clock, Activity as ActivityIcon, Play, Eye } from "lucide-react";
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

export default function ActivityPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const { data: activities = [], isLoading: isLoadingActivities, refetch } = useActivities();
  const { data: n8nExecutions } = useN8nExecutions();
  const { mutate: sync, isPending: isSyncing } = useSyncActivities();

  useEffect(() => {
    if (n8nExecutions && n8nExecutions.data && Array.isArray(n8nExecutions.data)) {
      sync(n8nExecutions.data);
    }
  }, [n8nExecutions, sync]);

  const totalPages = Math.ceil(activities.length / ITEMS_PER_PAGE);
  const paginatedActivities = activities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleView = (id: string) => {
    router.push(`/dashboard/activities/${id}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "failed":
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "running":
        return <Play className="h-4 w-4 text-blue-500 animate-pulse" />;
      case "waiting":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <ActivityIcon className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Success</Badge>;
      case "failed":
      case "error":
        return <Badge variant="destructive">Failed</Badge>;
      case "running":
        return <Badge variant="secondary" className="bg-blue-500 text-white">Running</Badge>;
      case "waiting":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Waiting</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recent Activity</h1>
          <p className="text-muted-foreground">Monitor real-time workflow executions and agent activities</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => refetch()} 
          disabled={isLoadingActivities || isSyncing}
        >
          {isSyncing ? "Syncing..." : "Refresh"}
        </Button>
      </div>

      <Card className="shadow-md border-primary/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Execution history synced from n8n</CardDescription>
            </div>
            {isSyncing && (
              <Badge variant="outline" className="animate-pulse bg-primary/5">Syncing with n8n...</Badge>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {isLoadingActivities && activities.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[20%]">Started At</TableHead>
                    <TableHead className="w-[25%]">Source (Agent/Workflow)</TableHead>
                    <TableHead className="w-[15%]">Status</TableHead>
                    <TableHead className="w-[10%]">Mode</TableHead>
                    <TableHead className="w-[25%]">Execution ID</TableHead>
                    <TableHead className="w-[5%] text-right"></TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {paginatedActivities.map((activity) => (
                    <TableRow
                      key={activity._id}
                      onClick={() => handleView(activity._id)}
                      className="group cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="font-medium text-sm whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {activity.startedAt ? format(new Date(activity.startedAt), "MMM d, HH:mm:ss") : "N/A"}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="font-semibold truncate max-w-[200px]">
                          {activity.ai_agent?.name || activity.workflow?.name || "Unknown"}
                        </div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {activity.ai_agent?.category || activity.workflow?.category || "System"}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(activity.status)}
                          <span>{getStatusBadge(activity.status)}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline" className="capitalize">{activity.mode}</Badge>
                      </TableCell>

                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {activity.id}
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleView(activity._id);
                          }}
                        >
                          <Eye className="h-4 w-4 text-blue-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

                  {activities.length === 0 && !isLoadingActivities && !isSyncing && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-muted-foreground py-12"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <AlertCircle className="h-8 w-8 text-muted-foreground/50" />
                          <p>No activity found. Make sure n8n is connected and executions exist.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {activities.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between pt-4 mt-4 border-t gap-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, activities.length)} of {activities.length} activities
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages || totalPages === 0}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
