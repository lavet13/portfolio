/**
 * Articles for the /library/ page. Kept apart from the page so template and main
 * can differ here.
 */
export type LibraryEntry = {
  authors: string;
  title: string;
  source: string;
  href?: string;
};

export const libraryEntries: LibraryEntry[] = [
  {
    authors: "Bisbal J., Lawless D., Wu B., Grimson J.",
    title: "Legacy Information Systems: Issues and Directions",
    source: "IEEE Software. 1999. Vol. 16, No. 5. P. 103–111",
    href: "https://doi.org/10.1109/52.795108",
  },
  {
    authors: "Khadka R., Batlajery B. V., Saeidi A. M., Jansen R. L., Hage J.",
    title:
      "How Do Professionals Perceive Legacy Systems and Software Modernization?",
    source:
      "Proceedings of the 36th International Conference on Software Engineering (ICSE 2014). Hyderabad, 2014",
    href: "https://research-portal.uu.nl/en/publications/how-do-professionals-perceive-legacy-systems-and-software-moderni/",
  },
  {
    authors: "Taibi D., Lenarduzzi V., Pahl C.",
    title:
      "Processes, Motivations, and Issues for Migrating to Microservices Architectures: An Empirical Investigation",
    source: "IEEE Cloud Computing. 2017. Vol. 4, No. 5. P. 22–32",
    href: "https://doi.org/10.1109/MCC.2017.4250931",
  },
  {
    authors: "Di Francesco P., Lago P., Malavolta I.",
    title: "Migrating Towards Microservice Architectures: An Industrial Survey",
    source:
      "2018 IEEE International Conference on Software Architecture (ICSA). Seattle, 2018",
    href: "https://doi.org/10.1109/ICSA.2018.00012",
  },
  {
    authors: "Ахтырченко К. В., Сорокваша Т. П.",
    title: "Методы и технологии реинжиниринга ИС",
    source:
      "Труды Института системного программирования РАН. 2003. Т. 4. С. 141–162",
    href: "https://cyberleninka.ru/article/n/metody-i-tehnologii-reinzhiniringa-is",
  },
  {
    authors: "Радостев Д. К., Никитина Е. Ю.",
    title:
      "Стратегия миграции программного кода из монолитной архитектуры в микросервисы",
    source:
      "Вестник Пермского университета. Математика. Механика. Информатика. 2021. Вып. 2 (53). С. 65–68",
    href: "https://doi.org/10.17072/1993-0550-2021-2-65-68",
  },
  {
    authors: "Киринович И. Ф., Аксенчик А. В.",
    title: "Проблемы перехода от монолитной к микросервисной архитектуре",
    source:
      "BIG DATA and Advanced Analytics: сб. науч. ст. VII Междунар. науч.-практ. конф. Минск, 2021. С. 340–342",
    href: "https://libeldoc.bsuir.by/handle/123456789/43874",
  },
];
