/**
 * Renders content text, showing [[placeholders]] as visibly unfinished hints
 * instead of raw brackets. Once a fact is filled in site.ts it renders as plain text.
 */
export function Fill({ children }: { children: string }) {
  const parts = children.split(/(\[\[[^\]]+\]\])/);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("[[") ? (
          <span
            key={i}
            data-todo=""
            className="rounded-sm bg-stamp/10 px-1 text-stamp decoration-stamp/50 decoration-dashed underline"
            title="Заполнить в src/content/site.ts"
          >
            {part.slice(2, -2)}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
