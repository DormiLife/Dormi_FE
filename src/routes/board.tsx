import { BoardPage } from "@/pages/board/BoardPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/board")({
  component: BoardPage,
});
