import { createFileRoute } from "@tanstack/react-router";
import { WebsiteTrackPage } from "@/components/website-track";

export const Route = createFileRoute("/tracks/linux")({
  head: () => ({
    meta: [
      { title: "Linux Primitives — DevOps By Nabawy" },
      {
        name: "description",
        content:
          "Preview the Linux101 companion course: notes, labs, flashcards, and quizzes.",
      },
      { property: "og:title", content: "Linux Primitives — DevOps By Nabawy" },
      {
        property: "og:description",
        content: "Master processes, filesystems, permissions, and networking.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LinuxPage,
});

const SITE = "https://eslamnabawy.github.io/linux101/";

const OUTLINE = [
  {
    n: "01",
    title: "Linux101 Notes",
    text: "Cheat sheets, command bank, and RH124 notes.",
  },
  {
    n: "02",
    title: "NTI Linux Course",
    text: "Structured course material and exercises.",
  },
  {
    n: "03",
    title: "Practice Lab Drills",
    text: "Hands-on drills with a global roadmap.",
  },
  {
    n: "04",
    title: "Flashcards & Quizzes",
    text: "Lock in commands with active recall.",
  },
];

function LinuxPage() {
  return (
    <WebsiteTrackPage
      slug="linux"
      siteName="Linux101"
      siteUrl={SITE}
      outline={OUTLINE}
    />
  );
}
