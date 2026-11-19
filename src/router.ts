import { createRouter, type RouterHistory } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { pageOrder } from "./content/site";

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
    // has rendered, then animate between them. Unsupported browsers just switch instantly.
    defaultViewTransition: {
      types: ({ fromLocation, toLocation, pathChanged }) => {
        if (!fromLocation || !pathChanged) return false; // first load, or only the #hash changed: no transition
        const from = pageOrder.findIndex(p => p === fromLocation.pathname);
        const to = pageOrder.findIndex(p => p === toLocation.pathname);
        if (from === -1 || to === -1) return []; // to or from the 404 page: the plain fade
        return [to > from ? "forward" : "back"]; // down the nav list, or up it
      },
    },
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
