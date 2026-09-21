import manifest from "../../content/manifest.json";

export type Book = {
  id: string;
  track: string;
  title: string;
  lang: string;
  kind: "guide" | "lab" | "cheatsheet";
  pdfName: string;
  pdfMB: number;
  pages: number;
  htmlName: string | null;
  chapters: string[];
};

export const books: Book[] = manifest.books as Book[];

export const RELEASE_BASE =
  "https://github.com/EslamNabawy/DevOps-By-Nabawy/releases/download/content-v1";

export const pdfUrl = (book: Book) =>
  `${import.meta.env.BASE_URL}pdf/${book.pdfName}`;

export const releasePdfUrl = (book: Book) => `${RELEASE_BASE}/${book.pdfName}`;

export const readUrl = (book: Book) =>
  book.htmlName ? `${import.meta.env.BASE_URL}read/${book.htmlName}` : null;

export const booksByTrack = (slug: string) =>
  books.filter((book) => book.track === slug);

export const trackSectionCount = (slug: string) =>
  booksByTrack(slug).reduce((sum, book) => sum + book.chapters.length, 0);

export type Companion = { title: string; url: string; note: string };

export const companions: Record<string, Companion[]> = {
  terraform: [
    {
      title: "TerraForm by Nabawy",
      url: "https://eslamnabawy.github.io/TerraForm-By-Nabawy/",
      note: "5 volumes, drills, command deck, notes",
    },
  ],
  cicd: [
    {
      title: "CI/CD by Nabawy",
      url: "https://eslamnabawy.github.io/cicd-by-nabawy/",
      note: "8 handbooks, hosted above — full course version with extra drills",
    },
  ],
  linux: [
    {
      title: "Linux101",
      url: "https://eslamnabawy.github.io/linux101/",
      note: "Notes, labs, flashcards, quizzes",
    },
  ],
};

/** Tracks with no local data yet. Cards render a "Coming soon" badge. */
export const comingSoonTracks = ["devops", "aws", "aiops"];

export const isComingSoon = (slug: string) => comingSoonTracks.includes(slug);
