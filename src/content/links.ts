/** Links for the /links/ page, in groups. Kept apart from the page so template and main can differ here. */
export type LinkGroup = {
  heading: string;
  links: { title: string; href: string; note: string }[];
};

export const linkGroups: LinkGroup[] = [
  {
    heading: "[[Тема]]",
    links: [
      {
        title: "[[Название ресурса]]",
        href: "https://[[адрес]]",
        note: "[[Чем полезен — одной фразой]]",
      },
    ],
  },
];
