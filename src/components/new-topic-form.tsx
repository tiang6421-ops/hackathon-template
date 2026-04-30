"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CATEGORIES } from "@/lib/categories"

export function NewTopicForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [emoji, setEmoji] = useState("")
  const [category, setCategory] = useState<string>("")
  const [imageUrl, setImageUrl] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = name.trim().length > 0 && emoji.trim().length > 0 && !submitting

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/topics", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          emoji: emoji.trim(),
          category: category || undefined,
          imageUrl: imageUrl.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Failed to create topic")
        setSubmitting(false)
        return
      }
      router.push(`/topics/${data.topic.id}`)
    } catch {
      setError("Network error")
      setSubmitting(false)
    }
  }

  return (
    <Card className="p-6">
      <form className="space-y-4" onSubmit={onSubmit}>
        <Field label="Name" htmlFor="name">
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            placeholder="e.g. Best lunch spots"
            className={inputCls}
            required
          />
        </Field>

        <Field label="Emoji" htmlFor="emoji" hint="A single emoji to represent the topic">
          <input
            id="emoji"
            type="text"
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            maxLength={8}
            placeholder="🍜"
            className={inputCls + " w-24 text-2xl"}
            required
          />
        </Field>

        <Field label="Category" htmlFor="category">
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputCls}
          >
            <option value="">(none)</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Image URL"
          htmlFor="imageUrl"
          hint="Optional. A public image URL (https://...)"
        >
          <input
            id="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className={inputCls}
          />
        </Field>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex items-center gap-2 pt-2">
          <Button type="submit" disabled={!canSubmit} size="lg">
            {submitting ? "Creating..." : "Create topic"}
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link href="/topics">Cancel</Link>
          </Button>
        </div>
      </form>
    </Card>
  )
}

const inputCls =
  "h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string
  htmlFor: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={htmlFor} className="block text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}
