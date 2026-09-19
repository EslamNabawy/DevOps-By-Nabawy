import {
  Box,
  Boxes,
  Cloud,
  Container,
  GitBranch,
  Server,
  Terminal,
  Waypoints,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { books } from "./library";

export type Track = {
  slug: string;
  title: string;
  description: string;
  chapters: number;
  hours: string;
  level: string;
  milestones: number;
  kind: "guide" | "lab";
  icon: LucideIcon;
  status: string;
};

export const tracks: Track[] = [
  {
    slug: "devops",
    title: "DevOps Engineering",
    description: "Culture, delivery flow, observability, and reliable systems.",
    chapters: 14,
    hours: "18h",
    level: "Foundation",
    milestones: 5,
    kind: "guide",
    icon: GitBranch,
    status: "COMING SOON",
  },
  {
    slug: "kubernetes",
    title: "Kubernetes Orchestration",
    description:
      "Deploy, scale, and operate production workloads with confidence. 9 books, hosted here.",
    chapters: 259,
    hours: "24h",
    level: "Intermediate",
    milestones: 9,
    kind: "guide",
    icon: Waypoints,
    status: "9 BOOKS · PDF + ONLINE",
  },
  {
    slug: "docker",
    title: "Docker & Containers",
    description:
      "Build lean images and compose dependable development stacks. 2 cheat sheets, hosted here.",
    chapters: 2,
    hours: "4h",
    level: "Foundation",
    milestones: 2,
    kind: "guide",
    icon: Container,
    status: "2 CHEAT SHEETS · PDF",
  },
  {
    slug: "aws",
    title: "AWS Cloud Architecture",
    description: "Design secure, resilient systems with core AWS services.",
    chapters: 18,
    hours: "28h",
    level: "Advanced",
    milestones: 7,
    kind: "guide",
    icon: Cloud,
    status: "COMING SOON",
  },
  {
    slug: "ansible",
    title: "Ansible Automation",
    description:
      "Turn repetitive operations into clear, reusable playbooks. 4 docs (EN + AR), hosted here.",
    chapters: 106,
    hours: "12h",
    level: "Intermediate",
    milestones: 4,
    kind: "guide",
    icon: Wrench,
    status: "4 DOCS · PDF + ONLINE",
  },
  {
    slug: "aiops",
    title: "AIOps & Telemetry",
    description: "Connect metrics, logs, traces, and intelligent operations.",
    chapters: 12,
    hours: "16h",
    level: "Advanced",
    milestones: 5,
    kind: "guide",
    icon: Boxes,
    status: "COMING SOON",
  },
  {
    slug: "terraform",
    title: "Terraform IaC",
    description:
      "Provision repeatable cloud infrastructure with HCL. 5 volumes on the companion site + sandbox here.",
    chapters: 5,
    hours: "20h",
    level: "Intermediate",
    milestones: 5,
    kind: "lab",
    icon: Box,
    status: "SANDBOX + 5 VOLUMES",
  },
  {
    slug: "cicd",
    title: "CI/CD Automation",
    description:
      "Build pipelines that test, secure, and ship continuously. 8 handbooks on the companion site.",
    chapters: 8,
    hours: "15h",
    level: "Intermediate",
    milestones: 8,
    kind: "lab",
    icon: GitBranch,
    status: "8 HANDBOOKS · LIVE SITE",
  },
  {
    slug: "linux",
    title: "Linux Primitives",
    description:
      "Master processes, filesystems, permissions, and networking on the companion site.",
    chapters: 0,
    hours: "16h",
    level: "Foundation",
    milestones: 0,
    kind: "lab",
    icon: Terminal,
    status: "LIVE SITE",
  },
];

export const searchItems = [
  ...tracks.map((track) => ({
    title: track.title,
    subtitle: `${track.status} · ${track.chapters} chapters`,
    href:
      track.slug === "terraform"
        ? "/tracks/terraform"
        : `/tracks/${track.slug}`,
  })),
  {
    title: "terraform init",
    subtitle: "Command · Initialize a working directory",
    href: "/tracks/terraform",
  },
  {
    title: "terraform plan",
    subtitle: "Command · Preview infrastructure changes",
    href: "/tracks/terraform",
  },
  {
    title: "Kubernetes ingress",
    subtitle: "Module · Kubernetes Orchestration",
    href: "/tracks/kubernetes",
  },
  {
    title: "Docker volumes",
    subtitle: "Module · Docker & Containers",
    href: "/tracks/docker",
  },
  {
    title: "Ansible roles",
    subtitle: "Module · Ansible Automation",
    href: "/tracks/ansible",
  },
  {
    title: "S3 remote backend",
    subtitle: "Lab · Terraform IaC",
    href: "/tracks/terraform",
  },
  ...books.map((book) => ({
    title: book.title,
    subtitle: `Book · ${book.chapters.length} sections · ${book.pdfMB} MB PDF`,
    href: `/books/${book.id}`,
  })),
  ...books.flatMap((book) =>
    book.chapters.slice(0, 12).map((chapter) => ({
      title: chapter,
      subtitle: `Section · ${book.title}`,
      href: `/books/${book.id}`,
    })),
  ),
];
