import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { cn } from '@/lib/utils'

export type MealType = 'breakfast' | 'lunch' | 'dinner'

const mealMeta: Record<MealType, { label: string; color: string }> = {
  breakfast: { label: '아침', color: 'text-amber-700' },
  lunch: { label: '점심', color: 'text-green-700' },
  dinner: { label: '저녁', color: 'text-purple-muted' },
}

export interface Meal {
  type: MealType
  menus: string[]
}

interface TodayMealCardProps {
  /** 예: '10월 27일 (화)' */
  date: string
  meals: Meal[]
  onViewWeek?: () => void
}

export function TodayMealCard({ date, meals, onViewWeek }: TodayMealCardProps) {
  return (
    <Card>
      <SectionHeader
        title="오늘의 급식"
        description={date}
        actionLabel="이번 주 식단"
        actionIconOnly
        onAction={onViewWeek}
      />
      <ul className="mt-4 space-y-2">
        {meals.map(({ type, menus }) => (
          <li
            key={type}
            className="flex items-center gap-3.5 rounded-xl bg-canvas px-4 py-3.5"
          >
            <p className={cn('w-12 shrink-0 font-bold', mealMeta[type].color)}>
              {mealMeta[type].label}
            </p>
            <span className="min-w-0 text-[15px] break-keep text-ink">
              {menus.join(', ')}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
