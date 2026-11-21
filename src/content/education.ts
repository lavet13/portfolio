import { person } from "./site";

export const education: { years: string; place: string; note: string }[] = [
  {
    years: "[[годы]] — сейчас",
    place: `${person.universityShort}, магистратура`,
    note: `Группа ${person.group}. Тема работы: ${person.thesis}`,
  },
  {
    years: "[[годы]]",
    place: "[[ВУЗ, бакалавриат или специалитет]]",
    note: "[[Направление, тема дипломной работы]]",
  },
  { years: "[[годы]]", place: "[[Школа, город]]", note: "[[Примечание, если нужно]]" },
];
