"use client"

import { useState } from "react"
import { Star } from "lucide-react"

interface TopicHeaderProps {
  topicId: string
  name: string
  emoji: string
  imageUrl?: string | null
  initialFavorited: boolean
}

export function TopicHeader({
  topicId,
  name,
  emoji,
  imageUrl,
  initialFavorited,
}: TopicHeaderProps) {
  const [favorited, setFavorited] = useState(initialFavorited)
  const [pending, setPending] = useState(false)

  const toggle = async () => {
    if (pending) return
    const next = !favorited
    setFavorited(next)
    setPending(true)
    try {
      const res = await fetch(`/api/topics/${topicId}/favorite`, {
        method: "POST",
      })
      if (!res.ok) throw new Error("failed")
      const data = (await res.json()) as { favorited: boolean }
      setFavorited(data.favorited)
    } catch {
      setFavorited(!next)
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex min-w-0 items-center gap-2">
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt=""
          className="h-7 w-7 shrink-0 rounded-full object-cover ring-1 ring-white/30"
        />
      ) : (
        <span className="text-base" aria-hidden>
          {emoji}
        </span>
      )}
      <p className="min-w-0 truncate text-sm font-semibold text-white">
        {name}
      </p>
      <button
        type="button"
        onClick={toggle}
        aria-label={favorited ? "Unfavorite topic" : "Favorite topic"}
        aria-pressed={favorited}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-secondary transition hover:bg-white/10 active:scale-95"
      >
        <Star
          className="h-4 w-4"
          strokeWidth={2.5}
          fill={favorited ? "currentColor" : "none"}
        />
      </button>
    </div>
  )
}
