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
    name: "[[Название проекта]]",
    status: "[[в продакшене / в работе / учебный]]",
    what: "[[Что делает проект и какую задачу решает — 1–2 предложения]]",
    stack: "[[Технологии через запятую]]",
  },
];
