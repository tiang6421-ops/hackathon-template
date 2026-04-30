import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { PageLayout } from "@/components/page-layout"
import { NewTopicForm } from "@/components/new-topic-form"

export default async function NewTopicPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/")

  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    select: { id: true, name: true, emoji: true },
  })

  return (
    <PageLayout user={session.user}>
      <div className="mx-auto max-w-xl">
        <h1 className="mb-6 text-2xl font-bold tracking-tight">New Topic</h1>
        <NewTopicForm categories={categories} />
      </div>
    </PageLayout>
  )
}
