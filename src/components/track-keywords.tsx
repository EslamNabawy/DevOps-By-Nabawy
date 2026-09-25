export function TrackKeywordChips({
  keywords,
  label,
}: {
  keywords: string[];
  label: string;
}) {
  if (!keywords.length) return null;
  return (
    <div
      className="mt-2 flex flex-wrap gap-1.5"
      role="list"
      aria-label={`${label} keywords`}
    >
      {keywords.map((keyword) => (
        <span
          key={keyword}
          role="listitem"
          className="inline-flex items-center rounded-full border border-border bg-muted/60 px-2 py-0.5 font-mono text-[10px] font-bold text-muted-foreground"
        >
          {keyword}
        </span>
      ))}
    </div>
  );
}
