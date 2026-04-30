"use client"

import { useState } from "react"
import Link from "next/link"
import { Star } from "lucide-react"
import { Card } from "@/components/ui/card"

interface TopicCardProps {
  id: string
  title: string
  imageUrl: string | null
  category: { name: string; emoji: string }
  index: number
  favorited: boolean
}

const STYLES = [
  "bg-gradient-to-br from-secondary via-secondary to-amber-300 text-black",
  "bg-gradient-to-br from-white via-white to-neutral-200 text-black",
  "bg-gradient-to-br from-card via-neutral-800 to-black text-white border border-white/20",
]

export function TopicCard({
  id,
  title,
  imageUrl,
  category,
  index,
  favorited: initialFavorited,
}: TopicCardProps) {
  const bg = STYLES[index % STYLES.length]
  const [favorited, setFavorited] = useState(initialFavorited)

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const next = !favorited
    setFavorited(next)
    try {
      const res = await fetch(`/api/topics/${id}/favorite`, { method: "POST" })
      if (!res.ok) throw new Error("failed")
      const data = (await res.json()) as { favorited: boolean }
      setFavorited(data.favorited)
    } catch {
      setFavorited(!next)
    }
  }

  return (
    <Link href={`/topics/${id}`} className="mb-3 block break-inside-avoid">
      <Card
        className={`relative overflow-hidden ${bg} flex flex-col transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-xl hover:shadow-2xl ring-1 ring-black/10`}
      >
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt=""
            className="block h-auto w-full"
            draggable={false}
          />
        )}
        <button
          type="button"
          onClick={toggleFavorite}
          aria-label={favorited ? "Unfavorite" : "Favorite"}
          aria-pressed={favorited}
          style={{ color: "#974fff" }}
          className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-colors hover:bg-white"
        >
          <Star
            className="h-4 w-4"
            strokeWidth={2.5}
            fill={favorited ? "#974fff" : "none"}
          />
        </button>
        <div className="flex flex-1 flex-col items-center justify-center gap-2 p-3 text-center">
          <h3 className="text-base font-semibold leading-tight tracking-tight">
            {title}
          </h3>
          <span className="inline-flex items-center gap-1 rounded-full bg-black/15 px-2 py-0.5 text-xs font-medium backdrop-blur-sm">
            <span>{category.emoji}</span>
            <span>{category.name}</span>
          </span>
        </div>
      </Card>
    </Link>
  )
}
