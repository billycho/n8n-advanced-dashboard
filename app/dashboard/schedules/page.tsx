"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useWorkflows } from "@/features/workflows/hooks";
import { useAIAgents } from "@/features/ai-agents/hooks";
import { useQueries } from "@tanstack/react-query";
import { getN8NWorkflow } from "@/features/n8n/workflows/api";
import { extractWorkflowData } from "@/features/n8n/workflows/hooks";
import cronstrue from "cronstrue";

const N8N_URL = process.env.NEXT_PUBLIC_N8N_URL || '';

import {
  Calendar,
  Clock,
  ExternalLink,
  Cpu,
  Zap,
  AlertCircle,
  Play,
  Pause,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

export default function SchedulesPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // 1. Fetch all items from our DB
  const { data: workflows = [], isLoading: isLoadingWorkflows } = useWorkflows();
  const { data: agents = [], isLoading: isLoadingAgents } = useAIAgents();

  // 2. Combine and filter items that have a workflow_id
  const combinedItems = useMemo(() => {
    const workflowItems = workflows
      .filter((w) => !!w.workflow_id)
      .map((w) => ({
        id: w._id,
        name: w.name,
        source: "Workflow",
        workflow_id: w.workflow_id,
        internal_url: `/dashboard/workflows/${w._id}`,
      }));

    const agentItems = agents
      .filter((a) => !!a.workflow_id)
      .map((a) => ({
        id: a._id,
        name: a.name,
        source: "AI Agent",
        workflow_id: a.workflow_id,
        internal_url: `/dashboard/ai-agents/${a._id}`,
      }));

    return [...workflowItems, ...agentItems];
  }, [workflows, agents]);

  // 3. Fetch n8n data for each item using useQueries
  const n8nQueries = useQueries({
    queries: combinedItems.map((item) => ({
      queryKey: ["n8n-workflow", item.workflow_id],
      queryFn: () => getN8NWorkflow(item.workflow_id!),
      enabled: !!item.workflow_id,
      staleTime: 1000 * 60 * 5, // 5 minutes
    })),
  });

  const isLoadingN8N = n8nQueries.some((query) => query.isLoading);

  // 4. Merge and Filter data
  const data = useMemo(() => {
    // Only process if all queries have attempted to load (some might be error, some success)
    if (isLoadingN8N || isLoadingWorkflows || isLoadingAgents) return [];

    return combinedItems
      .map((item, index) => {
        const n8nQuery = n8nQueries[index];
        if (!n8nQuery || !n8nQuery.isSuccess || !n8nQuery.data) return null;

        const n8nData = extractWorkflowData(n8nQuery.data);

        // Filter: only display data that has schedule
        if (!n8nData.cronExpression) return null;

        return {
          ...item,
          active: n8nData.active,
          cronExpression: n8nData.cronExpression,
          isLoading: false,
          isError: false,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [combinedItems, n8nQueries, isLoadingN8N, isLoadingWorkflows, isLoadingAgents]);

  // 5. Pagination logic
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const paginatedData = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const formatSchedule = (cron: string) => {
    if (!cron) return "No schedule";
    try {
      return cronstrue.toString(cron);
    } catch (e) {
      return cron;
    }
  };

  const handleRowClick = (url: string) => {
    router.push(url);
  };

  const isLoading = isLoadingWorkflows || isLoadingAgents || isLoadingN8N;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workflow Schedules</h1>
          <p className="text-muted-foreground">Monitor and manage automated schedules across all n8n workflows</p>
        </div>
      </div>

      <Card className="shadow-md border-primary/10">
        <CardHeader>
          <CardTitle>Schedules Overview</CardTitle>
          <CardDescription>Live status and timing for your integrated automation workflows</CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30%]">Name</TableHead>
                    <TableHead className="w-[15%]">Type</TableHead>
                    <TableHead className="w-[15%]">Status</TableHead>
                    <TableHead className="w-[30%]">Schedule</TableHead>
                    <TableHead className="w-[10%] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {paginatedData.map((item) => (
                    <TableRow
                      key={`${item.source}-${item.id}`}
                      onClick={() => handleRowClick(item.internal_url)}
                      className="group cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span className="font-semibold">{item.name}</span>
                          <span className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">
                            {item.workflow_id}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          {item.source === "AI Agent" ? (
                            <Cpu className="h-3 w-3 text-blue-500" />
                          ) : (
                            <Zap className="h-3 w-3 text-orange-500" />
                          )}
                          <span className="text-sm">{item.source}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={item.active ? "default" : "secondary"}
                          className={item.active ? "bg-green-500 hover:bg-green-600" : "bg-muted text-muted-foreground"}
                        >
                          <div className="flex items-center gap-1.5">
                            {item.active ? <Play className="h-3 w-3 fill-current" /> : <Pause className="h-3 w-3" />}
                            {item.active ? "Enabled" : "Disabled"}
                          </div>
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span className="line-clamp-1">
                            {formatSchedule(item.cronExpression)}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRowClick(item.internal_url);
                            }}
                          >
                            <Eye className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Open in n8n"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            asChild
                          >
                            <a
                              href={`${N8N_URL}/workflow/${item.workflow_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                  {data.length === 0 && !isLoading && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-muted-foreground py-12"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Calendar className="h-8 w-8 text-muted-foreground/50" />
                          <p>No workflows with schedules found.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {data.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between pt-4 mt-4 border-t gap-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, data.length)} of {data.length} items
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
