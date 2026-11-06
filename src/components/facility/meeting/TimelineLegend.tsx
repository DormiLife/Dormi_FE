const items = [
  { label: '예약 가능', swatch: 'bg-surface ring-1 ring-ink-mute/40 ring-inset' },
  { label: '지난 시간', swatch: 'bg-muted' },
  { label: '예약됨', swatch: 'bg-slate-700' },
  { label: '내 예약', swatch: 'bg-primary' },
  { label: '선택', swatch: 'bg-primary-soft ring-2 ring-primary ring-inset' },
]

/** 타임라인 카드 하단의 색 안내 */
export function TimelineLegend() {
  return (
    <ul className="mx-3 flex flex-wrap gap-x-2.5 gap-y-1 border-t border-line pt-3 text-xs text-ink-sub">
      {items.map(({ label, swatch }) => (
        <li key={label} className="inline-flex items-center gap-1">
          <span className={`size-3 rounded-[3px] ${swatch}`} aria-hidden="true" />
          {label}
        </li>
      ))}
    </ul>
  )
}
