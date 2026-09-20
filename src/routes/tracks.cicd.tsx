import { createFileRoute } from "@tanstack/react-router";
import { WebsiteTrackPage } from "@/components/website-track";

export const Route = createFileRoute("/tracks/cicd")({
  head: () => ({
    meta: [
      { title: "CI/CD Automation — DevOps By Nabawy" },
      {
        name: "description",
        content:
          "Preview the CI/CD companion course: 8 handbooks from commit to production.",
      },
      { property: "og:title", content: "CI/CD Automation — DevOps By Nabawy" },
      {
        property: "og:description",
        content:
          "The CI/CD library: from commit to production with 8 focused handbooks.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CicdPage,
});

const SITE = "https://eslamnabawy.github.io/cicd-by-nabawy/";

const OUTLINE = [
  {
    n: "01",
    title: "Start Here",
    text: "Foundations, Git & CI · 75 min · Beginner.",
  },
  {
    n: "02",
    title: "Build",
    text: "Pipelines, test & artifacts · 130 min.",
  },
  {
    n: "03",
    title: "Deliver",
    text: "Deployment & operations · 255 min.",
  },
  {
    n: "04",
    title: "Observability",
    text: "Loki, Prometheus & Grafana · 120 min.",
  },
  { n: "05", title: "Jenkins", text: "Complete guide · 345 min." },
  {
    n: "06",
    title: "Platforms",
    text: "Actions, GitLab, ArgoCD + roadmaps · 190 min.",
  },
  {
    n: "07",
    title: "Labs",
    text: "Build it, break it, recover it · 675 min.",
  },
  { n: "08", title: "Reference", text: "Command cheatsheet · 15 min." },
];

function CicdPage() {
  return (
    <WebsiteTrackPage
      slug="cicd"
      siteName="CI/CD by Nabawy"
      siteUrl={SITE}
      outline={OUTLINE}
    />
  );
}
