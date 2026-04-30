import Link from "next/link"
import { Card } from "@/components/ui/card"

interface TopicCardProps {
  id: string
  name: string
  emoji: string
  category?: string | null
  imageUrl?: string | null
  questionCount: number
  index: number
}

const STYLES = [
  {
    bg: "bg-gradient-to-br from-secondary via-secondary to-amber-300 text-black",
    muted: "text-black/60",
  },
  {
    bg: "bg-gradient-to-br from-white via-white to-neutral-200 text-black",
    muted: "text-black/60",
  },
  {
    bg: "bg-gradient-to-br from-card via-neutral-800 to-black text-white border border-white/20",
    muted: "text-white/60",
  },
]

export function TopicCard({
  id,
  name,
  emoji,
  category,
  imageUrl,
  questionCount,
  index,
}: TopicCardProps) {
  const { bg, muted } = STYLES[index % STYLES.length]

  return (
    <Link href={`/topics/${id}`} className="mb-3 block break-inside-avoid">
      <Card
        className={`overflow-hidden ${bg} flex flex-col transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-xl hover:shadow-2xl ring-1 ring-black/10 p-0 gap-0`}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt=""
            loading="lazy"
            className="w-full h-auto object-cover"
          />
        ) : (
          <div className="p-4 pb-0 text-4xl">{emoji}</div>
        )}
        <div className="p-4 flex flex-col gap-1">
          {category && (
            <span className="inline-block self-start rounded-full bg-black/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide">
              {emoji} {category}
            </span>
          )}
          <h3 className="font-semibold text-base leading-tight">{name}</h3>
          <p className={`text-xs ${muted}`}>
            {questionCount} {questionCount === 1 ? "question" : "questions"}
          </p>
        </div>
      </Card>
    </Link>
  )
}
