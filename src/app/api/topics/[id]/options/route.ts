import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const { id: topicId } = await params
  const body = (await req.json()) as { text?: string; imageUrl?: string }
  const text = body.text?.trim()
  const rawImageUrl = body.imageUrl?.trim()

  if (!text) {
    return NextResponse.json({ error: "text required" }, { status: 400 })
  }

  let imageUrl: string | null = null
  if (rawImageUrl) {
    if (rawImageUrl.startsWith("/uploads/")) {
      imageUrl = rawImageUrl
    } else {
      try {
        const parsed = new URL(rawImageUrl)
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
          throw new Error("bad protocol")
        }
        imageUrl = parsed.toString()
      } catch {
        return NextResponse.json(
          { error: "imageUrl must be a valid http(s) URL or upload path" },
          { status: 400 },
        )
      }
    }
  }

  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
    select: { id: true },
  })
  if (!topic) {
    return NextResponse.json({ error: "topic not found" }, { status: 404 })
  }

  const last = await prisma.option.findFirst({
    where: { topicId },
    orderBy: { order: "desc" },
    select: { order: true },
  })

  const option = await prisma.option.create({
    data: {
      topicId,
      text,
      imageUrl,
      order: (last?.order ?? 0) + 1,
    },
    select: { id: true, text: true, imageUrl: true },
  })

  await prisma.vote.create({
    data: { userId: session.user.id, optionId: option.id, value: true },
  })

  return NextResponse.json({ option })
}
