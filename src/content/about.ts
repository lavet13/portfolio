/**
 * Texts about the author's own work. Kept apart from the pages so the template
 * branch can hold placeholders here while main keeps the real texts.
 * No imports: site.ts imports this file, so importing site.ts back would be circular.
 */
export const about = {
  /** Home page, after "Магистрант ДонНТУ." */
  intro: "Пишу на TypeScript и поддерживаю в продакшене Telegram-бот и веб-приложение службы доставки «Наша Почта».",
  /** One sentence for the home page's meta description. */
  thesisSummary: "Тема магистерской работы — разработка REST API на примере сервиса отслеживания грузов.",
  /** The /ind/ page's meta description. */
  projectsDescription: "Индивидуальный раздел: проекты в продакшене — Telegram-бот и веб-приложение службы доставки, миграция legacy PHP на Node.js.",
  /** /bio/, "Самообразование". [[…]] parts render as placeholders. */
  selfStudy: "JavaScript и TypeScript изучил самостоятельно, на реальных задачах: сначала поддержка legacy-кода на PHP, затем перенос форм заказа на Node.js и разработка Telegram-бота. [[Курсы, сертификаты — если есть]]",
};
