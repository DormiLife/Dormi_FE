import { MealPage } from "@/pages/meal/MealPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/meal")({
  component: MealPage,
});
