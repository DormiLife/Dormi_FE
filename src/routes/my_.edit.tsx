import { EditProfilePage } from "@/pages/my/EditProfilePage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/my_/edit")({
  component: EditProfilePage,
});
