"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { Card } from "@/components/ui/card"

interface StatsCardProps {
  questionId: string
  onOptionAdded?: () => void
}

interface StatOption {
  optionId: string
  text: string
  yes: number
  total: number
  percent: number
}

export function StatsCard({ questionId, onOptionAdded }: StatsCardProps) {
  const [stats, setStats] = useState<StatOption[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [animated, setAnimated] = useState(false)

  const [newOption, setNewOption] = useState("")
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/questions/${questionId}/stats`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        if (data.error) setError(data.error)
        else setStats(data.options)
      })
      .catch(() => !cancelled && setError("failed to load"))
    return () => {
      cancelled = true
    }
  }, [questionId])

  useEffect(() => {
    if (!stats) return
    setAnimated(false)
    const id = requestAnimationFrame(() => setAnimated(true))
    return () => cancelAnimationFrame(id)
  }, [stats])

  const submitOption = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = newOption.trim()
    if (!text || adding) return
    setAdding(true)
    setAddError(null)
    try {
      const res = await fetch(`/api/questions/${questionId}/options`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text }),
      })
      const data = await res.json()
      if (!res.ok) {
        setAddError(data.error ?? "Failed to add option")
        setAdding(false)
        return
      }
      setNewOption("")
      setAdding(false)
      onOptionAdded?.()
    } catch {
      setAddError("Network error")
      setAdding(false)
    }
  }

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
              <div className="mb-1 flex items-baseline justify-between">
                <span className="text-sm font-medium">{s.text}</span>
                <span className="text-sm tabular-nums text-secondary-foreground/70">
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
        </div>
      )}

      <form
        onSubmit={submitOption}
        className="mt-6 border-t border-black/10 pt-4"
      >
        <label htmlFor={`add-${questionId}`} className="mb-1 block text-xs font-semibold uppercase tracking-wide text-secondary-foreground/60">
          Add a new option
        </label>
        <div className="flex items-center gap-2">
          <input
            id={`add-${questionId}`}
            type="text"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            maxLength={140}
            placeholder="Something we missed…"
            className="h-9 flex-1 rounded-md border border-black/20 bg-white/80 px-3 text-sm text-black outline-none focus:border-black/40 focus:ring-2 focus:ring-black/10"
            disabled={adding}
          />
          <button
            type="submit"
            disabled={!newOption.trim() || adding}
            className="flex h-9 items-center gap-1 rounded-md bg-black px-3 text-sm font-medium text-white transition hover:bg-black/85 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            {adding ? "Adding…" : "Add"}
          </button>
        </div>
        {addError && <p className="mt-1 text-xs text-red-600">{addError}</p>}
      </form>
    </Card>
  )
}
