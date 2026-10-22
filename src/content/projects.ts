/** Your projects for the /ind/ page. Kept apart from the page so template and main can differ here. */
export type Project = {
  name: string;
  status: string;
  what: string;
  stack: string;
  href?: string;
};

export const projects: Project[] = [
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
