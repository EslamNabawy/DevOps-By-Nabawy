import { createFileRoute } from "@tanstack/react-router";
import { WebsiteTrackPage } from "@/components/website-track";

export const Route = createFileRoute("/tracks/terraform")({
  head: () => ({
    meta: [
      { title: "Terraform IaC — DevOps By Nabawy" },
      {
        name: "description",
        content:
          "Preview the Terraform companion course: 5 volumes, drills, and command deck.",
      },
      { property: "og:title", content: "Terraform IaC — DevOps By Nabawy" },
      {
        property: "og:description",
        content: "A practical Terraform curriculum on the companion site.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TerraformPage,
});

const SITE = "https://eslamnabawy.github.io/TerraForm-By-Nabawy/";

const OUTLINE = [
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

function TerraformPage() {
  return (
    <WebsiteTrackPage
      slug="terraform"
      siteName="TerraForm by Nabawy"
      siteUrl={SITE}
      outline={OUTLINE}
    />
  );
}
