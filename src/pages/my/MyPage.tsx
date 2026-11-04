import { useNavigate } from "@tanstack/react-router";
import { BottomNav } from "@/components/layout/BottomNav";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageLayout } from "@/components/layout/PageLayout";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ListRow } from "@/components/ui/ListRow";
import { Bell, CalendarDays, LogOut, MessageCircle, User, UserX } from "lucide-react";
import { useState } from "react";

// TODO: API 연동 시 교체
const user = {
  nickname: "민트",
  name: "김민지",
  room: "301호",
  unreadNotifications: 2,
};

export function MyPage() {
  const navigate = useNavigate();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  return (
    <PageLayout
      header={<PageHeader title="마이페이지" centered />}
      bottomNav={<BottomNav active="my" />}
    >
      <div className="flex flex-col gap-3">
        <Card>
          <div className="flex items-center gap-3.5">
            <Avatar name={user.nickname} solid size="lg" />
            <div className="min-w-0 flex-1">
              <p className="text-lg font-bold text-ink">{user.nickname}</p>
              <p className="inline-flex items-center gap-2 text-sm text-ink-mute">
                <span>{user.room}</span>
                <span aria-hidden="true" className="h-3 w-[1.5px] bg-ink-mute/50" />
                <span>{user.name}</span>
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3 border-t border-line pt-4">
            <User className="size-6 shrink-0 text-ink-sub" />
            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold text-ink">내 정보</p>
              <p className="inline-flex items-center gap-2 text-sm text-ink-mute">
                <span>별명</span>
                <span aria-hidden="true" className="h-3 w-[1.5px] bg-ink-mute/50" />
                <span>호실</span>
                <span aria-hidden="true" className="h-3 w-[1.5px] bg-ink-mute/50" />
                <span>전화번호</span>
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-2 border-primary/60"
              onClick={() => navigate({ to: "/my/edit" })}
            >
              수정
            </Button>
          </div>
        </Card>

        <Card padded={false} className="divide-y divide-line overflow-hidden">
          <ListRow
            icon={<MessageCircle className="size-[22px] text-ink-sub" />}
            title={<span className="font-normal">내가 쓴 글 · 좋아요한 글</span>}
            onClick={() => undefined} // TODO: 내 활동 화면 이동
          />
          <ListRow
            icon={<CalendarDays className="size-6 text-ink-sub" />}
            title={<span className="font-normal">내 회의실 예약</span>}
            onClick={() => navigate({ to: "/my/reservations" })}
          />
          <ListRow
            icon={<Bell className="size-6 text-ink-sub" />}
            title={<span className="font-normal">알림</span>}
            right={
              user.unreadNotifications > 0 && (
                <Badge
                  tone="red"
                  className="min-w-7 justify-center px-2.5 py-0.5 text-sm leading-tight"
                >
                  {user.unreadNotifications}
                </Badge>
              )
            }
            onClick={() => undefined} // TODO: 알림 화면 이동
          />
        </Card>

        <Card padded={false} className="divide-y divide-line overflow-hidden">
          <ListRow
            icon={<LogOut className="size-6 text-ink-sub" />}
            title={<span className="font-normal">로그아웃</span>}
            onClick={() => setLogoutOpen(true)}
          />
          <ListRow
            icon={<UserX className="size-6 text-danger" />}
            title={<span className="font-normal">회원 탈퇴</span>}
            danger
            onClick={() => setWithdrawOpen(true)}
          />
        </Card>
      </div>

      <ConfirmModal
        open={logoutOpen}
        tone="primary"
        title="로그아웃할까요?"
        description="다시 로그인하면 바로 이용할 수 있어요."
        confirmLabel="로그아웃"
        onCancel={() => setLogoutOpen(false)}
        onConfirm={() => setLogoutOpen(false)} // TODO: 로그아웃 처리
      />

      <ConfirmModal
        open={withdrawOpen}
        title="정말 탈퇴할까요?"
        description={
          <>
            탈퇴하면 계정을 다시 되돌릴 수 없어요. 작성한 글과 이용 기록은
            삭제되지 않고 '탈퇴한 회원'으로 남아요.
          </>
        }
        confirmLabel="탈퇴하기"
        onCancel={() => setWithdrawOpen(false)}
        onConfirm={() => setWithdrawOpen(false)} // TODO: 탈퇴 처리
      />
    </PageLayout>
  );
}
