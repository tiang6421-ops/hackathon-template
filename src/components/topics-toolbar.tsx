"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CATEGORIES } from "@/lib/categories"

export function TopicsToolbar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const urlQ = searchParams.get("q") ?? ""
  const urlCategory = searchParams.get("category")

  const [q, setQ] = useState(urlQ)

  // Keep input in sync when URL changes (e.g. back/forward)
  useEffect(() => {
    setQ(urlQ)
  }, [urlQ])

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === null || value === "") params.delete(key)
    else params.set(key, value)
    const qs = params.toString()
    router.replace(qs ? `/topics?${qs}` : "/topics", { scroll: false })
  }

  // Debounce search input → URL
  useEffect(() => {
    if (q === urlQ) return
    const id = setTimeout(() => updateParam("q", q.trim() || null), 250)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search topics..."
            className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
        </div>
        <Button asChild size="lg">
          <Link href="/topics/new">
            <Plus className="size-4" /> New topic
          </Link>
        </Button>
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <PillButton
          active={!urlCategory}
          onClick={() => updateParam("category", null)}
        >
          All
        </PillButton>
        {CATEGORIES.map((c) => (
          <PillButton
            key={c}
            active={urlCategory === c}
            onClick={() => updateParam("category", urlCategory === c ? null : c)}
          >
            {c}
          </PillButton>
        ))}
      </div>
    </div>
  )
}

function PillButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? "border-secondary bg-secondary text-secondary-foreground"
          : "border-border bg-background text-foreground hover:bg-muted"
      }`}
    >
      {children}
    </button>
  )
}
