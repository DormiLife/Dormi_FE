import { mealMeta, type Meal } from '@/lib/meal'
import { cn } from '@/lib/utils'

interface MealRowProps extends Meal {
  /** canvas: 카드 안의 회색 행(홈), card: 단독 흰색 카드(주간 식단) */
  variant?: 'canvas' | 'card'
}

export function MealRow({ type, menus, variant = 'canvas' }: MealRowProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3.5 px-4 py-3.5',
        variant === 'canvas'
          ? 'rounded-xl bg-canvas'
          : 'rounded-card border border-line bg-surface',
      )}
    >
      <p className={cn('w-12 shrink-0 font-bold', mealMeta[type].color)}>
        {mealMeta[type].label}
      </p>
      <span className="min-w-0 text-[15px] break-keep text-ink">
        {menus.join(', ')}
      </span>
    </div>
  )
}
