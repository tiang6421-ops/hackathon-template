import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const { id: topicId } = await params
  const userId = session.user.id

  const existing = await prisma.topicFavorite.findUnique({
    where: { userId_topicId: { userId, topicId } },
    select: { id: true },
  })

  if (existing) {
    await prisma.topicFavorite.delete({ where: { id: existing.id } })
    return NextResponse.json({ favorited: false })
  }

  await prisma.topicFavorite.create({ data: { userId, topicId } })
  return NextResponse.json({ favorited: true })
}
