import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const body = (await req.json()) as {
    title?: string
    categoryId?: string
    imageUrl?: string
  }
  const title = body.title?.trim()
  const categoryId = body.categoryId?.trim()
  const rawImageUrl = body.imageUrl?.trim()

  if (!title) {
    return NextResponse.json({ error: "title required" }, { status: 400 })
  }
  if (!categoryId) {
    return NextResponse.json({ error: "categoryId required" }, { status: 400 })
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

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true },
  })
  if (!category) {
    return NextResponse.json({ error: "category not found" }, { status: 404 })
  }

  const last = await prisma.topic.findFirst({
    where: { categoryId },
    orderBy: { order: "desc" },
    select: { order: true },
  })

  const topic = await prisma.topic.create({
    data: {
      categoryId,
      title,
      imageUrl,
      order: (last?.order ?? 0) + 1,
    },
    select: { id: true, title: true, imageUrl: true },
  })

  return NextResponse.json({ topic })
}
