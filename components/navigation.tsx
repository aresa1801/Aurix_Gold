"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Briefcase, ArrowLeftRight, Lock, Send, User, Settings, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { WalletConnect } from "./wallet-connect"
import { LanguageToggle } from "./language-toggle"
import { useLanguage } from "@/contexts/language-context"
import { ADMIN_ADDRESS } from "@/services/contracts"

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useLanguage()
  const [isAdmin, setIsAdmin] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    checkAdminStatus()
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const checkAdminStatus = async () => {
    try {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          setIsAdmin(accounts[0].toLowerCase() === ADMIN_ADDRESS.toLowerCase())
        }
      }
    } catch (error) {
      setIsAdmin(false)
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setIsAdmin(accounts[0].toLowerCase() === ADMIN_ADDRESS.toLowerCase())
        } else {
          setIsAdmin(false)
        }
      }
      ;(window as any).ethereum.on("accountsChanged", handleAccountsChanged)
      return () => {
        ;(window as any).ethereum.removeListener("accountsChanged", handleAccountsChanged)
      }
    }
  }, [])

  const navigation = [
    { name: t("nav.vault"), href: "/vault", icon: Briefcase },
    { name: t("nav.swap"), href: "/swap", icon: ArrowLeftRight },
    { name: t("nav.staking"), href: "/staking", icon: Lock },
    { name: t("nav.redemption"), href: "/redemption", icon: Send },
    { name: t("nav.portfolio"), href: "/portfolio", icon: User },
    ...(isAdmin ? [{ name: "Admin", href: "/admin", icon: Settings }] : []),
  ]

  return (
    <nav className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      scrolled
        ? "bg-navy-900/90 backdrop-blur-xl border-b border-soft-white/5 shadow-lg shadow-black/20"
        : "bg-transparent border-b border-transparent"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-gold via-gold-600 to-amber-700 p-0.5 group-hover:shadow-lg group-hover:shadow-gold/20 transition-shadow duration-300">
                <div className="h-full w-full rounded-[10px] bg-navy-900 flex items-center justify-center">
                  <img src="/images/aurix-logo.jpg" alt="Aurix" className="h-5 w-5 rounded-md object-cover" />
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-gold leading-tight tracking-tight">Aurix</span>
              <span className="text-[10px] text-soft-white/40 leading-tight tracking-widest uppercase">Finance</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => {
              if (!item.icon) return null
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-gold/10 text-gold"
                      : "text-soft-white/50 hover:text-soft-white hover:bg-soft-white/5",
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive && "text-gold")} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2">
            <LanguageToggle />
            <WalletConnect />

            {/* Mobile menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="text-soft-white/70 hover:text-soft-white hover:bg-soft-white/5">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-navy-900/95 backdrop-blur-xl border-soft-white/5 w-72">
                <div className="flex flex-col space-y-1 mt-8">
                  {navigation.map((item) => {
                    if (!item.icon) return null
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-gold/10 text-gold"
                            : "text-soft-white/60 hover:text-soft-white hover:bg-soft-white/5",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    )
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
