import { about } from "./about";
/**
 * Everything the site says about you, in one place. Routes, <head> tags, the
 * nav rail and the sitemap all read from here, so a fact is edited once.
 *
 * Anything wrapped in [[double brackets]] is a placeholder I couldn't know.
 * The prerender step prints a warning for every page that still contains one.
 */

export const person = {
  firstName: "Иван",
  lastName: "Скиндер",
  patronymic: "Павлович",
  group: "БИм-25",
  university: "Донецкий национальный технический университет",
  universityShort: "ДонНТУ",
<<<<<<< HEAD
  faculty: "Факультет информационных систем и технологий",
  department: "Кафедра экономической кибернетики",
  specialty: "Бизнес-информатика",
  supervisor: "доц., Харитонов Ю.Е.",
  thesis: "Разработка REST API",
=======
  faculty: "[[Факультет]]",
  department: "[[Кафедра]]",
  specialty: "[[Специальность]]",
  supervisor: "[[Научный руководитель: должность, ФИО]]",
  thesis: about.thesisSummary,
>>>>>>> template
  github: "https://github.com/lavet13",
};

export const fullName = `${person.lastName} ${person.firstName} ${person.patronymic}`;
const shortName = `${person.firstName} ${person.lastName}`;

/** One entry per page. `endpoint` is what the nav rail shows; `label` is the human name. */
export const pages = {
  "/": {
    endpoint: "/",
    label: "Резюме",
    title: `${shortName} — магистр ${person.universityShort}`,
    description: `Магистр ${person.universityShort}, группа ${person.group}. Тема магистерской работы — разработка REST API на примере сервиса отслеживания грузов. Резюме, реферат, библиотека и проекты.`,
  },
  "/bio/": {
    endpoint: "/bio/",
    label: "Образование",
    title: `Образование — ${shortName}`,
    description: `Образование и курсы: школа, университет, магистратура ${person.universityShort} (группа ${person.group}).`,
  },
  "/diss/": {
    endpoint: "/diss/",
    label: "Реферат",
    title: `Реферат магистерской работы — ${shortName}`,
    description: `Реферат по теме «${person.thesis}»: актуальность, цель и задачи, обзор исследований, планируемые результаты.`,
  },
  "/library/": {
    endpoint: "/library/",
    label: "Библиотека",
    title: `Библиотека — ${shortName}`,
    description:
      "Статьи и публикации по теме магистерской работы: проектирование REST API, HTTP, миграция legacy-систем.",
  },
  "/links/": {
    endpoint: "/links/",
    label: "Ссылки",
    title: `Ссылки — ${shortName}`,
    description:
      "Спецификации, документация и ресурсы по теме REST API и HTTP.",
  },
  "/ind/": {
    endpoint: "/ind/",
    label: "Проекты",
    title: `Проекты — ${shortName}`,
<<<<<<< HEAD
    description:
      "Индивидуальный раздел: проекты в продакшене — Telegram-бот и веб-приложение службы доставки, миграция legacy PHP на Node.js.",
=======
    description: about.projectsDescription,
>>>>>>> template
  },
} as const;

export type PagePath = keyof typeof pages;

/** The `head` option for a route: title + description + Open Graph copies for link previews. */
export function headFor(path: PagePath) {
  const { title, description } = pages[path];
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: path === "/" ? "profile" : "article" },
      { property: "og:locale", content: "ru_RU" },
    ],
  };
}
