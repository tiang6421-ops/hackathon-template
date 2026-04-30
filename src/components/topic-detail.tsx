"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  RotateCcw,
  Star,
  X,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { SwipeDeck, type SwipeDeckHandle } from "@/components/swipe-deck"
import { StatsCard, type StatsCardHandle } from "@/components/stats-card"
import { AddOptionCard } from "@/components/add-option-card"

interface Option {
  id: string
  text: string
  imageUrl: string | null
}

interface TopicDetailProps {
  topicId: string
  title: string
  imageUrl: string | null
  options: Option[]
  votedIds: string[]
  favorited: boolean
}

type Section = "cards" | "stats"

export function TopicDetail({
  topicId,
  title,
  imageUrl,
  options,
  votedIds,
  favorited: initialFavorited,
}: TopicDetailProps) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const cardsSectionRef = useRef<HTMLElement>(null)
  const statsSectionRef = useRef<HTMLElement>(null)
  const deckRef = useRef<SwipeDeckHandle>(null)
  const statsRef = useRef<StatsCardHandle>(null)

  const [activeSection, setActiveSection] = useState<Section>("cards")
  const [favorited, setFavorited] = useState(initialFavorited)
  const [addOpen, setAddOpen] = useState(false)
  const [progress, setProgress] = useState<{ position: number; total: number }>(
    { position: Math.min(votedIds.length + 1, options.length), total: options.length },
  )

  const handleProgressChange = useCallback((position: number, total: number) => {
    setProgress({ position, total })
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const sections = [
      cardsSectionRef.current,
      statsSectionRef.current,
    ].filter((el): el is HTMLElement => el !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting)
        if (!visible) return
        const section = (visible.target as HTMLElement).dataset
          .section as Section | undefined
        if (section) setActiveSection(section)
      },
      { root: container, threshold: 0.6 },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const scrollTo = (section: Section) => {
    const el =
      section === "stats" ? statsSectionRef.current : cardsSectionRef.current
    el?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const toggleFavorite = async () => {
    const next = !favorited
    setFavorited(next)
    try {
      const res = await fetch(`/api/topics/${topicId}/favorite`, {
        method: "POST",
      })
      if (!res.ok) throw new Error("failed")
      const data = (await res.json()) as { favorited: boolean }
      setFavorited(data.favorited)
    } catch {
      setFavorited(!next)
    }
  }

  const handleLeft = () => {
    if (activeSection === "cards") deckRef.current?.swipe(false)
    else {
      deckRef.current?.retry()
      scrollTo("cards")
    }
  }

  const handleRight = () => {
    if (activeSection === "cards") deckRef.current?.swipe(true)
    else router.push("/topics")
  }

  const leftIcon =
    activeSection === "stats" ? (
      <RotateCcw className="h-6 w-6" strokeWidth={2.5} />
    ) : (
      <X className="h-6 w-6" strokeWidth={3} />
    )
  const leftColor =
    activeSection === "stats"
      ? "border-orange-500 text-orange-500 hover:bg-orange-50"
      : "border-red-500 text-red-500 hover:bg-red-50"
  const leftLabel = activeSection === "stats" ? "Retry" : "No"

  const rightIcon =
    activeSection === "stats" ? (
      <ArrowRight className="h-6 w-6" strokeWidth={3} />
    ) : (
      <Check className="h-6 w-6" strokeWidth={3} />
    )
  const rightColor =
    activeSection === "stats"
      ? "border-blue-500 text-blue-500 hover:bg-blue-50"
      : "border-green-500 text-green-500 hover:bg-green-50"
  const rightLabel = activeSection === "stats" ? "Back to topics" : "Yes"

  return (
    <div className="flex h-[100dvh] w-full flex-col bg-background">
      <Navbar
        user={null}
        authEnabled={false}
        left={
          <Link
            href="/topics"
            aria-label="Back to topics"
            className="flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-white/10 active:scale-95"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
          </Link>
        }
        center={
          <Link href="/topics" className="flex items-center hover:opacity-80">
            <Image
              src="/images/logo.png"
              alt="T1nder"
              width={200}
              height={56}
              priority
              className="h-8 w-auto"
            />
          </Link>
        }
        right={
          <div className="flex items-center gap-2">
            <span
              aria-label={`Option ${progress.position} of ${progress.total}`}
              className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tabular-nums text-white"
            >
              {progress.position}/{progress.total}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.currentTarget.blur()
                toggleFavorite()
              }}
              aria-label={favorited ? "Unfavorite" : "Favorite"}
              aria-pressed={favorited}
              style={{
                color: "#974fff",
                outline: "none",
                boxShadow: "none",
                appearance: "none",
                WebkitAppearance: "none",
                WebkitTapHighlightColor: "transparent",
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/10 focus:outline-none focus-visible:outline-none active:scale-95"
            >
              <Star
                className="h-5 w-5"
                strokeWidth={2.5}
                fill={favorited ? "#974fff" : "none"}
              />
            </button>
          </div>
        }
      />

      <div
        ref={containerRef}
        className="hide-scrollbar flex-1 min-h-0 snap-y snap-mandatory overflow-y-auto overscroll-contain"
      >
        <section
          ref={cardsSectionRef}
          data-section="cards"
          className="flex h-full w-full snap-start flex-col px-5 py-5 sm:px-8"
        >
          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt=""
              className="mx-auto mb-3 h-28 w-full max-w-sm shrink-0 rounded-2xl object-cover shadow-lg"
              draggable={false}
            />
          )}
          <h2 className="mb-5 shrink-0 text-center">
            <span className="inline-block max-w-full rounded-2xl bg-secondary px-4 py-2 text-xl font-bold leading-tight tracking-tight text-secondary-foreground shadow-lg sm:text-2xl md:text-3xl">
              {title}
            </span>
          </h2>
          <div className="flex-1 min-h-0">
            <SwipeDeck
              ref={deckRef}
              topicId={topicId}
              options={options}
              initialVotedIds={votedIds}
              onExhausted={() => scrollTo("stats")}
              onProgressChange={handleProgressChange}
            />
          </div>
        </section>

        <section
          ref={statsSectionRef}
          data-section="stats"
          className="h-full w-full snap-start px-5 py-5 sm:px-8"
        >
          <div className="mx-auto h-full w-full max-w-sm">
            <StatsCard
              ref={statsRef}
              topicId={topicId}
              onAddClick={() => setAddOpen(true)}
            />
          </div>
        </section>
      </div>

      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5 sm:p-8">
          <div className="relative mx-auto h-[min(90dvh,640px)] w-full max-w-sm">
            <AddOptionCard
              topicId={topicId}
              onSkip={() => setAddOpen(false)}
              onAdded={() => {
                setAddOpen(false)
                void statsRef.current?.reload()
              }}
            />
          </div>
        </div>
      )}

      <div className="shrink-0 flex items-center justify-center gap-8 py-5">
        <button
          type="button"
          onClick={handleLeft}
          aria-label={leftLabel}
          className={`flex h-14 w-14 items-center justify-center rounded-full border-2 bg-white shadow-md transition active:scale-95 ${leftColor}`}
        >
          {leftIcon}
        </button>
        <button
          type="button"
          onClick={handleRight}
          aria-label={rightLabel}
          className={`flex h-14 w-14 items-center justify-center rounded-full border-2 bg-white shadow-md transition active:scale-95 ${rightColor}`}
        >
          {rightIcon}
        </button>
      </div>
    </div>
  )
}
