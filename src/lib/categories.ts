export const CATEGORIES = [
  "Events",
  "Community",
  "Travel",
  "Health",
  "Work",
  "Team",
  "Learning",
  "Tech",
  "Fun",
  "Daily",
] as const

export type Category = (typeof CATEGORIES)[number]

export function isCategory(value: string | null | undefined): value is Category {
  return !!value && (CATEGORIES as readonly string[]).includes(value)
}
