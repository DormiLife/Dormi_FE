import { BoardPreviewCard } from '@/components/home/BoardPreviewCard'
import type { BoardPost } from '@/lib/board'
import { FacilityStatusCard } from '@/components/home/FacilityStatusCard'
import { MyUsageCard, type UsageItem } from '@/components/home/MyUsageCard'
import { TodayMealCard } from '@/components/home/TodayMealCard'
import type { Meal } from '@/lib/meal'
import { BottomNav } from '@/components/layout/BottomNav'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageLayout } from '@/components/layout/PageLayout'
import type { Reservation } from '@/lib/timeSlots'
import { useNavigate } from '@tanstack/react-router'
import { Bell, CalendarDays, House, Link, WashingMachine } from 'lucide-react'
import { Card } from '@/components/ui/Card'

const meals: Meal[] = [
  { type: 'breakfast', menus: ['백미밥', '미역국', '계란말이', '김치', '우유'] },
  { type: 'lunch', menus: ['제육볶음', '된장국', '잡곡밥', '배추김치', '샐러드'] },
  { type: 'dinner', menus: ['닭갈비', '계란국', '흑미밥', '깍두기', '과일'] },
]

const reservations: Reservation[] = [
  { start: '11:00', end: '12:00' },
  { start: '14:00', end: '15:30' },
  { start: '20:00', end: '21:00' },
]

const posts: BoardPost[] = [
  { id: '1', category: 'question', title: '세탁기 이용 시간은 어떻게 되나요?', author: '코코', date: '10/27' },
  { id: '2', category: 'info', title: '기숙사 주변 편의시설 공유해요!', author: '하늘', date: '10/26' },
  { id: '3', category: 'general', title: '이번 주말 같이 공부하실 분 계세요?', author: '라떼', date: '10/25' },
]

export function HomePage() {
  const navigate = useNavigate();

  const usageItems: UsageItem[] = [
    {
      id: 'washer',
      icon: <WashingMachine />,
      title: '세탁기 2번 이용 중',
      description: '22:10 완료 예정',
      onClick: () => undefined,
    },
    {
      id: 'meeting-room',
      icon: <CalendarDays />,
      title: '회의실 예약',
      description: '10월 28일 (수) 14:00 ~ 15:00',
      onClick: () => navigate({ to: '/my/reservations' }),
    },
  ]

  return (
    <PageLayout
      header={
        <PageHeader
          logo={<House className="size-8 text-primary" />}
          title="DORMI"
          right={
            <button
              type="button"
              aria-label="알림"
              className="relative flex size-10 items-center justify-center text-ink"
            >
              <Bell className="size-6" />
              <span className="absolute top-2 right-2 size-2.5 rounded-full bg-danger" />
            </button>
          }
        />
      }
      bottomNav={<BottomNav active="home" />}
      className="space-y-4"
    >
      <TodayMealCard
        date="10월 27일 (화)"
        meals={meals}
        onViewWeek={() => navigate({ to: '/meal' })}
      />
      <FacilityStatusCard
        washers={{ available: 4, total: 6 }}
        dryers={{ available: 3, total: 4 }}
        reservations={reservations}
      />
      <MyUsageCard items={usageItems} />
      <BoardPreviewCard
        posts={posts}
        onViewMore={() => navigate({ to: '/board' })}
        onPostClick={(postId) =>
          navigate({ to: '/board/$postId', params: { postId } })
        }
      />
      <Card className="flex items-center gap-4 px-5 py-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Link className="size-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-bold text-ink">기숙사 공식 홈페이지</h2>
          <div className="text-sm text-ink-mute">
            공지사항과 행정 안내를 확인하세요.
          </div>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-control border border-primary bg-white px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary-soft"
          onClick={() => window.open('https://www.ndhs.or.kr/site/main/home', '_blank', 'noopener, noreferrer')}
        >
          바로가기
        </button>
      </Card>
    </PageLayout>
  )
}