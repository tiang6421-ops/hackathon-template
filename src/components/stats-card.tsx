"use client"

import { useCallback, useEffect, useImperativeHandle, useState, forwardRef } from "react"
import { Check, Plus, X } from "lucide-react"
import { Card } from "@/components/ui/card"

interface Option {
  id: string
  text: string
  imageUrl: string | null
}

interface StatsCardProps {
  topicId: string
  options: Option[]
  sessionVotes: Record<string, boolean>
  onAddClick: () => void
}

interface StatOption {
  optionId: string
  text: string
  imageUrl: string | null
  yes: number
  total: number
  percent: number
}

export interface StatsCardHandle {
  reload: () => Promise<void>
}

export const StatsCard = forwardRef<StatsCardHandle, StatsCardProps>(
  function StatsCard({ topicId, options, sessionVotes, onAddClick }, ref) {
    const [stats, setStats] = useState<StatOption[] | null>(null)
    const [error, setError] = useState<string | null>(null)

    const loadStats = useCallback(async () => {
      try {
        const res = await fetch(`/api/topics/${topicId}/stats`)
        const data = await res.json()
        if (data.error) {
          setError(data.error)
          return
        }
        setStats(data.options)
      } catch {
        setError("failed to load")
      }
    }, [topicId])

    useEffect(() => {
      void loadStats()
    }, [loadStats])

    useImperativeHandle(ref, () => ({ reload: loadStats }), [loadStats])

    const statsById = new Map(stats?.map((s) => [s.optionId, s]) ?? [])
    const yesPicks = options.filter((o) => sessionVotes[o.id] === true)
    const noPicks = options.filter((o) => sessionVotes[o.id] === false)
    const hasAnyVote = yesPicks.length > 0 || noPicks.length > 0

    return (
      <Card className="hide-scrollbar h-full w-full overflow-y-auto rounded-3xl border-0 bg-secondary p-6 text-secondary-foreground shadow-2xl">
        <h3 className="mb-1 text-lg font-semibold">Your Result</h3>
        <p className="mb-6 text-sm text-secondary-foreground/70">
          {hasAnyVote
            ? "Based on your yes / no swipes this round"
            : "Swipe through the options to see your result"}
        </p>

        {hasAnyVote && (
          <div className="mb-6 space-y-4">
            {yesPicks.length > 0 && (
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-green-600">
                  <Check className="h-4 w-4" strokeWidth={3} />
                  You said YES
                </div>
                <div className="space-y-2">
                  {yesPicks.map((opt) => {
                    const s = statsById.get(opt.id)
                    return (
                      <div
                        key={opt.id}
                        className="flex items-center gap-3 rounded-xl border border-green-300/50 bg-green-50 px-3 py-2"
                      >
                        {opt.imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={opt.imageUrl}
                            alt=""
                            className="h-10 w-10 shrink-0 rounded-md object-cover"
                          />
                        )}
                        <span className="flex-1 truncate text-sm font-medium text-zinc-900">
                          {opt.text}
                        </span>
                        {s && (
                          <span className="shrink-0 text-xs tabular-nums text-zinc-600">
                            {s.percent}% overall
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {noPicks.length > 0 && (
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-600">
                  <X className="h-4 w-4" strokeWidth={3} />
                  You said NO
                </div>
                <div className="space-y-2">
                  {noPicks.map((opt) => {
                    const s = statsById.get(opt.id)
                    return (
                      <div
                        key={opt.id}
                        className="flex items-center gap-3 rounded-xl border border-red-200/50 bg-red-50/60 px-3 py-2 opacity-80"
                      >
                        {opt.imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={opt.imageUrl}
                            alt=""
                            className="h-10 w-10 shrink-0 rounded-md object-cover grayscale"
                          />
                        )}
                        <span className="flex-1 truncate text-sm font-medium text-zinc-800 line-through">
                          {opt.text}
                        </span>
                        {s && (
                          <span className="shrink-0 text-xs tabular-nums text-zinc-600">
                            {s.percent}% overall
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="button"
          onClick={onAddClick}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-medium text-white shadow-md transition hover:bg-black/80 active:scale-[0.99]"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Don&apos;t see your option? Add new
        </button>
      </Card>
    )
  },
)
