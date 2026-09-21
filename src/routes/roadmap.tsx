import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, ExternalLink, Map } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "DevOps Roadmap — DevOps By Nabawy" },
      {
        name: "description",
        content:
          "Step-by-step DevOps roadmap: foundations, automation, orchestration, production.",
      },
      { property: "og:title", content: "DevOps Roadmap — DevOps By Nabawy" },
      {
        property: "og:description",
        content: "Follow the nodes in order, every visit looks the same.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RoadmapPage,
});

type RoadNode = {
  id: string;
  title: string;
  text: string;
  to?: "/tracks/linux" | "/tracks/terraform" | "/tracks/cicd" | "/tracks/$slug";
  params?: Record<string, string>;
  href?: string;
  tag: string;
};

type RoadSection = {
  id: string;
  title: string;
  text: string;
  nodes: RoadNode[];
};

const SECTIONS: RoadSection[] = [
  {
    id: "foundations",
    title: "Foundations",
    text: "Command line first. Everything else builds on this.",
    nodes: [
      {
        id: "linux",
        title: "Learn Linux",
        text: "Processes, filesystems, permissions, networking — on the companion site.",
        to: "/tracks/linux",
        tag: "COMPANION SITE",
      },
      {
        id: "docker",
        title: "Containers with Docker",
        text: "Images, volumes, networks. 2 cheat sheets hosted here.",
        to: "/tracks/$slug",
        params: { slug: "docker" },
        tag: "ON THIS SITE",
      },
      {
        id: "devops",
        title: "DevOps Mindset",
        text: "Culture, delivery flow, feedback loops. Track coming soon.",
        to: "/tracks/$slug",
        params: { slug: "devops" },
        tag: "COMING SOON",
      },
    ],
  },
  {
    id: "automation",
    title: "Automation",
    text: "Stop doing things by hand. Codify everything.",
    nodes: [
      {
        id: "ansible",
        title: "Ansible Automation",
        text: "Playbooks, roles, inventory. 4 docs (EN + AR) hosted here.",
        to: "/tracks/$slug",
        params: { slug: "ansible" },
        tag: "ON THIS SITE",
      },
      {
        id: "terraform",
        title: "Terraform IaC",
        text: "5 volumes + drills on the companion site, sandbox here.",
        to: "/tracks/terraform",
        tag: "SITE + COMPANION",
      },
      {
        id: "cicd",
        title: "CI/CD Pipelines",
        text: "8 handbooks: Jenkins, pipelines, delivery, labs. Hosted here.",
        to: "/tracks/cicd",
        tag: "ON THIS SITE",
      },
    ],
  },
  {
    id: "orchestration",
    title: "Orchestration",
    text: "Run containers at scale, the production way.",
    nodes: [
      {
        id: "kubernetes",
        title: "Kubernetes",
        text: "9 books: workloads, networking, storage, GitOps, production.",
        to: "/tracks/$slug",
        params: { slug: "kubernetes" },
        tag: "ON THIS SITE",
      },
    ],
  },
  {
    id: "production",
    title: "Production & Scale",
    text: "Cloud architecture and intelligent operations. Tracks coming soon.",
    nodes: [
      {
        id: "aws",
        title: "AWS Cloud",
        text: "Secure, resilient cloud systems. Track coming soon.",
        to: "/tracks/$slug",
        params: { slug: "aws" },
        tag: "COMING SOON",
      },
      {
        id: "aiops",
        title: "AIOps & Telemetry",
        text: "Metrics, logs, traces. Track coming soon.",
        to: "/tracks/$slug",
        params: { slug: "aiops" },
        tag: "COMING SOON",
      },
    ],
  },
];

function RoadmapPage() {
  const [open, setOpen] = useState<string | null>("linux");

  return (
    <div>
      <section className="border-b border-border bg-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-4 py-6 sm:px-6 sm:py-8 sm:py-10">
          <p className="mb-3 flex items-center gap-2 font-mono text-xs font-bold text-primary">
            <Map className="h-4 w-4" /> STEP BY STEP
          </p>
          <h1 className="font-display max-w-3xl text-2xl font-extrabold sm:text-3xl">
            DevOps Roadmap
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
            Follow the nodes in order. Click a node for resources and the next
            step.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        {SECTIONS.map((section, si) => (
          <section key={section.id} className="relative pb-12 last:pb-0">
            {si < SECTIONS.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-[27px] top-16 w-0.5 bg-border"
              />
            )}
            <div className="mb-5">
              <p className="font-mono text-xs font-bold text-secondary-accent">
                STEP GROUP 0{si + 1}
              </p>
              <h2 className="font-display mt-1 text-2xl font-extrabold">
                {section.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {section.text}
              </p>
            </div>
            <ol className="space-y-3">
              {section.nodes.map((node, ni) => {
                const expanded = open === node.id;
                return (
                  <li
                    key={node.id}
                    className="overflow-hidden rounded-2xl border border-border bg-card shadow-card"
                  >
                    <button
                      onClick={() =>
                        setOpen((o) => (o === node.id ? null : node.id))
                      }
                      className="flex w-full items-center gap-3 p-3 text-left"
                      aria-expanded={expanded}
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-primary font-mono text-xs font-bold text-primary">
                        {si + 1}.{ni + 1}
                      </span>
                      <span className="font-display min-w-0 flex-1 truncate text-base font-bold">
                        {node.title}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                          expanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {expanded && (
                      <div className="border-t border-border bg-muted/30 p-4">
                        <p className="text-sm leading-6 text-muted-foreground">
                          {node.text}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className="rounded-sm bg-primary/10 px-2 py-1 font-mono text-[10px] font-bold text-primary">
                            {node.tag}
                          </span>
                          {node.to ? (
                            <Button size="sm" asChild>
                              <Link to={node.to} params={node.params ?? {}}>
                                Open track{" "}
                                <ArrowRight className="ml-1 h-3.5 w-3.5" />
                              </Link>
                            </Button>
                          ) : node.href ? (
                            <Button size="sm" asChild>
                              <a
                                href={node.href}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Open site{" "}
                                <ExternalLink className="ml-1 h-3.5 w-3.5" />
                              </a>
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
