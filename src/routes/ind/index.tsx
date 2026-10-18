import { createFileRoute } from "@tanstack/react-router";
import { headFor, pages } from "../../content/site";

export const Route = createFileRoute("/ind/")({
  head: () => headFor("/ind/"),
  component: ProjectsPage,
});

/** Draft copy from what you've told me about each project; rewrite in your own words. */
const projects: { name: string; status: string; what: string; stack: string; href?: string }[] = [
  {
    name: "donbass-post",
    status: "в продакшене",
    what: "Telegram-бот и веб-приложение службы доставки: заявки на забор и доставку, отслеживание грузов, уведомления менеджерам с ролевым доступом.",
    stack: "TypeScript, grammY, Prisma, React, TanStack Router, Docker, nginx",
    href: "https://github.com/lavet13/_donbass-post",
  },
  {
    name: "Перенос форм заказа с PHP на Node.js",
    status: "в работе",
    what: "Пошаговая миграция legacy-форм на PHP и jQuery в новый стек с серверной валидацией. Материал для третьего раздела магистерской работы.",
    stack: "PHP, MySQL, Node.js, Zod",
  },
  {
    name: "twitch-dl-live",
    status: "учебный",
    what: "Следит за трансляциями на Twitch и записывает их, как только стрим начинается. Первый проект на Python.",
    stack: "Python",
    href: "https://github.com/lavet13/twitch-dl-live",
  },
  {
    name: "Этот сайт",
    status: "открытый код",
    what: "Каждая страница заранее собрана в статический HTML, поэтому сайт открывается на любом сервере и даже с диска, а React делает переходы мгновенными.",
    stack: "Vite, React, TanStack Router, Tailwind, Motion",
    href: "https://github.com/lavet13/portfolio",
  },
];

function ProjectsPage() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">{pages["/ind/"].label}</h1>
      <ul className="mt-12 max-w-3xl">
        {projects.map((p) => (
          <li key={p.name} className="grid gap-x-10 gap-y-2 border-t border-rule py-8 sm:grid-cols-[10rem_1fr]">
            <p className="text-sm text-muted">{p.status}</p>
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                {p.href ? (
                  <a href={p.href} className="no-underline hover:text-stamp">
                    {p.name}
                  </a>
                ) : (
                  p.name
                )}
              </h2>
              <p className="mt-3 max-w-[60ch]">{p.what}</p>
              <p className="mt-3 font-mono text-sm text-muted">{p.stack}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
