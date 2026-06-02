import { createRootRoute, Outlet } from "@tanstack/react-router";
import { AuthHeader } from "../components/AuthHeader";

export const Route = createRootRoute({
  component: () => (
    <>
      <AuthHeader />
      <Outlet />
    </>
  ),
});
