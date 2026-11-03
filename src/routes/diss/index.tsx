import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Fill } from "../../components/fill";
import { headFor, pages, person } from "../../content/site";
import { useLayoutEffect, useRef, useState, type MouseEvent } from "react";

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
  return [...html.matchAll(/<(h[23]) id="([^"]+)">(.*?)<\/\1>/g)].map(
    ([, tag, id, inner]) => {
      // console.log({ tag, id, inner, replace: inner.replace(/<[^>]+>/g, "") });
      return {
        id,
        title: decode(inner.replace(/<[^>]+>/g, "")), // the text without the heading's own link
        nested: tag === "h3",
      };
    },
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

/** Built once, when the module loads: the page's sections never change while it's open. */
const contents: Entry[] = referat
  ? contentsOf(referat)
  : placeholderSections.map((s) => ({
      id: s.id,
      title: s.title,
      nested: false,
    }));

function AbstractPage() {
  const navigate = useNavigate();

  /**
   * Every link to a section of this page (the contents list, the headings) is a plain <a>.
   * Left to the browser, a click changes the hash on its own and the router answers with a
   * whole-page transition. A plain click on such a link goes through the router instead.
   */
  function handleClick(e: MouseEvent<HTMLDivElement>) {
    const plainClick =
      e.button === 0 && !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey);
    const link = e.target instanceof Element ? e.target.closest("a") : null;
    if (!plainClick || !link) return;
    const url = new URL(link.href); // .href: the full URL, already resolved against <base>
    if (url.pathname !== location.pathname || !url.hash) return; // another page: the browser's job
    e.preventDefault();
    const id = decodeURIComponent(url.hash.slice(1)); // "#3-2-%D0%BE…" → "3-2-обзор…"
    if (url.hash === location.hash) {
      // already in the address bar: navigating to the same URL makes the router reload the
      // page, with the whole-page transition, ignoring viewTransition: false. Just scroll.
      document.getElementById(id)?.scrollIntoView(scrollOptions());
      return;
    }
    void navigate({
      to: "/diss/",
      hash: id,
      viewTransition: false, // a jump within the page shouldn't fade the whole page
      hashScrollIntoView: scrollOptions(),
    });
  }

  return (
    <article className="prose-ru xl:max-w-none">
      <h1 className="text-3xl font-bold tracking-tight">
        {pages["/diss/"].label}
      </h1>
      <p className="mt-6 text-lg">
        <Fill>{person.thesis}</Fill>
      </p>
      {/* xl+: the document and a sticky contents column beside it; below xl: contents on top */}
      <div
        onClick={handleClick}
        className="mt-10 xl:grid xl:grid-cols-[minmax(0,1fr)_13rem] xl:gap-x-8"
      >
        <Contents entries={contents} />
        <div className="xl:col-start-1 xl:row-start-1">
          {referat ? <Referat html={referat} /> : <Placeholder />}
        </div>
      </div>
    </article>
  );
}

/** The converted document. Our own, converted at build time, so inserting it as HTML is safe. */
function Referat({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

/** The template branch: the portal's section structure with hints to fill in. */
function Placeholder() {
  return (
    <>
      {placeholderSections.map((s) => (
        <section key={s.id} id={s.id} className="scroll-mt-10">
          <h2>
            <a href={`./diss/#${s.id}`}>{s.title}</a>
          </h2>
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

/** Smooth scrolling for jumps within the page, unless the system asks for less motion. */
function scrollOptions(): ScrollIntoViewOptions {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  return { behavior: reduce ? "instant" : "smooth", block: "start" };
}

/**
 * The id of the section being read: the last heading that has scrolled up past the top
 * quarter of the window. undefined above the first heading.
 */
function useActiveHeading(entries: Entry[]): string | undefined {
  const [active, setActive] = useState<string>();

  useLayoutEffect(() => {
    const headings = entries.flatMap(
      (e) => document.getElementById(e.id) ?? [],
    );
    let frame = 0;

    function update() {
      frame = 0;
      const line = innerHeight / 4;
      const atBottom =
        innerHeight + scrollY >= document.documentElement.scrollHeight - 2;
      // at the very bottom the last sections may never reach the line; count them as read
      const passed = atBottom
        ? headings.filter((h) => h.getBoundingClientRect().top < innerHeight)
        : headings.filter((h) => h.getBoundingClientRect().top <= line);
      setActive(passed.at(-1)?.id);
    }
    /** At most one update per frame, however many scroll events arrive. */
    function schedule() {
      frame ||= requestAnimationFrame(update);
    }

    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => {
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [entries]);

  return active;
}

/**
 * Links to the page's own sections; nested entries (3.1, 3.2…) are indented. From xl up it
 * sticks beside the document, and a bar slides along it to the section being read.
 */
function Contents({ entries }: { entries: Entry[] }) {
  const active = useActiveHeading(entries);
  const list = useRef<HTMLDivElement>(null);
  const [bar, setBar] = useState<{ top: number; height: number }>();

  // measure the active link after render, before paint: the bar moves in the same frame
  useLayoutEffect(() => {
    const link = active
      ? list.current?.querySelector<HTMLElement>(
          `[data-id="${CSS.escape(active)}"]`,
        )
      : null;
    setBar(
      link ? { top: link.offsetTop, height: link.offsetHeight } : undefined,
    );
  }, [active]);

  return (
    <nav
      aria-label="Содержание"
      className="border-t border-rule pt-6 xl:sticky xl:top-10 xl:col-start-2 xl:row-start-1 xl:max-h-[calc(100dvh-5rem)] xl:self-start xl:overflow-y-auto xl:border-t-0 xl:pt-0"
    >
      <p className="mb-3 hidden text-sm font-semibold xl:block">Содержание</p>
      {/* relative: the bar's position and the links' offsetTop are both measured from here */}
      <div ref={list} className="relative">
        <span
          aria-hidden="true"
          className="absolute left-0 w-0.5 bg-stamp transition-[translate,height,opacity] duration-300 ease-out"
          style={{
            translate: `0 ${bar?.top ?? 0}px`,
            height: bar?.height ?? 0,
            opacity: bar ? 1 : 0,
          }}
        />
        <ul className="space-y-2 border-l border-rule text-sm xl:text-[0.8125rem]">
          {entries.map((e) => (
            <li key={e.id} className={e.nested ? "pl-7" : "pl-3"}>
              {/* "./diss/#id", not "#id": the page's <base> points at the site root */}
              <a
                href={`./diss/#${e.id}`}
                data-id={e.id}
                aria-current={e.id === active ? "location" : undefined}
                className="block text-muted no-underline transition-colors hover:text-ink aria-[current]:text-ink"
              >
                {e.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
