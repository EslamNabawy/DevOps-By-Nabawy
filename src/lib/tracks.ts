import {
  Box,
  Container,
  GitBranch,
  Terminal,
  Waypoints,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { books } from "./library";

export type TrackFormat = "pdf" | "website";
export type TrackSource = "hosted" | "website";

export type Track = {
  slug: string;
  title: string;
  description: string;
  intro: string | null;
  format: TrackFormat;
  source: TrackSource;
  pages: number | null;
  chapters: number;
  hours: string;
  level: string;
  milestones: number;
  kind: "guide" | "lab";
  icon: LucideIcon;
};

const trackPages = (slug: string) => {
  const pages = books
    .filter((book) => book.track === slug)
    .reduce((total, book) => total + book.pages, 0);
  return pages || null;
};

export const tracks: Track[] = [
  {
    slug: "cicd",
    source: "hosted",
    title: "CI/CD Automation",
    description:
      "Build pipelines that test, secure, and ship continuously. 8 handbooks, hosted here, plus the companion course site.",
    intro: null,
    format: "pdf",
    pages: trackPages("cicd"),
    chapters: 23,
    hours: "15h",
    level: "Intermediate",
    milestones: 8,
    kind: "lab",
    icon: GitBranch,
  },
  {
    slug: "terraform",
    source: "hosted",
    title: "Terraform IaC",
    description:
      "Provision repeatable cloud infrastructure with HCL. 5 volumes hosted here, plus companion site.",
    intro: null,
    format: "pdf",
    pages: trackPages("terraform"),
    chapters: 12,
    hours: "20h",
    level: "Intermediate",
    milestones: 5,
    kind: "lab",
    icon: Box,
  },
  {
    slug: "kubernetes",
    source: "hosted",
    title: "Kubernetes Orchestration",
    description:
      "Deploy, scale, and operate production workloads with confidence. 9 books, hosted here.",
    intro: null,
    format: "pdf",
    pages: trackPages("kubernetes"),
    chapters: 259,
    hours: "24h",
    level: "Intermediate",
    milestones: 9,
    kind: "guide",
    icon: Waypoints,
  },
  {
    slug: "docker",
    source: "hosted",
    title: "Docker & Containers",
    description:
      "Build lean images and compose dependable development stacks. 2 cheat sheets, hosted here.",
    intro: null,
    format: "pdf",
    pages: trackPages("docker"),
    chapters: 2,
    hours: "4h",
    level: "Foundation",
    milestones: 2,
    kind: "guide",
    icon: Container,
  },
  {
    slug: "ansible",
    source: "hosted",
    title: "Ansible Automation",
    description:
      "Turn repetitive operations into clear, reusable playbooks. 4 docs (EN + AR), hosted here.",
    intro: null,
    format: "pdf",
    pages: trackPages("ansible"),
    chapters: 106,
    hours: "12h",
    level: "Intermediate",
    milestones: 4,
    kind: "guide",
    icon: Wrench,
  },
  {
    slug: "linux",
    source: "hosted",
    title: "Linux Primitives",
    description:
      "Master processes, filesystems, permissions, and networking. Complete guide hosted here, plus companion site.",
    intro: null,
    format: "pdf",
    pages: trackPages("linux"),
    chapters: 6,
    hours: "16h",
    level: "Foundation",
    milestones: 1,
    kind: "lab",
    icon: Terminal,
  },
];

export const trackHref = (track: Track) => `/tracks/${track.slug}`;

export const trackBadge = (track: Track) => {
  if (track.format === "website") return "Website · Needs internet";
  if (track.pages !== null) return `PDF · ${track.pages} pages`;
  return "PDF · Content to be supplied";
};

/** Tracks with a full companion course site alongside the hosted PDFs. */
const companionSiteSlugs = ["cicd", "terraform", "linux"];

/** Small format flag shown next to the page-count badge. */
export const trackFormatBadge = (track: Track) =>
  companionSiteSlugs.includes(track.slug)
    ? "Companion Site + PDF"
    : "PDF Only";

export const searchItems = [
  ...tracks.map((track) => ({
    title: track.title,
    subtitle: `${trackBadge(track)} · ${track.description}`,
    href: trackHref(track),
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
    subtitle: `Book · ${book.chapters.length} sections · ${book.pages} pages`,
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
