import { HeadContent, Outlet, createRootRoute, useRouterState } from "@tanstack/react-router";
import { MotionConfig, motion } from "motion/react";
import { useEffect } from "react";
import { EndpointNav } from "../components/endpoint-nav";
import { RequestLine } from "../components/request-line";
import { ThemeToggle } from "../components/theme-toggle";
import { headFor, person } from "../content/site";

// false until the first client render has committed. The prerendered HTML and the first
// client render must look identical, so only later navigations animate.
// Module scope, not a ref: the React lint forbids reading ref.current during render, and nothing
// needs to re-render when this flips.
let firstRenderDone = false;

export const Route = createRootRoute({
  head: () => headFor("/"),
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    firstRenderDone = true;
  }, []);

  return (
    // reducedMotion="user": Motion skips transform animations when the OS asks for less motion
    <MotionConfig reducedMotion="user">
      <HeadContent />
      <div className="min-h-dvh">
        <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 text-sm">
          <div className="flex gap-5 text-muted">
            <a href="https://donntu.ru" className="hover:text-ink">
              {person.universityShort}
            </a>
            <a href="https://masters.donntu.ru" className="hover:text-ink">
              Портал магистров
            </a>
          </div>
          <ThemeToggle />
        </header>

        <div className="mx-auto grid max-w-6xl gap-x-16 gap-y-8 px-5 pt-6 pb-24 md:grid-cols-[13rem_1fr] md:pt-16">
          <aside className="min-w-0 md:sticky md:top-10 md:self-start">
            <EndpointNav />
          </aside>

          <main className="min-w-0">
            <RequestLine />
            <motion.div
              key={pathname}
              initial={firstRenderDone ? { opacity: 0, y: 6 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
              className="mt-10"
            >
              <Outlet />
            </motion.div>
          </main>
        </div>

        <footer className="mx-auto max-w-6xl border-t border-rule px-5 py-8 text-sm text-muted">
          <a href={person.github} className="hover:text-ink">
            github.com/lavet13
          </a>
        </footer>
      </div>
    </MotionConfig>
  );
}

function NotFound() {
  return (
    <section>
      <h1 className="text-3xl font-bold tracking-tight">Такой страницы нет</h1>
      <p className="mt-4 text-muted">Проверьте адрес или выберите раздел в меню.</p>
    </section>
  );
}
