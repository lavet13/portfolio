import { Link } from "@tanstack/react-router";
import { LayoutGroup, motion } from "motion/react";
import { pages, type PagePath } from "../content/site";

const order: PagePath[] = ["/", "/bio/", "/diss/", "/library/", "/links/", "/ind/"];

/**
 * Site navigation styled as an API's endpoint list. The highlight slides to the
 * new item on click (Motion layoutId), which shows what changed. Without JS
 * it is a plain list of links with the active item already highlighted.
 */
export function EndpointNav() {
  return (
    <nav aria-label="Разделы">
      <LayoutGroup>
        <ul className="-mx-5 flex gap-1 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-col md:overflow-visible md:px-0">
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
                      <motion.span
                        layoutId="active-endpoint"
                        className="absolute inset-0 rounded-md bg-surface ring-1 ring-rule"
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                      />
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
      </LayoutGroup>
    </nav>
  );
}
