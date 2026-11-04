import { MealRow } from '@/components/meal/MealRow'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import type { Meal } from '@/lib/meal'

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
        actionLabel="주간 식단"
        actionIconOnly
        onAction={onViewWeek}
      />
      <ul className="mt-4 space-y-2">
        {meals.map((meal) => (
          <li key={meal.type}>
            <MealRow {...meal} />
          </li>
        ))}
      </ul>
    </Card>
  )
}
