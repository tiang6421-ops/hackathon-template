"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"

export function TopicSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initial = searchParams.get("q") ?? ""
  const [value, setValue] = useState(initial)
  const [open, setOpen] = useState(initial.length > 0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setValue(searchParams.get("q") ?? "")
  }, [searchParams])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    const handle = setTimeout(() => {
      const current = searchParams.get("q") ?? ""
      if (value === current) return
      const params = new URLSearchParams(searchParams.toString())
      if (value.trim()) params.set("q", value.trim())
      else params.delete("q")
      const qs = params.toString()
      router.replace(qs ? `/topics?${qs}` : "/topics")
    }, 200)
    return () => clearTimeout(handle)
  }, [value, searchParams, router])

  const close = () => {
    setValue("")
    setOpen(false)
    const params = new URLSearchParams(searchParams.toString())
    params.delete("q")
    const qs = params.toString()
    router.replace(qs ? `/topics?${qs}` : "/topics")
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search topics"
        className="flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-white/10 active:scale-95"
      >
        <Search className="h-5 w-5" strokeWidth={2.5} />
      </button>
    )
  }

  return (
    <div className="flex items-center gap-1 rounded-full bg-white/10 pl-3 pr-1">
      <Search className="h-4 w-4 text-white/60" strokeWidth={2.5} />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search topics…"
        className="h-9 w-36 bg-transparent text-sm text-white placeholder:text-white/50 outline-none sm:w-56"
      />
      <button
        type="button"
        onClick={close}
        aria-label="Close search"
        className="flex h-7 w-7 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
      >
        <X className="h-4 w-4" strokeWidth={2.5} />
      </button>
    </div>
  )
}
