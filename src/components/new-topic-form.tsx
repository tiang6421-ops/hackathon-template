"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ImageIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Category {
  id: string
  name: string
  emoji: string
}

interface NewTopicFormProps {
  categories: Category[]
}

export function NewTopicForm({ categories }: NewTopicFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState("")
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (file: File) => {
    setError(null)
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("kind", "topics")
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "upload failed")
      setImageUrl(data.url as string)
    } catch (err) {
      setError(err instanceof Error ? err.message : "upload failed")
    } finally {
      setUploading(false)
    }
  }

  const clearImage = () => {
    setImageUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed || !categoryId) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: trimmed,
          categoryId,
          ...(imageUrl ? { imageUrl } : {}),
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
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={140}
            placeholder="e.g. Best pizza topping?"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="mb-1 block text-sm font-medium">
            Category
          </label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            required
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Image{" "}
            <span className="font-normal text-muted-foreground">
              (optional) — jpg, png, webp, max 5 MB
            </span>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) void handleFile(f)
            }}
            className="hidden"
          />
          {imageUrl ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="preview"
                className="h-40 w-full rounded-md object-cover"
              />
              <button
                type="button"
                onClick={clearImage}
                aria-label="Remove image"
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
              >
                <X className="h-4 w-4" strokeWidth={3} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-input bg-background px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-muted disabled:opacity-60"
            >
              <ImageIcon className="h-4 w-4" />
              {uploading ? "Uploading…" : "Choose image"}
            </button>
          )}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            disabled={submitting || uploading || !title.trim()}
          >
            {submitting ? "Creating…" : "Create topic"}
          </Button>
          <Link
            href="/topics"
            className="text-sm text-muted-foreground hover:underline"
          >
            Cancel
          </Link>
        </div>
      </form>
    </Card>
  )
}
