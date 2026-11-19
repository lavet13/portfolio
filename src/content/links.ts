/** Links for the /links/ page, in groups. Kept apart from the page so template and main can differ here. */
export type LinkGroup = {
  heading: string;
  links: { title: string; href: string; note: string }[];
};

export const linkGroups: LinkGroup[] = [
  {
    heading: "REST и HTTP",
    links: [
      {
        title:
          "Architectural Styles and the Design of Network-based Software Architectures",
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
