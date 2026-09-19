import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tracks")({
  component: TracksLayout,
});

function TracksLayout() {
  return <Outlet />;
}
