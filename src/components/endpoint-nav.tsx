import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { pages, type PagePath } from "../content/site";

const order: PagePath[] = ["/", "/bio/", "/diss/", "/library/", "/links/", "/ind/"];

/**
 * Site navigation styled as an API's endpoint list. The active item's accent bar
 * carries view-transition-name "active-endpoint", so during a navigation the
 * browser slides it from the old item to the new one. Without JS (or View
 * Transitions) it is a plain list with the active item highlighted.
 */
export function EndpointNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navRef = useRef<HTMLElement>(null);

  // On narrow screens the list is a horizontal strip: keep the active item in view.
  // "nearest" scrolls only as much as needed, and never moves the desktop column.
  useEffect(() => {
    navRef.current
      ?.querySelector('[aria-current="page"]')
      ?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [pathname]);

  return (
    <nav ref={navRef} aria-label="Разделы">
      <ul className="-mx-5 flex scroll-px-5 gap-1 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-col md:overflow-visible md:px-0">
        {order.map((path) => (
          <li key={path} className="shrink-0">
            <Link
              to={path}
              activeOptions={{ exact: true }}
              className="group relative flex items-baseline gap-3 rounded-md px-3 py-2 no-underline md:grid md:grid-cols-[5.25rem_1fr]"
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <>
                      {/* the box is static: View Transition layers paint above the live page,
                          so a moving filled box would cover the labels mid-animation */}
                      <span className="absolute inset-0 rounded-md bg-surface ring-1 ring-rule" />
                      {/* only this thin bar moves (bottom edge on mobile, left edge on desktop) */}
                      <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-stamp [view-transition-name:active-endpoint] md:inset-x-auto md:top-2 md:bottom-2 md:left-0 md:h-auto md:w-0.5" />
                    </>
                  )}
                  <span className="relative font-mono text-sm text-muted group-hover:text-ink">
                    {pages[path].endpoint}
                  </span>
                  <span
                    className={`relative text-sm ${isActive ? "text-ink" : "text-muted group-hover:text-ink"}`}
                  >
                    {pages[path].label}
                  </span>
                </>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
