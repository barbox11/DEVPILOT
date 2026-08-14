"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader, EmptyState } from "@/components/dashboard/view";
import { FolderIcon } from "@/components/dashboard/icons";
import { Button } from "@/components/button";
import { useProjects } from "@/lib/queries";
import { useCreateProject, useDeleteProject } from "@/lib/mutations";
import { ApiError } from "@/lib/api";

export default function ProjectsPage() {
  const { data, isLoading, isError } = useProjects();
  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const projects = data?.projects ?? [];

  async function handleCreate() {
    setError(null);
    if (!name.trim()) {
      setError("El nombre del proyecto es obligatorio.");
      return;
    }
    try {
      await createProject.mutateAsync({
        name: name.trim(),
        repoUrl: repoUrl.trim() || undefined,
      });
      setName("");
      setRepoUrl("");
      setShowForm(false);
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : "No se pudo crear el proyecto.",
      );
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    setError(null);
    try {
      await deleteProject.mutateAsync(id);
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : "No se pudo eliminar el proyecto.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          eyebrow="PROYECTOS"
          title="Repositorios conectados"
          lead="Cada repositorio mantiene su historial de análisis y puntuaciones."
        />
        <Button
          type="button"
          size="sm"
          onClick={() => setShowForm((value) => !value)}
        >
          {showForm ? "Cancelar" : "Nuevo proyecto"}
        </Button>
      </div>

      {showForm ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void handleCreate();
          }}
          className="mt-8 rounded-md border border-border bg-surface p-6"
        >
          <h2 className="font-mono text-sm font-semibold uppercase tracking-[0.2em]">
            Conectar proyecto
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="project-name"
                className="mb-1.5 block font-mono text-xs font-semibold uppercase tracking-[0.2em] text-text-muted"
              >
                Nombre
              </label>
              <input
                id="project-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="mi-repositorio"
                className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm text-text placeholder:text-text-muted/60 focus:border-accent-pass focus:outline-none focus:ring-2 focus:ring-accent-pass/30"
              />
            </div>
            <div>
              <label
                htmlFor="project-url"
                className="mb-1.5 block font-mono text-xs font-semibold uppercase tracking-[0.2em] text-text-muted"
              >
                URL del repositorio (opcional)
              </label>
              <input
                id="project-url"
                value={repoUrl}
                onChange={(event) => setRepoUrl(event.target.value)}
                placeholder="https://github.com/usuario/repo"
                className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm text-text placeholder:text-text-muted/60 focus:border-accent-pass focus:outline-none focus:ring-2 focus:ring-accent-pass/30"
              />
            </div>
          </div>

          {error ? (
            <div
              role="alert"
              className="mt-4 rounded-md border border-accent-finding bg-accent-finding-soft px-4 py-3 text-sm text-accent-finding-strong"
            >
              {error}
            </div>
          ) : null}

          <div className="mt-5">
            <Button type="submit" size="sm" disabled={createProject.isPending}>
              {createProject.isPending ? "Creando…" : "Crear proyecto"}
            </Button>
          </div>
        </form>
      ) : null}

      <div className="mt-8">
        {isLoading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                aria-hidden="true"
                className="h-16 animate-pulse rounded-md border border-border bg-surface-2"
              />
            ))}
          </div>
        ) : isError ? (
          <div
            role="alert"
            className="rounded-md border border-border bg-surface px-6 py-10 text-center"
          >
            <p className="font-mono text-sm text-accent-finding-strong">
              No se pudieron cargar los proyectos.
            </p>
            <p className="mt-2 text-sm text-text-muted">
              Comprueba que la API esté en marcha y vuelve a intentarlo.
            </p>
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            icon={<FolderIcon />}
            title="Todavía no hay repositorios"
            copy="Conecta un repositorio para empezar el análisis y seguir la salud de tu código."
            ctaHref="/dashboard/projects"
            ctaLabel="Nuevo proyecto"
          />
        ) : (
          <ul className="space-y-3">
            {projects.map((project) => (
              <li
                key={project.id}
                className="flex items-center justify-between gap-4 rounded-md border border-border bg-surface p-4"
              >
                <Link
                  href={`/dashboard/projects/${project.id}`}
                  className="flex min-w-0 items-center gap-3"
                >
                  <FolderIcon className="h-5 w-5 shrink-0 text-text-muted" />
                  <div className="min-w-0">
                    <p className="truncate font-mono text-sm font-medium">
                      {project.name}
                    </p>
                    {project.repoUrl ? (
                      <p className="truncate text-xs text-text-muted">
                        {project.repoUrl}
                      </p>
                    ) : (
                      <p className="text-xs text-text-muted">Sin repositorio</p>
                    )}
                  </div>
                </Link>
                <div className="flex shrink-0 items-center gap-4">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
                    {project._count?.analyses ?? 0} análisis
                  </span>
                  <button
                    type="button"
                    onClick={() => void handleDelete(project.id)}
                    disabled={deletingId === project.id}
                    className="cursor-pointer font-mono text-xs uppercase tracking-[0.2em] text-text-muted transition-colors duration-200 hover:text-accent-finding-strong disabled:opacity-50"
                  >
                    {deletingId === project.id ? "Eliminando…" : "Eliminar"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
