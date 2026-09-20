import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronDown,
  Download,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/tracks/terraform")({
  head: () => ({
    meta: [
      { title: "Terraform IaC — DevOps By Nabawy" },
      {
        name: "description",
        content:
          "Learn Terraform with 5 volumes, drills, and command deck on the companion site.",
      },
      { property: "og:title", content: "Terraform IaC — DevOps By Nabawy" },
      {
        property: "og:description",
        content:
          "A practical Terraform curriculum: 5 volumes, exam drills, and hands-on labs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TerraformPage,
});

const SITE = "https://eslamnabawy.github.io/TerraForm-By-Nabawy/";

const volumes = [
  {
    n: "Vol 1",
    title: "Foundations",
    text: "IaC, core loop, state, variables, modules.",
  },
  {
    n: "Vol 2",
    title: "Production",
    text: "Multi-env, multi-VPC, for_each, ALB build.",
  },
  {
    n: "Vol 3",
    title: "Practice Lab",
    text: "39 drills + bosses, warm-ups to final boss.",
  },
  {
    n: "Vol 4",
    title: "Exam Center",
    text: "9 domains + 3 timed 57-question mocks.",
  },
  {
    n: "Vol 5",
    title: "Interview Arsenal",
    text: "30-second answers, war stories, rubrics.",
  },
];

const modules = [
  {
    title: "Foundations & HCL Syntax",
    description:
      "Read configuration, define providers, and compose your first resources.",
    lessons: [
      "Providers & version constraints",
      "Resources & dependencies",
      "Variables & outputs",
    ],
  },
  {
    title: "State Management & Remote Backends",
    description: "Protect state and collaborate safely across environments.",
    lessons: [
      "S3 + DynamoDB locking",
      "State inspection & repair",
      "State migrations",
    ],
  },
  {
    title: "Reusable Modules & Production Patterns",
    description: "Turn working infrastructure into durable building blocks.",
    lessons: [
      "Build a VPC module",
      "Compose EKS modules",
      "Terragrunt introduction",
    ],
  },
];

function TerraformPage() {
  return (
    <div>
      <section className="border-b border-border bg-hero">
        <div className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
          <Link
            to="/tracks"
            className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Tracks /{" "}
            <span className="text-foreground">Terraform IaC</span>
          </Link>
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-sm bg-primary px-2.5 py-1 font-mono text-[10px] font-bold text-primary-foreground">
                  COMPANION SITE LIVE
                </span>
                <span className="rounded-sm border border-border bg-card px-2.5 py-1 text-xs font-semibold">
                  5 Volumes
                </span>
                <span className="rounded-sm border border-border bg-card px-2.5 py-1 text-xs font-semibold">
                  Drills + Command Deck
                </span>
              </div>
              <h1 className="font-display max-w-4xl text-4xl font-extrabold sm:text-5xl">
                Terraform IaC{" "}
                <span className="text-muted-foreground">
                  (Infrastructure as Code)
                </span>
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
                Master declarative cloud infrastructure management with
                HashiCorp Configuration Language.
              </p>
            </div>
            <div className="min-w-56 border border-border bg-card p-4 shadow-card">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <span>
                  <b className="block text-base text-foreground">5</b>
                  <span className="text-muted-foreground">Volumes</span>
                </span>
                <span>
                  <b className="block text-base text-foreground">3</b>
                  <span className="text-muted-foreground">Milestones</span>
                </span>
                <span>
                  <b className="block text-base text-foreground">20h</b>
                  <span className="text-muted-foreground">Est. time</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs font-bold text-primary">
              PRACTICE ONLINE
            </p>
            <h2 className="font-display mt-2 text-3xl font-extrabold">
              Learn on the companion site
            </h2>
          </div>
          <Button asChild>
            <a href={SITE} target="_blank" rel="noreferrer">
              <ExternalLink className="mr-1 h-4 w-4" /> Open full site
            </a>
          </Button>
        </div>
        <div className="overflow-hidden border border-border bg-card shadow-card">
          <iframe
            title="TerraForm by Nabawy companion site"
            src={SITE}
            className="h-[80vh] w-full"
            loading="lazy"
          />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {volumes.map((vol) => (
            <a
              key={vol.n}
              href={SITE}
              target="_blank"
              rel="noreferrer"
              className="group border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
            >
              <p className="font-mono text-xs font-bold text-secondary-accent">
                {vol.n}
              </p>
              <h3 className="font-display mt-2 text-lg font-bold">
                {vol.title}
              </h3>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {vol.text}
              </p>
            </a>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-muted/35">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs font-bold text-primary">
                SYLLABUS & LAB MODULES
              </p>
              <h2 className="font-display mt-2 text-3xl font-extrabold">
                3 Core Milestones
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              18 Hands-on Exercises · about 20 hours
            </p>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {modules.map((module, index) => (
              <article
                key={module.title}
                className="border border-border bg-card p-6 shadow-card"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-primary">
                    MODULE 0{index + 1}
                  </span>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                    3 lessons
                  </span>
                </div>
                <h3 className="font-display mt-4 text-xl font-bold">
                  {module.title}
                </h3>
                <p className="mt-2 min-h-18 text-sm leading-6 text-muted-foreground">
                  {module.description}
                </p>
                <div className="mt-5 space-y-3 border-t border-border pt-5">
                  {module.lessons.map((lesson) => (
                    <p
                      key={lesson}
                      className="flex items-center gap-3 text-sm font-medium"
                    >
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                      />
                      {lesson}
                    </p>
                  ))}
                </div>
                <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-md border border-border py-2.5 text-sm font-semibold hover:bg-accent">
                  View module <ChevronDown className="h-4 w-4" />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-6 border border-border bg-card p-7 shadow-card lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-secondary-accent/10 text-secondary-accent">
              <Sparkles />
            </span>
            <div>
              <p className="font-mono text-xs font-bold text-secondary-accent">
                NTI ALUMNI TIP · NABAWY'S TRACK ADVICE
              </p>
              <p className="font-display mt-2 max-w-3xl text-xl font-bold">
                Break it, read the plan, rebuild it. Terraform becomes intuitive
                when every line has a visible consequence.
              </p>
            </div>
          </div>
          <Button variant="outline">
            <Download />
            Offline notes
          </Button>
        </div>
      </section>
    </div>
  );
}
