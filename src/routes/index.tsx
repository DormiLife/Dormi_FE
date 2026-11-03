import { LoginPage } from "@/pages/auth/LoginPage";
import { ComponentPreview } from "@/pages/ComponentPreview";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: ComponentPreview,
});