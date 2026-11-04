import { MealRow } from '@/components/meal/MealRow'
import { WeekCalendar } from '@/components/meal/WeekCalendar'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageLayout } from '@/components/layout/PageLayout'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import {
  formatFullDate,
  getWeekDays,
  isSameDay,
  startOfDay,
  type Meal,
} from '@/lib/meal'
import { useNavigate } from '@tanstack/react-router'
import { UtensilsCrossed } from 'lucide-react'
import { useState } from 'react'

// TODO: API 연동 시 교체. 지금은 날짜별로 돌려쓰는 임시 데이터이고,
// 아직 크롤링되지 않은 상황을 흉내 내려고 이번 주 이후 날짜는 식단 없음으로 둔다.
const sampleMeals: Meal[][] = [
  [
    { type: 'breakfast', menus: ['백미밥', '미역국', '계란말이', '김치', '우유'] },
    { type: 'lunch', menus: ['제육볶음', '된장국', '잡곡밥', '배추김치', '샐러드'] },
    { type: 'dinner', menus: ['닭갈비', '계란국', '흑미밥', '깍두기', '과일'] },
  ],
  [
    { type: 'breakfast', menus: ['잡곡밥', '북엇국', '감자볶음', '김치', '요거트'] },
    { type: 'lunch', menus: ['돈까스', '미소국', '쌀밥', '단무지', '양배추샐러드'] },
    { type: 'dinner', menus: ['순두부찌개', '쌀밥', '계란후라이', '깍두기', '과일'] },
  ],
]

function getMeals(date: Date, today: Date): Meal[] {
  if (date > getWeekDays(today)[6]) return []
  return sampleMeals[date.getDate() % sampleMeals.length]
}

export function MealPage() {
  const navigate = useNavigate()
  const [today] = useState(() => startOfDay(new Date()))
  const [selectedDate, setSelectedDate] = useState(today)

  const meals = getMeals(selectedDate, today)

  return (
    <PageLayout
      header={
        <PageHeader
          title="주간 식단"
          centered
          onBack={() => navigate({ to: '/' })}
        />
      }
      className="space-y-3"
    >
      <WeekCalendar selectedDate={selectedDate} today={today} onSelect={setSelectedDate} />

      <h2 className="flex items-center gap-2 px-0.5 pt-1 text-lg font-bold text-ink">
        {formatFullDate(selectedDate)}
        {isSameDay(selectedDate, today) && <Badge tone="blue">오늘</Badge>}
      </h2>

      {meals.length > 0 ? (
        <ul className="space-y-2">
          {meals.map((meal) => (
            <li key={meal.type}>
              <MealRow {...meal} variant="card" />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={<UtensilsCrossed />}
          title="등록된 식단이 없어요"
          description="다른 날짜를 선택해 보세요."
          className="py-12"
        />
      )}
    </PageLayout>
  )
}
