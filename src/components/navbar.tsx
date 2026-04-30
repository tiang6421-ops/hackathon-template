"use client"

import Image from "next/image"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { ReactNode } from "react"

export interface NavbarUser {
  name: string | null
  email: string | null
  image: string | null
}

interface NavbarProps {
  user: NavbarUser | null
  authEnabled: boolean
  left?: ReactNode
  center?: ReactNode
  right?: ReactNode
  navbarRight?: ReactNode
}

function getInitials(_name: string | null): string {
  return "MS"
}

export function Navbar({
  user,
  authEnabled,
  left,
  center,
  right,
  navbarRight,
}: NavbarProps) {
  return (
    <nav className="border-b border-black/50 bg-black">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {left ?? (
          <Link href="/" className="flex items-center hover:opacity-80">
            <Image
              src="/images/logo.png"
              alt="T1nder"
              width={200}
              height={56}
              priority
              className="h-8 w-auto"
            />
          </Link>
        )}

        {center && (
          <div className="pointer-events-none absolute left-1/2 -translate-x-1/2">
            <div className="pointer-events-auto">{center}</div>
          </div>
        )}

        {right ?? (
          <div className="flex items-center gap-2">
            {navbarRight}
            {user ? (
              authEnabled ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-muted outline-none">
                    <Avatar size="sm">
                      {user.image && <AvatarImage src={user.image} alt={user.name ?? "User"} />}
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem disabled>{user.email}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <span className="text-sm text-muted-foreground">{user.name}</span>
              )
            ) : null}
          </div>
        )}
      </div>
    </nav>
  )
}
