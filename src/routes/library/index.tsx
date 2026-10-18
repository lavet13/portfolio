import { createFileRoute } from "@tanstack/react-router";
import { Fill } from "../../components/fill";
import { headFor, pages } from "../../content/site";

export const Route = createFileRoute("/library/")({
  head: () => headFor("/library/"),
  component: LibraryPage,
});

/**
 * Bibliographic entries. Put local copies (pdf/htm) in public/library/ and link
 * them as "./library/file.pdf"; the page's <base> resolves that from the site root.
 */
const entries: { authors: string; title: string; source: string; href?: string }[] = [
  {
    authors: "[[Фамилия И. О.]]",
    title: "[[Название статьи]]",
    source: "[[Журнал или конференция, год, страницы]]",
  },
  {
    authors: "[[Фамилия И. О.]]",
    title: "[[Название статьи]]",
    source: "[[Журнал или конференция, год, страницы]]",
  },
];

function LibraryPage() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">{pages["/library/"].label}</h1>
      <ol className="mt-12 max-w-3xl list-decimal space-y-6 pl-6 marker:font-mono marker:text-sm marker:text-muted">
        {entries.map((e, i) => (
          <li key={i} className="pl-2">
            <p>
              <Fill>{e.authors}</Fill>{" "}
              {e.href ? (
                <a href={e.href} className="text-stamp">
                  <Fill>{e.title}</Fill>
                </a>
              ) : (
                <Fill>{e.title}</Fill>
              )}
            </p>
            <p className="mt-1 text-sm text-muted">
              <Fill>{e.source}</Fill>
            </p>
          </li>
        ))}
      </ol>
    </>
  );
}
