import { createFileRoute } from "@tanstack/react-router";
import { Fill } from "../../components/fill";
import { headFor, pages, person } from "../../content/site";

export const Route = createFileRoute("/bio/")({
  head: () => headFor("/bio/"),
  component: EducationPage,
});

/** Newest first. A real sequence, so it's an ordered list with years as the markers. */
const timeline: { years: string; place: string; note: string }[] = [
  {
    years: "[[2025]] — сейчас",
    place: `${person.universityShort}, магистратура`,
    note: `Группа ${person.group}. Тема работы: ${person.thesis}`,
  },
  { years: "[[годы]]", place: "[[ВУЗ, бакалавриат или специалитет]]", note: "[[Направление, тема дипломной работы]]" },
  { years: "[[годы]]", place: "[[Школа]]", note: "[[Город]]" },
];

function EducationPage() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">{pages["/bio/"].label}</h1>

      <ol className="mt-12 max-w-3xl">
        {timeline.map((item) => (
          <li
            key={item.place}
            className="grid gap-x-10 gap-y-1 border-t border-rule py-6 sm:grid-cols-[10rem_1fr]"
          >
            <p className="font-mono text-sm text-muted">
              <Fill>{item.years}</Fill>
            </p>
            <div>
              <h2 className="text-lg font-semibold">
                <Fill>{item.place}</Fill>
              </h2>
              <p className="mt-1 text-muted">
                <Fill>{item.note}</Fill>
              </p>
            </div>
          </li>
        ))}
      </ol>

      <section className="prose-ru mt-16">
        <h2>Самообразование</h2>
        <p>
          JavaScript и TypeScript изучил самостоятельно, на реальных задачах: сначала
          поддержка legacy-кода на PHP, затем перенос форм заказа на Node.js и
          разработка Telegram-бота. <Fill>[[Курсы, сертификаты — если есть]]</Fill>
        </p>
      </section>
    </>
  );
}
