"use client"

import { useRef, useState } from "react"
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion"
import { ImageIcon, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AddedOption {
  id: string
  text: string
  imageUrl: string | null
}

interface AddOptionCardProps {
  topicId: string
  onAdded: (option: AddedOption) => void
  onSkip: () => void
}

const SWIPE_THRESHOLD = 120

export function AddOptionCard({ topicId, onAdded, onSkip }: AddOptionCardProps) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-250, 0, 250], [-14, 0, 14])
  const yesOpacity = useTransform(x, [0, 60, 140], [0, 0.6, 1])
  const noOpacity = useTransform(x, [-140, -60, 0], [1, 0.6, 0])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [text, setText] = useState("")
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (file: File) => {
    setError(null)
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
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

  const animateOff = (dir: 1 | -1, onDone: () => void) => {
    animate(x, dir * 600, { duration: 0.25, onComplete: onDone })
  }

  const doSkip = () => animateOff(-1, onSkip)

  const doAdd = async () => {
    if (submitting || uploading) return
    const trimmedText = text.trim()
    if (!trimmedText) {
      setError("please enter a title")
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`/api/topics/${topicId}/options`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: trimmedText,
          ...(imageUrl ? { imageUrl } : {}),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "failed to add")
      animateOff(1, () => onAdded(data.option as AddedOption))
    } catch (err) {
      setError(err instanceof Error ? err.message : "failed to add")
      animate(x, 0, { type: "spring", stiffness: 300, damping: 30 })
      setSubmitting(false)
    }
  }

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      void doAdd()
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      doSkip()
    }
  }

  const stopDrag = (e: React.PointerEvent) => {
    e.stopPropagation()
  }

  return (
    <motion.div
      className="absolute inset-0"
      style={{ x, rotate, touchAction: "pan-y" }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
    >
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-3xl border-2 border-dashed border-zinc-300 bg-white p-6 shadow-2xl select-none">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 overflow-y-auto text-center">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <Plus className="h-7 w-7" strokeWidth={3} />
          </div>
          <div className="shrink-0">
            <h3 className="text-xl font-bold text-zinc-900">
              Add your own option
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              Missing something? Suggest it — it counts as a YES.
            </p>
          </div>
          <div
            className="w-full space-y-3"
            onPointerDown={stopDrag}
            onPointerMove={stopDrag}
          >
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Option title…"
              rows={2}
              maxLength={140}
              className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-base text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-400"
            />
            <div className="space-y-2 text-left">
              <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                <ImageIcon className="h-3.5 w-3.5" />
                Image (optional) — jpg, png, webp, max 5 MB
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
                    className="max-h-32 w-full rounded-xl object-cover"
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
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 disabled:opacity-60"
                >
                  <ImageIcon className="h-4 w-4" />
                  {uploading ? "Uploading…" : "Choose image"}
                </button>
              )}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={doSkip}
                disabled={submitting}
                className="flex-1"
              >
                Skip
              </Button>
              <Button
                type="button"
                onClick={() => void doAdd()}
                disabled={submitting || uploading}
                className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                {submitting ? "Adding…" : "Add"}
              </Button>
            </div>
          </div>
        </div>

        <motion.div
          className="absolute top-6 left-6 rounded-lg border-[3px] border-red-500 bg-white/90 px-3 py-1 text-2xl font-extrabold text-red-500 -rotate-12"
          style={{ opacity: noOpacity }}
        >
          SKIP
        </motion.div>
        <motion.div
          className="absolute top-6 right-6 rounded-lg border-[3px] border-green-500 bg-white/90 px-3 py-1 text-2xl font-extrabold text-green-500 rotate-12"
          style={{ opacity: yesOpacity }}
        >
          ADD
        </motion.div>
      </div>
    </motion.div>
  )
}
