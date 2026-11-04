interface BoardPostMetaProps {
  date: string
  author: string
}

/** "날짜 | 별명" — 구분선은 글자 높이에 맞춘 짧은 선 */
export function BoardPostMeta({ date, author }: BoardPostMetaProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <span>{date}</span>
      <span aria-hidden="true" className="h-2.5 w-[1.5px] bg-ink-mute/50" />
      <span>{author}</span>
    </span>
  )
}
