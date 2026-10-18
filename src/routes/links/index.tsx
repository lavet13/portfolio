import { createFileRoute } from "@tanstack/react-router";
import { headFor, pages } from "../../content/site";

export const Route = createFileRoute("/links/")({
  head: () => headFor("/links/"),
  component: LinksPage,
});

/** Primary sources on the thesis topic, then the people/places the portal expects. */
const groups: { heading: string; links: { title: string; href: string; note: string }[] }[] = [
  {
    heading: "REST и HTTP",
    links: [
      {
        title: "Architectural Styles and the Design of Network-based Software Architectures",
        href: "https://ics.uci.edu/~fielding/pubs/dissertation/top.htm",
        note: "Диссертация Роя Филдинга, где впервые описан REST (2000)",
      },
      {
        title: "RFC 9110: HTTP Semantics",
        href: "https://www.rfc-editor.org/rfc/rfc9110",
        note: "Действующая спецификация методов, кодов ответов и заголовков HTTP",
      },
      {
        title: "OpenAPI Specification",
        href: "https://spec.openapis.org/oas/latest.html",
        note: "Стандарт описания REST API",
      },
      {
        title: "HTTP — MDN Web Docs",
        href: "https://developer.mozilla.org/ru/docs/Web/HTTP",
        note: "Справочник по HTTP на русском",
      },
    ],
  },
];

function LinksPage() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">{pages["/links/"].label}</h1>
      {groups.map((g) => (
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
