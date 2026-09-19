import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Check, ChevronDown, Cloud, Code2, Download, ExternalLink, Network, Play, RotateCcw, Sparkles, TerminalSquare } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/tracks/terraform")({
  head: () => ({ meta: [
    { title: "Terraform IaC Workspace — DevOps By Nabawy" },
    { name: "description", content: "Learn Terraform with an interactive terminal, HCL editor, architecture view, and hands-on labs." },
    { property: "og:title", content: "Terraform IaC Workspace — DevOps By Nabawy" },
    { property: "og:description", content: "A practical Terraform curriculum with a browser sandbox and 18 exercises." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ]}), component: TerraformPage,
});

const hcl = `terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "learning" {
  bucket = "nabawy-terraform-lab"

  tags = {
    Environment = "learning"
    ManagedBy   = "terraform"
  }
}`;

const outputs: Record<string, string[]> = {
  "terraform init": ["Initializing the backend...", "Initializing provider plugins...", "- Installing hashicorp/aws v5.92.0...", "Terraform has been successfully initialized!"],
  "terraform plan": ["Terraform will perform the following actions:", "  + resource aws_s3_bucket.learning will be created", "Plan: 1 to add, 0 to change, 0 to destroy."],
  "terraform apply": ["aws_s3_bucket.learning: Creating...", "aws_s3_bucket.learning: Creation complete after 2s", "Apply complete! Resources: 1 added, 0 changed, 0 destroyed."],
  "terraform destroy": ["aws_s3_bucket.learning: Destroying...", "Destroy complete! Resources: 1 destroyed."],
  help: ["Available commands:", "terraform init · terraform plan · terraform apply · terraform destroy", "Tip: run init before planning your infrastructure."],
};

const modules = [
  { title: "Foundations & HCL Syntax", description: "Read configuration, define providers, and compose your first resources.", lessons: ["Providers & version constraints", "Resources & dependencies", "Variables & outputs"] },
  { title: "State Management & Remote Backends", description: "Protect state and collaborate safely across environments.", lessons: ["S3 + DynamoDB locking", "State inspection & repair", "State migrations"] },
  { title: "Reusable Modules & Production Patterns", description: "Turn working infrastructure into durable building blocks.", lessons: ["Build a VPC module", "Compose EKS modules", "Terragrunt introduction"] },
];

function TerraformPage() {
  const [tab, setTab] = useState<"terminal" | "code" | "graph">("terminal");
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<{ command: string; output: string[] }[]>([{ command: "terraform init", output: outputs["terraform init"] ?? [] }]);
  const [done, setDone] = useState<string[]>([]);
  const progress = Math.round((done.length / 9) * 100);
  const run = (value = command) => {
    const clean = value.trim().toLowerCase(); if (!clean) return;
    setHistory((items) => [...items, { command: clean, output: outputs[clean] ?? [`command not found: ${clean}`, "Type 'help' to see available commands."] }]); setCommand("");
  };
  const toggle = (lesson: string) => setDone((items) => items.includes(lesson) ? items.filter((item) => item !== lesson) : [...items, lesson]);
  return <div>
    <section className="border-b border-border bg-hero"><div className="mx-auto max-w-7xl px-6 py-10 sm:py-14"><Link to="/tracks" className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" />Tracks / <span className="text-foreground">Terraform IaC</span></Link><div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end"><div><div className="mb-4 flex flex-wrap gap-2"><span className="rounded-sm bg-primary px-2.5 py-1 font-mono text-[10px] font-bold text-primary-foreground">SANDBOX READY · v1.8.x HCL</span><span className="rounded-sm border border-border bg-card px-2.5 py-1 text-xs font-semibold">Interactive Website Track</span><span className="rounded-sm border border-border bg-card px-2.5 py-1 text-xs font-semibold">Browser Sandbox</span></div><h1 className="font-display max-w-4xl text-4xl font-extrabold sm:text-5xl">Terraform IaC <span className="text-muted-foreground">(Infrastructure as Code)</span></h1><p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">Master declarative cloud infrastructure management with HashiCorp Configuration Language.</p></div><div className="min-w-56 border border-border bg-card p-4 shadow-card"><div className="flex items-center justify-between text-xs"><b>Track progress</b><span className="font-mono text-primary">{progress}%</span></div><Progress value={progress} className="mt-3" /><p className="mt-2 text-xs text-muted-foreground">{done.length} of 9 core exercises</p></div></div></div></section>
    <section className="mx-auto max-w-7xl px-6 py-12"><div className="mb-6"><p className="font-mono text-xs font-bold text-primary">COURSE WORKSPACE</p><h2 className="font-display mt-2 text-3xl font-extrabold">Test the workflow as you learn</h2></div>
      <div className="overflow-hidden border border-terminal-border bg-terminal shadow-terminal"><div className="flex flex-wrap items-center justify-between border-b border-terminal-border bg-terminal-bar px-3 pt-2"><div className="flex">{([['terminal',TerminalSquare,'Terminal'],['code',Code2,'main.tf'],['graph',Network,'Architecture']] as const).map(([key, Icon, label]) => <button onClick={() => setTab(key)} key={key} className={`flex h-11 items-center gap-2 border-b-2 px-4 font-mono text-xs ${tab === key ? 'border-terminal-active text-terminal-foreground' : 'border-transparent text-terminal-muted hover:text-terminal-foreground'}`}><Icon className="h-4 w-4" />{label}</button>)}</div><div className="flex items-center gap-2 pb-2 text-[10px] font-bold text-terminal-success"><span className="h-2 w-2 rounded-full bg-terminal-success" />SANDBOX ONLINE</div></div>
        <div className="h-112 overflow-auto p-5 font-mono text-sm text-terminal-foreground sm:p-7">{tab === "terminal" && <div className="flex h-full flex-col"><div className="flex-1 space-y-5">{history.map((item, i) => <div key={`${item.command}-${i}`}><p><span className="text-terminal-success">learner@nabawy</span>:<span className="text-terminal-link">~/terraform-lab</span>$ {item.command}</p>{item.output.map((line) => <p key={line} className={line.includes("successfully") || line.includes("complete") ? "mt-1 text-terminal-success" : line.startsWith("Plan:") ? "mt-1 text-terminal-warning" : "mt-1 text-terminal-muted"}>{line}</p>)}</div>)}</div><form onSubmit={(e) => { e.preventDefault(); run(); }} className="mt-5 flex items-center border-t border-terminal-border pt-4"><span className="text-terminal-success">$</span><input autoComplete="off" value={command} onChange={(e) => setCommand(e.target.value)} className="min-w-0 flex-1 bg-transparent px-3 outline-none" placeholder="type a Terraform command…" /><button aria-label="Run command" className="rounded bg-terminal-button p-2 text-terminal-foreground"><Play className="h-4 w-4" /></button></form></div>}{tab === "code" && <pre className="leading-7"><code>{hcl}</code></pre>}{tab === "graph" && <Architecture />}</div>
        <div className="flex flex-wrap items-center gap-2 border-t border-terminal-border bg-terminal-bar p-3"><span className="mr-1 text-xs text-terminal-muted">Quick run:</span>{["terraform init","terraform plan","terraform apply","terraform destroy","help"].map((item) => <button key={item} onClick={() => run(item)} className="rounded border border-terminal-border px-3 py-1.5 font-mono text-[11px] text-terminal-muted transition-colors hover:border-terminal-active hover:text-terminal-foreground">{item}</button>)}<button onClick={() => setHistory([])} className="ml-auto p-2 text-terminal-muted hover:text-terminal-foreground" aria-label="Clear terminal"><RotateCcw className="h-4 w-4" /></button></div>
      </div>
    </section>
    <section className="border-y border-border bg-muted/35"><div className="mx-auto max-w-7xl px-6 py-14"><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="font-mono text-xs font-bold text-primary">SYLLABUS & LAB MODULES</p><h2 className="font-display mt-2 text-3xl font-extrabold">3 Core Milestones</h2></div><p className="text-sm text-muted-foreground">18 Hands-on Exercises · about 20 hours</p></div><div className="mt-8 grid gap-5 lg:grid-cols-3">{modules.map((module, index) => <article key={module.title} className="border border-border bg-card p-6 shadow-card"><div className="flex items-center justify-between"><span className="font-mono text-xs font-bold text-primary">MODULE 0{index + 1}</span><span className="grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">{done.filter((item) => module.lessons.includes(item)).length}/3</span></div><h3 className="font-display mt-4 text-xl font-bold">{module.title}</h3><p className="mt-2 min-h-18 text-sm leading-6 text-muted-foreground">{module.description}</p><div className="mt-5 space-y-3 border-t border-border pt-5">{module.lessons.map((lesson) => <label key={lesson} className="flex cursor-pointer items-center gap-3 text-sm"><Checkbox checked={done.includes(lesson)} onCheckedChange={() => toggle(lesson)} /><span className={done.includes(lesson) ? "text-muted-foreground line-through" : "font-medium"}>{lesson}</span></label>)}</div><button className="mt-6 flex w-full items-center justify-center gap-2 rounded-md border border-border py-2.5 text-sm font-semibold hover:bg-accent">View module <ChevronDown className="h-4 w-4" /></button></article>)}</div></div></section>
    <section className="mx-auto max-w-7xl px-6 py-14"><div className="grid gap-6 border border-border bg-card p-7 shadow-card lg:grid-cols-[1fr_auto] lg:items-center"><div className="flex gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-secondary-accent/10 text-secondary-accent"><Sparkles /></span><div><p className="font-mono text-xs font-bold text-secondary-accent">NTI ALUMNI TIP · NABAWY'S TRACK ADVICE</p><p className="font-display mt-2 max-w-3xl text-xl font-bold">Break it, read the plan, rebuild it. Terraform becomes intuitive when every line has a visible consequence.</p></div></div><Button variant="outline"><Download />Offline notes</Button></div></section>
  </div>;
}

function Architecture() { return <div className="flex h-full min-w-150 items-center justify-center"><div className="grid grid-cols-[auto_100px_auto_100px_auto] items-center"><Node icon={<Code2 />} label="main.tf" /><Line /><Node icon={<Cloud />} label="AWS Provider" /><Line /><Node icon={<BookOpen />} label="S3 Bucket" /></div></div>; }
function Node({ icon, label }: { icon: React.ReactNode; label: string }) { return <div className="grid h-28 w-32 place-items-center rounded-md border border-terminal-active bg-terminal-bar text-center shadow-terminal"><span className="text-terminal-link">{icon}</span><span className="text-xs">{label}</span><span className="flex items-center gap-1 text-[10px] text-terminal-success"><Check className="h-3 w-3" />ready</span></div>; }
function Line() { return <div className="h-px bg-terminal-active" />; }