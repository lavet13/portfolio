import { Link, createFileRoute } from "@tanstack/react-router";
import { Fill } from "../../components/fill";
import { headFor, pages, person } from "../../content/site";

export const Route = createFileRoute("/diss/")({
  head: () => headFor("/diss/"),
  component: AbstractPage,
});

/**
 * The usual реферат structure on the masters portal. The numbering mirrors the
 * real document, so these are numbered sections. Check against your кафедра.
 */
const sections: { id: string; title: string; hint: string }[] = [
  { id: "intro", title: "Введение", hint: "[[Что за система, почему REST API — 1–2 абзаца]]" },
  { id: "relevance", title: "1. Актуальность темы", hint: "[[Зачем это нужно сейчас: legacy PHP-формы, интеграции, мобильные клиенты]]" },
  { id: "goal", title: "2. Цель и задачи исследования, планируемые результаты", hint: "[[Цель одной фразой; задачи списком; что получится в итоге]]" },
  { id: "review", title: "3. Обзор исследований и разработок", hint: "[[Международный, национальный и локальный уровни — работы магистров ДонНТУ]]" },
  { id: "design", title: "4. Проектирование REST API сервиса отслеживания грузов", hint: "[[Ресурсы, методы, коды ответов, валидация на сервере — схемы и примеры запросов]]" },
  { id: "conclusions", title: "Выводы", hint: "[[Что сделано и что осталось]]" },
];

function AbstractPage() {
  return (
    <article className="prose-ru">
      <h1 className="text-3xl font-bold tracking-tight">{pages["/diss/"].label}</h1>
      <p className="mt-6 text-lg">
        <Fill>{person.thesis}</Fill>
      </p>

      <nav aria-label="Содержание" className="mt-10 border-t border-rule pt-6">
        <ul className="space-y-2 text-muted">
          {sections.map((s) => (
            <li key={s.id}>
              {/* Link, not a bare #hash: the page's <base> points at the site root, and the
                  prerender turns this into ./diss/index.html#id, which works from disk too */}
              <Link to="/diss/" hash={s.id} className="no-underline hover:text-ink">
                {s.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {sections.map((s) => (
        <section key={s.id} id={s.id} className="scroll-mt-10">
          <h2>{s.title}</h2>
          <p>
            <Fill>{s.hint}</Fill>
          </p>
        </section>
      ))}

      <p className="mt-16 border-t border-rule pt-6 text-sm text-muted">
        При написании данного реферата магистерская работа ещё не завершена. Окончательное
        завершение: <Fill>[[месяц год]]</Fill>. Полный текст работы и материалы по теме могут
        быть получены у автора или его руководителя после указанной даты.
      </p>
    </article>
  );
}
