import { NextResponse } from "next/server"
import { randomBytes } from "crypto"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { auth } from "@/lib/auth"

const MAX_BYTES = 5 * 1024 * 1024 // 5 MB

const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
}

const KINDS = new Set(["options", "topics"])

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const form = await req.formData()
  const file = form.get("file")
  const kind = (form.get("kind") as string | null) ?? "options"

  if (!KINDS.has(kind)) {
    return NextResponse.json({ error: "invalid kind" }, { status: 400 })
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file required" }, { status: 400 })
  }

  const ext = ALLOWED[file.type]
  if (!ext) {
    return NextResponse.json(
      { error: "unsupported type — use jpg, png, or webp" },
      { status: 400 },
    )
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "file too large (max 5 MB)" },
      { status: 400 },
    )
  }

  const dir = path.join(process.cwd(), "public", "uploads", kind)
  await mkdir(dir, { recursive: true })

  const name = `${randomBytes(12).toString("hex")}.${ext}`
  const buf = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(dir, name), buf)

  return NextResponse.json({ url: `/uploads/${kind}/${name}` })
}
