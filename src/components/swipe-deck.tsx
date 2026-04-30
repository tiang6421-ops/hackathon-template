"use client"

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { AnimatePresence } from "framer-motion"
import { SwipeCard, type SwipeCardHandle } from "@/components/swipe-card"

interface Option {
  id: string
  text: string
  imageUrl: string | null
}

interface SwipeDeckProps {
  topicId: string
  options: Option[]
  initialVotedIds: string[]
  onExhausted?: () => void
  onProgressChange?: (position: number, total: number) => void
}

export interface SwipeDeckHandle {
  swipe: (value: boolean) => void
  hasRemaining: () => boolean
  retry: () => void
}

export const SwipeDeck = forwardRef<SwipeDeckHandle, SwipeDeckProps>(
  function SwipeDeck(
    { options, initialVotedIds, onExhausted, onProgressChange },
    ref,
  ) {
    const fullyVoted =
      options.length > 0 && options.every((o) => initialVotedIds.includes(o.id))
    const topCardRef = useRef<SwipeCardHandle>(null)
    const [remaining, setRemaining] = useState<Option[]>(
      fullyVoted ? [] : options,
    )
    const wasExhausted = useRef(fullyVoted)

    useEffect(() => {
      if (remaining.length === 0 && !wasExhausted.current) {
        wasExhausted.current = true
        onExhausted?.()
      }
    }, [remaining.length, onExhausted])

    useEffect(() => {
      const total = options.length
      const position =
        remaining.length === 0
          ? total
          : total - remaining.length + 1
      onProgressChange?.(position, total)
    }, [remaining.length, options.length, onProgressChange])

    const commitSwipe = (value: boolean) => {
      const [swiped, ...rest] = remaining
      if (!swiped) return
      setRemaining(rest)
      void fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId: swiped.id, value }),
      })
    }

    useImperativeHandle(
      ref,
      () => ({
        swipe: (value) => {
          if (remaining.length === 0) return
          const card = topCardRef.current
          if (card) {
            card.animateExit(value, () => commitSwipe(value))
          } else {
            commitSwipe(value)
          }
        },
        hasRemaining: () => remaining.length > 0,
        retry: () => {
          wasExhausted.current = false
          setRemaining(options)
        },
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [remaining, options],
    )

    if (remaining.length === 0) {
      return (
        <div className="mx-auto flex h-full w-full max-w-sm items-center justify-center">
          <div className="rounded-3xl bg-white/10 px-6 py-8 text-center text-sm text-white/70 backdrop-blur-sm">
            All voted — scroll down for results.
          </div>
        </div>
      )
    }

    const visible = remaining.slice(0, 3)
    const total = options.length
    const firstRemainingIdx = options.findIndex(
      (o) => o.id === remaining[0]?.id,
    )

    return (
      <div className="relative mx-auto h-full w-full max-w-sm">
        <AnimatePresence initial={false}>
          {visible
            .slice()
            .reverse()
            .map((opt, revIdx) => {
              const stackIndex = visible.length - 1 - revIdx
              const isTop = stackIndex === 0
              const position = firstRemainingIdx + stackIndex + 1
              return (
                <SwipeCard
                  key={opt.id}
                  ref={isTop ? topCardRef : undefined}
                  text={opt.text}
                  imageUrl={opt.imageUrl}
                  stackIndex={stackIndex}
                  position={position}
                  total={total}
                  onSwipe={commitSwipe}
                />
              )
            })}
        </AnimatePresence>
      </div>
    )
  },
)
