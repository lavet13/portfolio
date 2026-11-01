import { Link, createFileRoute } from "@tanstack/react-router";
import { Fill } from "../../components/fill";
import { headFor, pages, person } from "../../content/site";

export const Route = createFileRoute("/diss/")({
  head: () => headFor("/diss/"),
  component: AbstractPage,
});

/**
 * The реферат as HTML, generated from src/content/referat.docx by `yarn diss` (part of the build).
 * import.meta.glob, not a plain import: on the template branch the file doesn't exist, and a plain
 * import would fail the build, while the glob just finds nothing. eager: bundled now, not fetched
 * later; query "?raw": the file's text as a string; import "default": that string itself.
 */
const generated = import.meta.glob<string>("../../content/referat.html", {
  query: "?raw",
  import: "default",
  eager: true,
});
const referat: string | undefined = Object.values(generated)[0];

type Entry = { id: string; title: string; nested: boolean };

/** Undoes the escaping mammoth applies to text (&amp; last, so "&amp;lt;" stays "&lt;"). */
function decode(text: string): string {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

/** The contents list: every <h2>/<h3> the converter gave an id; <h3> entries are nested. */
function contentsOf(html: string): Entry[] {
  return [...html.matchAll(/<(h[23]) id="([^"]+)">([^<]*)<\/\1>/g)].map(
    ([, tag, id, title]) => ({
      id,
      title: decode(title),
      nested: tag === "h3",
    }),
  );
}

/**
 * The usual реферат structure on the masters portal, shown while there is no document
 * (the template branch). The numbering mirrors the real document.
 */
const placeholderSections: { id: string; title: string; hint: string }[] = [
  {
    id: "intro",
    title: "Введение",
    hint: "[[Что за система, почему REST API — 1–2 абзаца]]",
  },
  {
    id: "relevance",
    title: "1. Актуальность темы",
    hint: "[[Зачем это нужно сейчас: legacy PHP-формы, интеграции, мобильные клиенты]]",
  },
  {
    id: "goal",
    title: "2. Цель и задачи исследования, планируемые результаты",
    hint: "[[Цель одной фразой; задачи списком; что получится в итоге]]",
  },
  {
    id: "review",
    title: "3. Обзор исследований и разработок",
    hint: "[[Международный, национальный и локальный уровни — работы магистров ДонНТУ]]",
  },
  {
    id: "design",
    title: "4. Проектирование REST API сервиса отслеживания грузов",
    hint: "[[Ресурсы, методы, коды ответов, валидация на сервере — схемы и примеры запросов]]",
  },
  {
    id: "conclusions",
    title: "Выводы",
    hint: "[[Что сделано и что осталось]]",
  },
];

function AbstractPage() {
  return (
    <article className="prose-ru">
      <h1 className="text-3xl font-bold tracking-tight">
        {pages["/diss/"].label}
      </h1>
      <p className="mt-6 text-lg">
        <Fill>{person.thesis}</Fill>
      </p>
      {referat ? <Referat html={referat} /> : <Placeholder />}
    </article>
  );
}

/** The converted document: its contents list, then the document itself. */
function Referat({ html }: { html: string }) {
  return (
    <>
      <Contents entries={contentsOf(html)} />
      {/* our own document, converted at build time, so inserting it as HTML is safe */}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}

/** The template branch: the portal's section structure with hints to fill in. */
function Placeholder() {
  return (
    <>
      <Contents
        entries={placeholderSections.map((s) => ({
          id: s.id,
          title: s.title,
          nested: false,
        }))}
      />
      {placeholderSections.map((s) => (
        <section key={s.id} id={s.id} className="scroll-mt-10">
          <h2>{s.title}</h2>
          <p>
            <Fill>{s.hint}</Fill>
          </p>
        </section>
      ))}
      <p className="mt-16 border-t border-rule pt-6 text-sm text-muted">
        При написании данного реферата магистерская работа ещё не завершена.
        Окончательное завершение: <Fill>[[месяц год]]</Fill>. Полный текст
        работы и материалы по теме могут быть получены у автора или его
        руководителя после указанной даты.
      </p>
    </>
  );
}

/** Links to the page's own sections; nested entries (3.1, 3.2…) are indented. */
function Contents({ entries }: { entries: Entry[] }) {
  return (
    <nav aria-label="Содержание" className="mt-10 border-t border-rule pt-6">
      <ul className="space-y-2 text-muted">
        {entries.map((e) => (
          <li key={e.id} className={e.nested ? "pl-5" : undefined}>
            {/* Link, not a bare #hash: the page's <base> points at the site root,
                so "#intro" alone would jump to the home page. No view transition:
                a jump within the page shouldn't fade the whole page out and back in */}
            <Link
              to="/diss/"
              hash={e.id}
              viewTransition={false}
              className="no-underline hover:text-ink"
            >
              {e.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
