import { PostDetailPage } from "@/pages/board/PostDetailPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/board_/$postId")({
  component: PostDetailPage,
});
