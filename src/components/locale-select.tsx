"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const LOCALES = [
  { code: "MY", name: "Malaysia", flag: "my" },
  { code: "AU", name: "Australia", flag: "au" },
  { code: "EN", name: "England", flag: "gb-eng" },
  { code: "VN", name: "Vietnam", flag: "vn" },
  { code: "ID", name: "Indonesia", flag: "id" },
  { code: "IN", name: "India", flag: "in" },
] as const

type LocaleCode = (typeof LOCALES)[number]["code"]
const DEFAULT_CODE: LocaleCode = "MY"

function isLocaleCode(value: string | null): value is LocaleCode {
  return value !== null && LOCALES.some((l) => l.code === value)
}

function FlagIcon({ code, name, size }: { code: string; name: string; size: number }) {
  return (
    <img
      src={`https://flagcdn.com/${code}.svg`}
      alt={name}
      width={size}
      height={Math.round((size * 3) / 4)}
      className="rounded-sm object-cover shadow-sm"
      style={{ width: size, height: Math.round((size * 3) / 4) }}
    />
  )
}

export function LocaleSelect() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const raw = searchParams.get("loc")
  const currentCode: LocaleCode = isLocaleCode(raw) ? raw : DEFAULT_CODE
  const current = LOCALES.find((l) => l.code === currentCode)!

  const setLocale = (next: LocaleCode) => {
    const params = new URLSearchParams(searchParams.toString())
    if (next === DEFAULT_CODE) params.delete("loc")
    else params.set("loc", next)
    const qs = params.toString()
    router.replace(qs ? `?${qs}` : "?")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Select country — currently ${current.name}`}
        className="flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-white outline-none transition hover:bg-white/10 active:scale-95"
      >
        <FlagIcon code={current.flag} name={current.name} size={24} />
        <ChevronDown className="h-4 w-4" strokeWidth={2.5} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LOCALES.map((loc) => (
          <DropdownMenuItem
            key={loc.code}
            onClick={() => setLocale(loc.code)}
            className={loc.code === currentCode ? "font-semibold" : undefined}
          >
            <FlagIcon code={loc.flag} name={loc.name} size={20} />
            {loc.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
