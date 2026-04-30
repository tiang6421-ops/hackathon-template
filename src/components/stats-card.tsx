"use client"

import { useCallback, useEffect, useImperativeHandle, useState, forwardRef } from "react"
import { Plus } from "lucide-react"
import { Card } from "@/components/ui/card"

interface StatsCardProps {
  topicId: string
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
  function StatsCard({ topicId, onAddClick }, ref) {
    const [stats, setStats] = useState<StatOption[] | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [animated, setAnimated] = useState(false)

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

    useEffect(() => {
      if (!stats) return
      setAnimated(false)
      const id = requestAnimationFrame(() => setAnimated(true))
      return () => cancelAnimationFrame(id)
    }, [stats])

    useImperativeHandle(ref, () => ({ reload: loadStats }), [loadStats])

    return (
      <Card className="hide-scrollbar h-full w-full overflow-y-auto rounded-3xl border-0 bg-secondary p-6 text-secondary-foreground shadow-2xl">
        <h3 className="mb-1 text-lg font-semibold">Results</h3>
        <p className="mb-6 text-sm text-secondary-foreground/70">
          Share of all YES votes across options
        </p>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {!stats && !error && (
          <p className="text-sm text-secondary-foreground/70">Loading…</p>
        )}

        {stats && (
          <div className="space-y-4">
            {stats.map((s) => (
              <div key={s.optionId}>
                <div className="mb-1 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    {s.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={s.imageUrl}
                        alt=""
                        className="h-8 w-8 shrink-0 rounded-md object-cover"
                      />
                    )}
                    <span className="truncate text-sm font-medium">
                      {s.text}
                    </span>
                  </div>
                  <span className="shrink-0 text-sm tabular-nums text-secondary-foreground/70">
                    {s.percent}%{" "}
                    <span className="text-xs">
                      ({s.yes}/{s.total})
                    </span>
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-black/15">
                  <div
                    className="stats-bar-fill h-full rounded-full"
                    style={{ width: `${animated ? s.percent : 0}%` }}
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={onAddClick}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-medium text-white shadow-md transition hover:bg-black/80 active:scale-[0.99]"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Don&apos;t see your option? Add new
            </button>
          </div>
        )}
      </Card>
    )
  },
)
