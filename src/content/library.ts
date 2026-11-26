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
    authors: "[[Фамилия И. О.]]",
    title: "[[Название статьи]]",
    source: "[[Журнал или конференция, год, страницы]]",
  },
  {
    authors: "[[Фамилия И. О.]]",
    title: "[[Название статьи]]",
    source: "[[Журнал или конференция, год, страницы]]",
  },
];
