import { PostEditPage } from "@/pages/board/PostEditPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/board_/$postId_/edit")({
  component: PostEditPage,
});
