import { useNavigate } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageLayout } from "@/components/layout/PageLayout";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Tabs } from "@/components/ui/Tabs";
import {
  formatReservationDate,
  initialMyReservations,
  type MyReservation,
  type ReservationStatus,
} from "@/lib/reservations";

type Tab = "upcoming" | "past";

const statusBadge: Record<ReservationStatus, { label: string; tone: BadgeTone }> =
  {
    inUse: { label: "이용 중", tone: "blue" },
    upcoming: { label: "예약 완료", tone: "green" },
    done: { label: "이용 완료", tone: "gray" },
    cancelled: { label: "취소됨", tone: "red" },
  };

export function MyReservationsPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("upcoming");
  const [reservations, setReservations] = useState<MyReservation[]>(
    initialMyReservations,
  );
  const [cancelTarget, setCancelTarget] = useState<MyReservation | null>(null);

  const isActive = (r: MyReservation) =>
    r.status === "upcoming" || r.status === "inUse";
  const upcoming = reservations.filter(isActive);
  const past = reservations.filter((r) => !isActive(r));
  const list = tab === "upcoming" ? upcoming : past;

  const handleCancel = () => {
    if (!cancelTarget) return;
    // TODO: 예약 취소 API 연동
    setReservations((prev) =>
      prev.map((r) =>
        r.id === cancelTarget.id ? { ...r, status: "cancelled" } : r,
      ),
    );
    setCancelTarget(null);
  };

  return (
    <PageLayout
      header={
        <PageHeader
          title="내 회의실 예약"
          centered
          onBack={() => navigate({ to: "/my" })}
        />
      }
      flush
    >
      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { value: "upcoming", label: `예약 ${upcoming.length}` },
          { value: "past", label: `지난 예약 ${past.length}` },
        ]}
      />

      {list.length === 0 ? (
        <EmptyState
          icon={<CalendarDays />}
          title={
            tab === "upcoming" ? "예약이 없어요" : "지난 예약이 없어요"
          }
        />
      ) : (
        <ul className="flex flex-col gap-3 px-4 py-4">
          {list.map((reservation) => {
            const { label, tone } = statusBadge[reservation.status];
            const isPast = !isActive(reservation);
            return (
              <li key={reservation.id}>
                <Card padded={false} className="overflow-hidden">
                  <div className="flex items-start justify-between gap-3 p-5">
                    <div className="min-w-0">
                      <p
                        className={
                          isPast
                            ? "text-base font-bold text-ink-sub"
                            : "text-base font-bold text-ink"
                        }
                      >
                        {formatReservationDate(reservation.date)}
                      </p>
                      <p className="mt-0.5 text-sm text-ink-mute">
                        {reservation.start} ~ {reservation.end}
                      </p>
                    </div>
                    <Badge tone={tone} size="sm">
                      {label}
                    </Badge>
                  </div>
                  {reservation.status === "upcoming" && (
                    <button
                      type="button"
                      onClick={() => setCancelTarget(reservation)}
                      className="w-full border-t border-line py-3 text-center text-sm font-semibold text-danger hover:bg-danger-soft"
                    >
                      예약 취소
                    </button>
                  )}
                </Card>
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmModal
        open={cancelTarget !== null}
        title="예약을 취소할까요?"
        description={
          cancelTarget && (
            <>
              {formatReservationDate(cancelTarget.date)} {cancelTarget.start} ~{" "}
              {cancelTarget.end} 예약이 취소돼요.
            </>
          )
        }
        cancelLabel="닫기"
        confirmLabel="예약 취소"
        onCancel={() => setCancelTarget(null)}
        onConfirm={handleCancel}
      />
    </PageLayout>
  );
}
