import { person } from "./site";

export const education: { years: string; place: string; note: string }[] = [
  {
    years: "2025 — сейчас",
    place: `${person.universityShort}, магистратура`,
    note: `38.04.05 Бизнес-информатика, программа «IT-инновации в бизнесе». Группа ${person.group}. Тема работы: ${person.thesis}`,
  },
  {
    years: "2022 — 2025",
    place: `${person.universityShort}, бакалавриат`,
    note: "38.03.05 Бизнес-информатика, профиль «IT-менеджмент». Тема дипломной работы: [[тема]]",
  },
  {
    years: "2016",
    place: "ГБОУ ОШ № 39 г.о. Макеевка",
    note: "селище Осипенко, Горняцький район",
  },
];
