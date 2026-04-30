import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"

export default async function TopicResultPage({
  params,
}: {
  params: Promise<{ topicId: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/")

  const { topicId } = await params
  const userId = session.user.id

  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
    include: {
      options: {
        orderBy: { order: "asc" },
        include: {
          votes: {
            where: { userId },
            select: { value: true },
          },
        },
      },
    },
  })
  if (!topic) notFound()

  // Build non-zero random percentages that sum to 100.
  // YES picks (from user's own history) get heavier weight so their
  // result feels like it reflects their taste.
  const weights = topic.options.map((o) => {
    const vote = o.votes[0]?.value
    const base = Math.random() * 0.6 + 0.4 // 0.4 – 1.0 so no zeros
    if (vote === true) return base + 1.2
    if (vote === false) return base * 0.5 + 0.2
    return base
  })
  const totalWeight = weights.reduce((a, b) => a + b, 0)

  const scored = topic.options
    .map((o, i) => {
      const raw = (weights[i] / totalWeight) * 100
      return {
        id: o.id,
        text: o.text,
        imageUrl: o.imageUrl,
        linkUrl: o.linkUrl,
        vote: o.votes[0]?.value ?? null,
        percent: Math.max(1, Math.round(raw)),
      }
    })
    .sort((a, b) => b.percent - a.percent)

  // Nudge to exactly 100 after rounding without creating zeros.
  const diff = 100 - scored.reduce((a, o) => a + o.percent, 0)
  if (scored.length > 0) scored[0].percent = Math.max(1, scored[0].percent + diff)

  const winner = scored[0]
  const totalVotes = topic.options.reduce((a, o) => a + o.votes.length, 0)

  return (
    <div className="flex h-[100dvh] w-full flex-col bg-background">
      <Navbar
        user={null}
        authEnabled={false}
        left={
          <Link
            href={`/topics/${topic.id}`}
            aria-label="Back"
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
        right={<div className="w-10" />}
      />

      <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8">
        <div className="mx-auto w-full max-w-sm space-y-5">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">{topic.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {totalVotes > 0
                ? `Based on your ${totalVotes} vote${totalVotes > 1 ? "s" : ""}`
                : "Vote first to get a more personal result"}
            </p>
          </div>

          {winner && (
            <Card className="rounded-3xl border-0 bg-gradient-to-br from-green-400 to-emerald-500 p-6 text-white shadow-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
                Top Pick
              </p>
              <div className="mt-3 flex items-center gap-3">
                {winner.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={winner.imageUrl}
                    alt=""
                    className="h-16 w-16 shrink-0 rounded-xl object-cover shadow-lg"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xl font-bold">{winner.text}</p>
                  <p className="text-3xl font-extrabold tabular-nums">
                    {winner.percent}%
                  </p>
                </div>
                <a
                  href="https://www.youtube.com/shorts/_6HzLIJPH2A"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open link for ${winner.text}`}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/30 active:scale-95"
                >
                  <ExternalLink className="h-4 w-4" strokeWidth={2.5} />
                </a>
              </div>
            </Card>
          )}

          <Card className="rounded-3xl border-0 bg-secondary p-6 text-secondary-foreground shadow-2xl">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-secondary-foreground/70">
              Full Result
            </h3>
            <div className="space-y-4">
              {scored.map((o) => (
                <div key={o.id}>
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      {o.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={o.imageUrl}
                          alt=""
                          className="h-8 w-8 shrink-0 rounded-md object-cover"
                        />
                      )}
                      <span className="truncate text-sm font-medium">
                        {o.text}
                      </span>
                      {o.vote === true && (
                        <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                          YES
                        </span>
                      )}
                      {o.vote === false && (
                        <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                          NO
                        </span>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <a
                        href="https://www.youtube.com/shorts/_6HzLIJPH2A"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open link for ${o.text}`}
                        className="inline-flex items-center gap-1 rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground/80 transition hover:bg-black/10 hover:text-secondary-foreground active:scale-95"
                      >
                        <ExternalLink className="h-3 w-3" strokeWidth={2.5} />
                        Open
                      </a>
                      <span className="text-sm font-semibold tabular-nums">
                        {o.percent}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-pink-500 to-orange-400"
                      style={{ width: `${o.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Link
            href="/topics"
            className="flex w-full items-center justify-center rounded-xl bg-black px-4 py-3 text-sm font-medium text-white shadow-md transition hover:bg-black/80 active:scale-[0.99]"
          >
            Back to topics
          </Link>
        </div>
      </div>
    </div>
  )
}
