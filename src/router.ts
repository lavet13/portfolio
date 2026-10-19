import { createRouter, type RouterHistory } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

type MakeRouterOpts = {
  basepath?: string;
  history?: RouterHistory;
  isServer?: boolean;
};

/**
 * Builds the router. Shared by main.tsx (browser) and entry-server.tsx (prerender)
 * so both sides produce the same tree and options; each passes its own history/basepath.
 */
export function makeRouter(opts: MakeRouterOpts = {}) {
  return createRouter({
    routeTree,
    trailingSlash: "always",
    // browser-native View Transitions: snapshot the old page, wait until the new one
    // has rendered, then cross-fade. Unsupported browsers just switch instantly.
    defaultViewTransition: true,
    ...opts,
  });
  // trailingSlash 'always' - links become /bio/ (the directory form), so the server never needs the /bio -> /bio/ redirect hop
}

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof makeRouter>;
  }
}
