import * as React from "react";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <div className="p-2 flex gap-2 text-lg">
        <Link
          to="/"
          activeProps={{
            className: "font-bold",
          }}
          activeOptions={{ exact: true }}
        >
          Home
        </Link>{" "}
        <Link
          to="/library/"
          activeProps={{
            className: "font-bold",
          }}
        >
          Library
        </Link>
        <Link
          to="/bio/"
          activeProps={{
            className: "font-bold",
          }}
        >
          BIOGRAPHY
        </Link>
        <Link
          to="/ind/"
          activeProps={{
            className: "font-bold",
          }}
        >
          Ind
        </Link>
        <Link
          to="/diss/"
          activeProps={{
            className: "font-bold",
          }}
        >
          Diss
        </Link>
      </div>
      <hr />
      <Outlet />
    </React.Fragment>
  );
}
