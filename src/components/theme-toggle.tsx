/**
 * Flips between light and dark and remembers the choice. Before any choice the
 * site follows the system setting via CSS, so this works without JS too; the
 * inline script in index.html re-applies a stored choice before first paint.
 */
export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const isDark =
      root.classList.contains("dark") ||
      (!root.classList.contains("light") && matchMedia("(prefers-color-scheme: dark)").matches);
    const next = isDark ? "light" : "dark";
    root.classList.remove("light", "dark");
    root.classList.add(next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // storage blocked (private mode, file:// in some browsers): the choice lasts this visit only
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Сменить тему"
      className="rounded-md p-2 text-muted hover:text-ink"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.75" />
        <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />
      </svg>
    </button>
  );
}
