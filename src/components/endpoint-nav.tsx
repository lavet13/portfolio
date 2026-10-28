import { Link, useRouterState } from "@tanstack/react-router";
import { Collapsible } from "radix-ui";
import { useState } from "react";
import { pages, type PagePath } from "../content/site";
import { cn } from "../lib/utils";

const order: PagePath[] = [
  "/",
  "/bio/",
  "/diss/",
  "/library/",
  "/links/",
  "/ind/",
];

/**
 * Site navigation styled as an API's endpoint list. The active item's accent bar
 * carries view-transition-name "active-endpoint", so during a navigation the
 * browser slides it from the old item to the new one. Without JS (or View
 * Transitions) it is a plain list with the active item highlighted.
 */
export function EndpointNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // .find returns PagePath | undefined: typed, and undefined on the 404 page
  const current = order.find((p) => p === pathname);
  // controlled: we own the open state, so a tapped link can close it
  const [open, setOpen] = useState(false);

  return (
    <nav aria-label="Разделы">
      {/* `hidden` here is Tailwind's display:none CLASS, which md:block can override.
          The HTML hidden ATTRIBUTE couldn't be overridden (preflight's !important). */}
      <div className="hidden md:block">
        <EndpointList />
      </div>

      <Collapsible.Root
        open={open}
        onOpenChange={setOpen}
        className="md:hidden"
      >
        {/* renders a <button> with aria-expanded, aria-controls and data-state="open|closed" */}
        <Collapsible.Trigger className="group flex w-full items-baseline gap-3 rounded-md bg-surface px-3 py-2 text-left ring-1 ring-rule">
          <span className="font-mono text-sm text-muted">
            {current ? pages[current].endpoint : "/?"}
          </span>
          <span className="text-sm text-ink">
            {current ? pages[current].label : "Разделы"}
          </span>
          {/* group-data-[state=open]: → rotate when the `group` ancestor (the button) has data-state="open" */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="ml-auto self-center text-muted transition-transform group-data-[state=open]:rotate-180"
          >
            <path
              d="m6 9 6 6 6-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </Collapsible.Trigger>
        {/* not rendered at all while closed; crawlers still get the links from the desktop list above */}
        <Collapsible.Content className="mt-1">
          <EndpointList onNavigate={() => setOpen(false)} />
        </Collapsible.Content>
      </Collapsible.Root>
    </nav>
  );
}

/**
 * The six endpoints as a column. The active item's accent bar carries
 * view-transition-name "active-endpoint", so on navigation the browser slides it
 * to the new item. onNavigate lets the phone disclosure close after a tap.
 */
function EndpointList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  /** A plain click on the page you're already on does nothing; the phone disclosure still closes. */
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, path: PagePath) {
    const plainClick =
      e.button === 0 && !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey);
    if (plainClick && path === pathname) e.preventDefault();
    onNavigate?.();
  }

  return (
    <ul className="flex flex-col gap-1">
      {order.map((path) => (
        <li key={path}>
          <Link
            to={path}
            activeOptions={{ exact: true }}
            onClick={(e) => handleClick(e, path)}
            className="group relative grid grid-cols-[5.25rem_1fr] items-baseline gap-3 rounded-md px-3 py-2 no-underline"
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <>
                    {/* the box is static: View Transition layers paint above the live page,
                        so a moving filled box would cover the labels mid-animation */}
                    <span className="absolute inset-0 rounded-md bg-surface ring-1 ring-rule" />
                    {/* only this thin bar moves; always the left edge now (no more phone strip) */}
                    <span className="absolute top-2 bottom-2 left-0 w-0.5 rounded-full bg-stamp [view-transition-name:active-endpoint]" />
                  </>
                )}
                <span className="relative font-mono text-sm text-muted group-hover:text-ink">
                  {pages[path].endpoint}
                </span>
                <span
                  className={cn(
                    "relative text-sm",
                    isActive ? "text-ink" : "text-muted group-hover:text-ink",
                  )}
                >
                  {pages[path].label}
                </span>
              </>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
