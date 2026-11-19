import { createFileRoute } from "@tanstack/react-router";
import { headFor, pages } from "../../content/site";
import { linkGroups } from "../../content/links";

export const Route = createFileRoute("/links/")({
  head: () => headFor("/links/"),
  component: LinksPage,
});

function LinksPage() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">{pages["/links/"].label}</h1>
      {linkGroups.map((g) => (
        <section key={g.heading} className="mt-12 max-w-3xl">
          <h2 className="text-lg font-semibold">{g.heading}</h2>
          <ul className="mt-4">
            {g.links.map((l) => (
              <li key={l.href} className="border-t border-rule py-4">
                <a href={l.href} className="text-stamp">
                  {l.title}
                </a>
                <p className="mt-1 text-sm text-muted">{l.note}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
