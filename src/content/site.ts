import { about } from "./about";
/**
 * Everything the site says about you, in one place. Routes, <head> tags, the
 * nav rail and the sitemap all read from here, so a fact is edited once.
 *
 * Anything wrapped in [[double brackets]] is a placeholder I couldn't know.
 * The prerender step prints a warning for every page that still contains one.
 */

export const person = {
  firstName: "[[Имя]]",
  lastName: "[[Фамилия]]",
  patronymic: "[[Отчество]]",
  group: "[[Группа]]",
  university: "Донецкий национальный технический университет",
  universityShort: "ДонНТУ",
  faculty: "[[Факультет]]",
  department: "[[Кафедра]]",
  specialty: "[[Специальность]]",
  supervisor: "[[Научный руководитель: должность, ФИО]]",
  thesis: "[[Точная тема магистерской работы]]",
  github: "https://github.com/[[логин]]",
};

export const fullName = `${person.lastName} ${person.firstName} ${person.patronymic}`;
const shortName = `${person.firstName} ${person.lastName}`;

/** One entry per page. `endpoint` is what the nav rail shows; `label` is the human name. */
export const pages = {
  "/": {
    endpoint: "/",
    label: "Резюме",
    title: `${shortName} — магистр ${person.universityShort}`,
    description: `Магистр ${person.universityShort}, группа ${person.group}. ${about.thesisSummary} Резюме, реферат, библиотека и проекты.`,
  },
  "/bio/": {
    endpoint: "/bio/",
    label: "Биография",
    title: `Биография — ${shortName}`,
    description: `Образование и опыт работы: школа, университет, магистратура ${person.universityShort} (группа ${person.group}).`,
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
      "[[Статьи и публикации по теме магистерской работы — одной фразой]]",
  },
  "/links/": {
    endpoint: "/links/",
    label: "Ссылки",
    title: `Ссылки — ${shortName}`,
    description: "[[Какие ресурсы собраны на этой странице — одной фразой]]",
  },
  "/ind/": {
    endpoint: "/ind/",
    label: "Проекты",
    title: `Проекты — ${shortName}`,
    description: about.projectsDescription,
  },
} as const;

export type PagePath = keyof typeof pages;

/** The pages top to bottom, as the nav lists them. Page transitions read it too (router.ts). */
export const pageOrder: PagePath[] = [
  "/",
  "/bio/",
  "/diss/",
  "/library/",
  "/links/",
  "/ind/",
];

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
