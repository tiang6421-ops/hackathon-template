import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { PageLayout } from "@/components/page-layout"
import { NewTopicForm } from "@/components/new-topic-form"

export default async function NewTopicPage() {
  const session = await auth()
  if (!session?.user) redirect("/")

  return (
    <PageLayout user={session.user}>
      <div className="mx-auto max-w-xl space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New topic</h1>
          <p className="text-sm text-muted-foreground">
            Start a topic for others to swipe through.
          </p>
        </div>
        <NewTopicForm />
      </div>
    </PageLayout>
  )
}
