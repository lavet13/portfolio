import { person } from "./site";

export const education: { years: string; place: string; note: string }[] = [
  {
    years: "[[2025]] — сейчас",
    place: `${person.universityShort}, магистратура`,
    note: `Группа ${person.group}. Тема работы: ${person.thesis}`,
  },
  {
    years: "[[годы]]",
    place: "[[ВУЗ, бакалавриат или специалитет]]",
    note: "[[Направление, тема дипломной работы]]",
  },
  { years: "[[годы]]", place: "[[Школа]]", note: "[[Город]]" },
];
