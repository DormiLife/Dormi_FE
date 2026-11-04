import { MyActivityPage } from "@/pages/my/MyActivityPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/my_/activity")({
  component: MyActivityPage,
});
