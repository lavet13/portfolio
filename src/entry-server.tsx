import { renderToString } from "react-dom/server";
import { makeRouter } from "./router";
import { createMemoryHistory, RouterProvider } from "@tanstack/react-router";

export const SENTINEL = "/__BASE__"; // fake basepath: every internal href comes out as /__BASE__/... so the prerender step can find and rewrite them exactly

export async function render(path: string) {
  const router = makeRouter({
    basepath: SENTINEL,
    history: createMemoryHistory({ initialEntries: [SENTINEL + path] }), // in-memory URL; Node has no window.location
    isServer: true,
  });
  await router.load(); // resolve matches + lazy chunks before rendering
  return renderToString(<RouterProvider router={router} />);
}

/** Every route path in the tree ("/", "/bio", ...), for the prerender loop.
 * A fresh router, because only its route index is needed.
*/
export function paths() {
  return Object.keys(makeRouter().routesByPath);
}
