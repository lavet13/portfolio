import { createFileRoute } from "@tanstack/react-router";
import { Fill } from "../components/fill";
import { headFor, person } from "../content/site";
import { about } from "../content/about";
import { photo } from "../content/photo";

export const Route = createFileRoute("/")({
  head: () => headFor("/"),
  component: ResumePage,
});

/** The portal's required facts, shown as the body of the "200 OK" response above. */
const facts: [string, string][] = [
  ["группа", person.group],
  ["факультет", person.faculty],
  ["кафедра", person.department],
  ["специальность", person.specialty],
  ["руководитель", person.supervisor],
  ["тема работы", person.thesis],
];

function ResumePage() {
  return (
    <>
      {/* phones: photo above the name (column-reverse); from sm: name left, photo right */}
      <div className="flex flex-col-reverse gap-8 lg:flex-row lg:items-end lg:justify-between">
        <h1 className="text-[clamp(3.25rem,11vw,8.5rem)] leading-[0.86] font-extrabold tracking-[-0.045em]">
          <span className="block">{person.firstName}</span>
          <span className="block">
            <Fill>{person.lastName}</Fill>
          </span>
        </h1>
        {photo ? (
          // alt="": the name right next to it already says who this is
          <img
            src={photo}
            alt=""
            width={480}
            height={480}
            className="size-32 shrink-0 rounded-xl object-cover ring-1 ring-rule sm:size-44"
          />
        ) : (
          <div className="grid size-32 shrink-0 place-items-center rounded-xl ring-1 ring-rule sm:size-44">
            <Fill>[[Фото]]</Fill>
          </div>
        )}
      </div>

      <p className="mt-8 max-w-[46ch] text-lg text-muted">
        Магистрант {person.universityShort}. <Fill>{about.intro}</Fill>
      </p>

      <dl className="mt-14 grid max-w-3xl grid-cols-1 border-t border-rule sm:grid-cols-[10rem_1fr]">
        {facts.map(([key, value]) => (
          <div key={key} className="contents">
            <dt className="pt-4 font-mono text-sm text-muted sm:border-b sm:border-rule sm:pb-4">
              {key}
            </dt>
            <dd className="border-b border-rule pt-1 pb-4 sm:pt-4">
              <Fill>{value}</Fill>
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}
