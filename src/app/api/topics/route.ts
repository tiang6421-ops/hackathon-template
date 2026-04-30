import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { isCategory } from "@/lib/categories"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid body" }, { status: 400 })
  }

  const name = typeof body.name === "string" ? body.name.trim() : ""
  const emoji = typeof body.emoji === "string" ? body.emoji.trim() : ""
  const categoryRaw = typeof body.category === "string" ? body.category.trim() : ""
  const imageUrlRaw = typeof body.imageUrl === "string" ? body.imageUrl.trim() : ""

  if (!name || name.length > 80) {
    return NextResponse.json({ error: "name is required (max 80 chars)" }, { status: 400 })
  }
  if (!emoji || emoji.length > 8) {
    return NextResponse.json({ error: "emoji is required (max 8 chars)" }, { status: 400 })
  }

  const category = isCategory(categoryRaw) ? categoryRaw : null
  const imageUrl = imageUrlRaw.startsWith("http") ? imageUrlRaw : null

  const last = await prisma.topic.findFirst({
    orderBy: { order: "desc" },
    select: { order: true },
  })
  const nextOrder = (last?.order ?? -1) + 1

  const topic = await prisma.topic.create({
    data: { name, emoji, category, imageUrl, order: nextOrder },
    select: { id: true },
  })

  return NextResponse.json({ topic })
}
