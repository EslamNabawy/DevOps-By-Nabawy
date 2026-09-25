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

/** Exact companion-site HTML pages for hosted PDFs (when read online should go to the companion site). */
export const externalHtmlMap: Record<string, string> = {
  "terraform-01-foundations": "https://eslamnabawy.github.io/TerraForm-By-Nabawy/books/vol1-foundations.html",
  "terraform-02-production": "https://eslamnabawy.github.io/TerraForm-By-Nabawy/books/vol2-production.html",
  "terraform-03-practice-lab": "https://eslamnabawy.github.io/TerraForm-By-Nabawy/books/lab.html",
  "terraform-04-exam-center": "https://eslamnabawy.github.io/TerraForm-By-Nabawy/books/exam-center.html",
  "terraform-05-interview-arsenal": "https://eslamnabawy.github.io/TerraForm-By-Nabawy/books/interview-arsenal.html",
  "cicd-01-start-here": "https://eslamnabawy.github.io/cicd-by-nabawy/read/start-here.html",
  "cicd-02-pipelines": "https://eslamnabawy.github.io/cicd-by-nabawy/read/build-artifacts.html",
  "cicd-03-delivery": "https://eslamnabawy.github.io/cicd-by-nabawy/read/deliver-operate.html",
  "cicd-04-observability": "https://eslamnabawy.github.io/cicd-by-nabawy/read/observability.html",
  "cicd-05-jenkins": "https://eslamnabawy.github.io/cicd-by-nabawy/read/jenkins-complete.html",
  "cicd-06-platforms": "https://eslamnabawy.github.io/cicd-by-nabawy/read/platforms-roadmaps.html",
  "cicd-07-labs": "https://eslamnabawy.github.io/cicd-by-nabawy/read/labs-handbook.html",
  "cicd-08-cheatsheet": "https://eslamnabawy.github.io/cicd-by-nabawy/read/cheatsheet.html",
};

export const externalReadUrl = (book: Book): string | null =>
  externalHtmlMap[book.id] ?? null;

export const onlineUrlForBook = (book: Book): string | null =>
  readUrl(book) ?? externalReadUrl(book) ?? companions[book.track]?.[0]?.url ?? null;

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
};


