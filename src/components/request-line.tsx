import { useRouter, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

/**
 * The site's one signature detail: every navigation is shown as the HTTP
 * exchange it stands for, "GET /bio/  200 OK  14 мс". The time is real:
 * measured from the router's onBeforeNavigate to onRendered. The first
 * (prerendered) load has no client navigation to time, so no ms is shown and
 * nothing animates; the static HTML and the first client render match.
 */
export function RequestLine() {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [ms, setMs] = useState<number | null>(null);
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    const offStart = router.subscribe("onBeforeNavigate", () => {
      startedAt.current = performance.now();
    });
    const offDone = router.subscribe("onRendered", () => {
      if (startedAt.current === null) return;
      setMs(Math.max(1, Math.round(performance.now() - startedAt.current)));
      startedAt.current = null;
    });
    return () => {
      offStart();
      offDone();
    };
  }, [router]);

  return (
    <p className="flex items-baseline gap-4 font-mono text-sm" aria-live="polite">
      <span className="text-stamp">GET</span>
      <span className="text-ink">{pathname}</span>
      {/* key remounts the span per navigation, restarting its CSS animation;
          the class is only added once a client navigation has been timed */}
      <span key={pathname} className={`text-ok ${ms === null ? "" : "animate-status-in"}`}>
        200 OK
        {ms !== null && <span className="ml-4 text-muted">{ms} мс</span>}
      </span>
    </p>
  );
}
