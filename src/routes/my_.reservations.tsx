import { MyReservationsPage } from "@/pages/my/MyReservationsPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/my_/reservations")({
  component: MyReservationsPage,
});
