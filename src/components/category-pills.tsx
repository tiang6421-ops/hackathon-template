"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Star } from "lucide-react"

interface Category {
  id: string
  name: string
  emoji: string
}

interface CategoryPillsProps {
  categories: Category[]
}

export const FAVORITES_FILTER = "favorites"

export function CategoryPills({ categories }: CategoryPillsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selected = searchParams.get("cat") ?? ""

  const setCat = (id: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (id) params.set("cat", id)
    else params.delete("cat")
    const qs = params.toString()
    router.replace(qs ? `/topics?${qs}` : "/topics")
  }

  return (
    <div className="hide-scrollbar mb-4 flex gap-2 overflow-x-auto pb-1">
      <button
        type="button"
        onClick={() => setCat("")}
        className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition ${
          selected === ""
            ? "bg-black text-white"
            : "bg-black/5 text-foreground hover:bg-black/10"
        }`}
      >
        All
      </button>
      <button
        type="button"
        onClick={() => setCat(FAVORITES_FILTER)}
        className={`inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition ${
          selected === FAVORITES_FILTER
            ? "bg-[#974fff] text-white"
            : "bg-black/5 text-foreground hover:bg-black/10"
        }`}
      >
        <Star
          className="h-4 w-4"
          strokeWidth={2.5}
          fill="#974fff"
          color={selected === FAVORITES_FILTER ? "#ffffff" : "#974fff"}
        />
        Favorites
      </button>
      {categories.map((c) => {
        const active = selected === c.id
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => setCat(c.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition ${
              active
                ? "bg-black text-white"
                : "bg-black/5 text-foreground hover:bg-black/10"
            }`}
          >
            <span className="mr-1">{c.emoji}</span>
            {c.name}
          </button>
        )
      })}
    </div>
  )
}
