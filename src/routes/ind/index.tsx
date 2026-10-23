import { createFileRoute } from "@tanstack/react-router";
import { headFor, pages } from "../../content/site";
import { projects } from "../../content/projects";
import { Fill } from "../../components/fill";

export const Route = createFileRoute("/ind/")({
  head: () => headFor("/ind/"),
  component: ProjectsPage,
});

function ProjectsPage() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">
        {pages["/ind/"].label}
      </h1>
      <ul className="mt-12 max-w-3xl">
        {projects.map((p) => (
          <li
            key={p.name}
            className="grid gap-x-10 gap-y-2 border-t border-rule py-8 sm:grid-cols-[10rem_1fr]"
          >
            <p className="text-sm text-muted"><Fill>{p.status}</Fill></p>
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                {p.href ? (
                  <a href={p.href} className="no-underline hover:text-stamp">
                    <Fill>{p.name}</Fill>
                  </a>
                ) : (
                  <Fill>{p.name}</Fill>
                )}
              </h2>
              <p className="mt-3 max-w-[60ch]">
                <Fill>{p.what}</Fill>
              </p>
              <p className="mt-3 font-mono text-sm text-muted">
                <Fill>{p.stack}</Fill>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
