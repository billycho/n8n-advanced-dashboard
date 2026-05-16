"use client";

import { useActivity } from "@/features/activities/hooks";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Activity as ActivityIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  Code,
  Database,
  Calendar,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ActivityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: activity, isLoading, error } = useActivity(id);

  const getStatusIcon = (status?: string) => {
    if (!status) return null;
    switch (status.toLowerCase()) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "failed":
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "running":
        return <Play className="h-5 w-5 text-blue-500 animate-pulse" />;
      case "waiting":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <ActivityIcon className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    switch (status.toLowerCase()) {
      case "success":
        return <Badge variant="default" className="bg-green-500">Success</Badge>;
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Activity Not Found</h2>
        <p className="text-muted-foreground mb-6">The activity record you're looking for doesn't exist or could not be loaded.</p>
        <Button onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4 mr-2" /> Back to Activities
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2 hover:bg-primary/5">
          <ChevronLeft className="h-4 w-4" /> Back to Activities
        </Button>
        <div className="flex gap-2">
          {activity.workflowId && (
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <a href={`${process.env.NEXT_PUBLIC_N8N_URL}/workflow/${activity.workflowId}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" /> View in n8n
              </a>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 shadow-lg border-primary/5 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-xl shadow-inner">
                  <ActivityIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold tracking-tight">Execution Details</CardTitle>
                  <CardDescription className="font-mono text-xs">Execution ID: {activity.id}</CardDescription>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {getStatusBadge(activity.status)}
                <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest px-2 py-0.5 bg-muted rounded">Mode: {activity.mode}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/40 shadow-sm">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-muted-foreground mb-2 tracking-wider">
                  <Calendar className="h-3 w-3 text-primary" /> Started At
                </div>
                <div className="text-base font-semibold">
                  {activity.startedAt ? format(new Date(activity.startedAt), "PPP p") : "N/A"}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/40 shadow-sm">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-muted-foreground mb-2 tracking-wider">
                  <Clock className="h-3 w-3 text-primary" /> Finished At
                </div>
                <div className="text-base font-semibold">
                  {activity.stoppedAt ? format(new Date(activity.stoppedAt), "PPP p") : "Still running..."}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Source Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activity.ai_agent && (
                  <Card
                    className="bg-blue-500/5 border-blue-500/10 shadow-none hover:bg-blue-500/10 transition-colors cursor-pointer"
                    onClick={() => activity.ai_agent?._id && router.push(`/dashboard/ai-agents/${activity.ai_agent._id}`)}
                  >
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <ActivityIcon className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-blue-500/70 uppercase">AI Agent</div>
                        <div className="font-bold text-blue-700 dark:text-blue-300">{activity.ai_agent.name}</div>
                        <div className="text-xs text-muted-foreground">{activity.ai_agent.category}</div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {activity.workflow && (
                  <Card
                    className="bg-purple-500/5 border-purple-500/10 shadow-none hover:bg-purple-500/10 transition-colors cursor-pointer"
                    onClick={() => activity.workflow?._id && router.push(`/dashboard/workflows/${activity.workflow._id}`)}
                  >
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Code className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-purple-500/70 uppercase">Workflow</div>
                        <div className="font-bold text-purple-700 dark:text-purple-300">{activity.workflow.name}</div>
                        <div className="text-xs text-muted-foreground">{activity.workflow.category}</div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {!activity.ai_agent && !activity.workflow && (
                  <div className="col-span-2 p-4 rounded-xl border border-dashed text-sm text-muted-foreground text-center bg-muted/20">
                    No linked agent or workflow found for this execution.
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-primary/5 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Workflow ID</div>
              <div className="font-mono text-[11px] break-all bg-muted/60 p-3 rounded-xl border border-border/40 shadow-inner">{activity.workflowId}</div>
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Execution Status</div>
              <div className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg border border-border/20">
                {getStatusIcon(activity.status)}
                <span className="font-bold text-sm capitalize">{activity.status}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Finished</div>
              <Badge variant={activity.finished ? "default" : "outline"} className={activity.finished ? "bg-green-500/20 text-green-700 border-green-500/30" : ""}>
                {activity.finished ? "Completed Successfully" : "In Progress / Interrupted"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="data" className="w-full">
        <TabsList className="bg-muted/50 p-1 rounded-xl inline-flex shadow-sm border border-border/40">
          <TabsTrigger value="data" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm gap-2 text-xs font-bold uppercase tracking-wider px-6">
            <Database className="h-3.5 w-3.5" /> Raw Data
          </TabsTrigger>
          <TabsTrigger value="json" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm gap-2 text-xs font-bold uppercase tracking-wider px-6">
            <Code className="h-3.5 w-3.5" /> Full Activity JSON
          </TabsTrigger>
        </TabsList>
        <TabsContent value="data" className="mt-4 animate-in fade-in duration-300">
          <Card className="border-primary/5 shadow-xl bg-[#0f1117] overflow-hidden">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-sm font-bold text-white/70 uppercase tracking-widest flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" /> Data Output
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <pre className="p-6 text-[#e3e6ed] whitespace-pre-wrap break-words overflow-y-auto text-xs font-mono leading-relaxed max-h-[600px] scrollbar-thin scrollbar-thumb-white/10">
                {JSON.stringify(activity.data, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="json" className="mt-4 animate-in fade-in duration-300">
          <Card className="border-primary/5 shadow-xl bg-[#0f1117] overflow-hidden">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-sm font-bold text-white/70 uppercase tracking-widest flex items-center gap-2">
                <Code className="h-4 w-4 text-primary" /> Complete n8n JSON
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <pre className="p-6 text-[#e3e6ed] whitespace-pre-wrap break-words overflow-y-auto text-xs font-mono leading-relaxed max-h-[600px] scrollbar-thin scrollbar-thumb-white/10">
                {JSON.stringify(activity.activity_json, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
