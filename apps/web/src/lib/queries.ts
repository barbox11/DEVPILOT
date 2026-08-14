"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

export type Project = {
  id: string;
  name: string;
  repoUrl: string | null;
  defaultBranch: string;
  createdAt: string;
  updatedAt: string;
  _count?: { analyses: number };
};

export type Analysis = {
  id: string;
  projectId: string;
  status: string;
  branch: string | null;
  commitSha: string | null;
  startedAt: string | null;
  completedAt: string | null;
  healthScore: number | null;
  qualityScore: number | null;
  securityScore: number | null;
  testingScore: number | null;
  architectureScore: number | null;
  createdAt: string;
  project?: { id: string; name: string };
  _count?: { issues: number; recommendations: number };
};

export type Issue = {
  id: string;
  analysisId: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  category: string;
  file: string;
  lineStart: number | null;
  lineEnd: number | null;
  title: string;
  description: string;
  recommendation: string;
  status: string;
  createdAt: string;
  analysis?: { id: string; project: { id: string; name: string } };
};

export type Activity = {
  id: string;
  action: string;
  createdAt: string;
  metadata: Record<string, unknown> | null;
};

export type Recommendation = {
  id: string;
  analysisId: string;
  issueId: string | null;
  title: string;
  body: string;
  createdAt: string;
  analysis?: { id: string; project: { id: string; name: string } };
};

export type Overview = {
  metrics: {
    projects: number;
    completedAnalyses: number;
    openIssues: number;
    recommendations: number;
    avgHealth: number | null;
  };
  recentProjects: Array<{
    id: string;
    name: string;
    repoUrl: string | null;
    createdAt: string;
    _count: { analyses: number };
  }>;
  recentActivity: Activity[];
};

export const queryKeys = {
  overview: ["overview"] as const,
  projects: ["projects"] as const,
  project: (id: string) => ["projects", id] as const,
  analyses: ["analyses"] as const,
  analysesForProject: (projectId: string) => ["analyses", projectId] as const,
  issues: ["issues"] as const,
  recommendations: ["recommendations"] as const,
  activity: ["activity"] as const,
};

export function useOverview() {
  return useQuery({
    queryKey: queryKeys.overview,
    queryFn: () => apiClient.get<Overview>("/overview"),
  });
}

export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects,
    queryFn: () => apiClient.get<{ projects: Project[] }>("/projects"),
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: queryKeys.project(id),
    queryFn: () =>
      apiClient.get<{ project: Project & { analyses: Analysis[] } }>(
        `/projects/${id}`,
      ),
    enabled: Boolean(id),
  });
}

export function useAnalyses() {
  return useQuery({
    queryKey: queryKeys.analyses,
    queryFn: () => apiClient.get<{ analyses: Analysis[] }>("/analyses"),
  });
}

export function useIssues() {
  return useQuery({
    queryKey: queryKeys.issues,
    queryFn: () => apiClient.get<{ issues: Issue[] }>("/issues"),
  });
}

export function useActivity() {
  return useQuery({
    queryKey: queryKeys.activity,
    queryFn: () => apiClient.get<{ activity: Activity[] }>("/activity"),
  });
}

export function useRecommendations() {
  return useQuery({
    queryKey: queryKeys.recommendations,
    queryFn: () =>
      apiClient.get<{ recommendations: Recommendation[] }>("/recommendations"),
  });
}
