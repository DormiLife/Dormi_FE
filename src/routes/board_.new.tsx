import { WritePostPage } from "@/pages/board/WritePostPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/board_/new")({
  component: WritePostPage,
});
