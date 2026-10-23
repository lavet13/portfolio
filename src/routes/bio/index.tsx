import { createFileRoute } from "@tanstack/react-router";
import { Fill } from "../../components/fill";
import { headFor, pages } from "../../content/site";
import { education } from "../../content/education";
import { about } from "../../content/about";

export const Route = createFileRoute("/bio/")({
  head: () => headFor("/bio/"),
  component: EducationPage,
});

function EducationPage() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">
        {pages["/bio/"].label}
      </h1>

      <ol className="mt-12 max-w-3xl">
        {education.map((item) => (
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
          <Fill>{about.selfStudy}</Fill>
        </p>
      </section>
    </>
  );
}
