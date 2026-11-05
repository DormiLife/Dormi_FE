import { parseFacilityTab, type FacilityTab } from "@/lib/facility";
import { FacilityPage } from "@/pages/facility/FacilityPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/facility")({
  // 탭을 쿼리로 두면 홈에서 바로 해당 탭으로 보낼 수 있다 (/facility?tab=meeting)
  validateSearch: (search: Record<string, unknown>): { tab?: FacilityTab } => ({
    tab: search.tab === undefined ? undefined : parseFacilityTab(search.tab),
  }),
  component: FacilityPage,
});
