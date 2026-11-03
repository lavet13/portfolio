import { useEffect, useState } from "react";
import { cn } from "../lib/utils";

/** How far down (px) the page must be scrolled before the button appears. */
const SHOW_AFTER = 600;

/**
 * Telegram-style "Наверх": once the page is scrolled, the whole strip left of the content
 * is one button that scrolls back to the top. Below xl there is no strip to fill, so it's a
 * round button in the bottom-right corner instead.
 */
export function GoUp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function update() {
      setVisible(scrollY > SHOW_AFTER); // same value as before: React skips the re-render
    }
    update();
    addEventListener("scroll", update, { passive: true });
    return () => removeEventListener("scroll", update);
  }, []);

  function goUp() {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    scrollTo({ top: 0, behavior: reduce ? "instant" : "smooth" });
  }

  return (
    <button
      type="button"
      onClick={goUp}
      aria-label="Наверх"
      inert={!visible} // hidden: out of the tab order and invisible to screen readers
      className={cn(
        // phones and tablets: a round button in the corner
        "fixed right-4 bottom-4 z-10 flex size-11 items-center justify-center rounded-full bg-surface text-muted shadow-md ring-1 ring-rule transition-opacity hover:text-ink hover:cursor-pointer",
        // xl+: the full-height strip left of the content (36rem = half of max-w-6xl)
        "xl:inset-y-0 xl:left-0 xl:size-auto xl:w-[calc(50%-36rem)] xl:items-start xl:justify-start xl:rounded-none xl:bg-transparent xl:pt-10 xl:shadow-none xl:ring-0 xl:hover:bg-ink/5",
        !visible && "pointer-events-none opacity-0",
      )}
    >
      <span className="flex items-center gap-2 xl:pl-6 xl:text-sm">
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path d="m6 15 6-6 6 6" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
        {/* the label only where the strip is wide enough for it */}
        <span className="hidden min-[90rem]:inline">Наверх</span>
      </span>
    </button>
  );
}
