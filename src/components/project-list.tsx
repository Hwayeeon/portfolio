"use client";

import { useState, useMemo } from "react";
import { ProjectCard, ProjectCardSkeleton } from "./project-card";
import { cn } from "@/lib/utils";
import { Filter } from "lucide-react";
import type { Project } from "@/types/project";

interface ProjectListProps {
  projects: Project[];
  showFilter?: boolean;
  initialCategory?: string;
}

export function ProjectList({
  projects,
  showFilter = true,
  initialCategory = "all",
}: ProjectListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);

  // Get all unique categories and statuses
  const categories = useMemo(() => {
    const cats = new Set<string>();
    projects.forEach((project: Project) => cats.add(project.metadata.category));
    return Array.from(cats).sort();
  }, [projects]);

  const statuses = useMemo(() => {
    const stats = new Set<string>();
    projects.forEach((project: Project) => stats.add(project.metadata.status));
    return Array.from(stats).sort();
  }, [projects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project: Project) => {
      const matchesCategory =
        selectedCategory === "all" || project.metadata.category === selectedCategory;
      const matchesStatus = selectedStatus === "all" || project.metadata.status === selectedStatus;
      return matchesCategory && matchesStatus;
    });
  }, [projects, selectedCategory, selectedStatus]);

  // Sort projects by featured first, then by date
  const sortedProjects = useMemo(() => {
    return [...filteredProjects].sort((a, b) => {
      // Featured projects first
      if (a.metadata.featured && !b.metadata.featured) return -1;
      if (!a.metadata.featured && b.metadata.featured) return 1;

      // Then by date (newest first)
      const dateA = new Date(a.metadata.publishedAt);
      const dateB = new Date(b.metadata.publishedAt);
      return dateB.getTime() - dateA.getTime();
    });
  }, [filteredProjects]);

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setIsLoading(true);
    setSelectedCategory(category);
    setTimeout(() => setIsLoading(false), 150);
  };

  // Handle status change
  const handleStatusChange = (status: string) => {
    setIsLoading(true);
    setSelectedStatus(status);
    setTimeout(() => setIsLoading(false), 150);
  };

  if (projects.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="space-y-4">
          <div className="text-6xl">🚧</div>
          <h2 className="text-2xl font-semibold">Projects Coming Soon</h2>
          <p className="text-muted-foreground mx-auto max-w-md">
            I&apos;m currently working on showcasing my projects. Check back soon to see what
            I&apos;ve been building!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      {showFilter && (categories.length > 0 || statuses.length > 0) && (
        <div className="flex flex-col gap-4">
          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Filter className="h-4 w-4" />
                <span>Category:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategoryChange("all")}
                  className={cn(
                    "rounded-full px-3 py-1 text-sm font-medium transition-colors",
                    selectedCategory === "all"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  All ({projects.length})
                </button>
                {categories.map((category) => {
                  const count = projects.filter(
                    (p: Project) => p.metadata.category === category
                  ).length;
                  const categoryLabels = {
                    web: "Web Apps",
                    mobile: "Mobile",
                    cli: "CLI Tools",
                    library: "Libraries",
                    experiment: "Experiments",
                  };

                  return (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={cn(
                        "rounded-full px-3 py-1 text-sm font-medium transition-colors",
                        selectedCategory === category
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {categoryLabels[category as keyof typeof categoryLabels] || category} ({count}
                      )
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Status Filter */}
          {statuses.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <span>Status:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleStatusChange("all")}
                  className={cn(
                    "rounded-full px-3 py-1 text-sm font-medium transition-colors",
                    selectedStatus === "all"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  All
                </button>
                {statuses.map((status) => {
                  const count = projects.filter(
                    (p: Project) => p.metadata.status === status
                  ).length;
                  const statusLabels = {
                    completed: "Completed",
                    "in-progress": "In Progress",
                    maintained: "Maintained",
                    archived: "Archived",
                  };

                  return (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className={cn(
                        "rounded-full px-3 py-1 text-sm font-medium transition-colors",
                        selectedStatus === status
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {statusLabels[status as keyof typeof statusLabels] || status} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="text-muted-foreground text-sm">
        {selectedCategory === "all" && selectedStatus === "all"
          ? `Showing all ${sortedProjects.length} projects`
          : `Showing ${sortedProjects.length} projects`}
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : sortedProjects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedProjects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              priority={index < 3} // Prioritize first 3 images for LCP
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No projects found matching the selected filters.</p>
          <button
            onClick={() => {
              handleCategoryChange("all");
              handleStatusChange("all");
            }}
            className="text-primary mt-2 text-sm hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
