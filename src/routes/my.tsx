import { MyPage } from "@/pages/my/MyPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/my")({
  component: MyPage,
});
