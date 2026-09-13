"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Briefcase, ArrowLeftRight, Lock, Send, User, RefreshCw, Settings, ShieldCheck, Eye, Building2, Vote, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { WalletConnect } from "./wallet-connect"
import { LanguageToggle } from "./language-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/language-context"
import { ADMIN_ADDRESS } from "@/services/contracts"

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { t } = useLanguage()

  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    checkAdminStatus()
  }, [])

  const checkAdminStatus = async () => {
    try {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({
          method: "eth_accounts",
        })

        if (accounts.length > 0) {
          const address = accounts[0].toLowerCase()
          setIsAdmin(address === ADMIN_ADDRESS.toLowerCase())
        } else {
          setIsAdmin(false)
        }
      }
    } catch (error) {
      console.error("Failed to check admin status:", error)
      setIsAdmin(false)
    }
  }

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          const address = accounts[0].toLowerCase()
          setIsAdmin(address === ADMIN_ADDRESS.toLowerCase())
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

  const mainNavigation = [
    { name: "Dashboard", href: "/portfolio", icon: Briefcase },
    { name: "Buy / Sell", href: "/swap", icon: ArrowLeftRight },
    { name: "Portfolio", href: "/portfolio", icon: User },
    { name: "Earn", href: "/staking", icon: Lock },
  ]

  const moreNavigation = [
    { name: t("nav.vault"), href: "/vault", icon: Briefcase },
    { name: t("nav.redemption"), href: "/redemption", icon: Send },
    { name: "KYC Center", href: "/kyc", icon: ShieldCheck },
    { name: "Transparency", href: "/transparency", icon: Eye },
    { name: "Institutional", href: "/institutional", icon: Building2 },
    { name: "Governance", href: "/governance", icon: Vote },
    ...(isAdmin ? [{ name: "Admin", href: "/admin", icon: Settings }] : []),
  ]

  const allNavigation = [...mainNavigation, ...moreNavigation]

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate refresh delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Trigger page refresh or data reload
    window.location.reload()

    setIsRefreshing(false)
  }

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-gold/20 bg-navy-900/80 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              {/* Circular Logo */}
              <div className="relative">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-gold via-gold-600 to-gold-700 p-0.5">
                  <div className="h-full w-full rounded-full bg-navy-900 flex items-center justify-center">
                    <img src="/images/aurix-logo.jpg" alt="Aurix Logo" className="h-8 w-8 rounded-full object-cover" />
                  </div>
                </div>
                <div className="absolute inset-0 rounded-full bg-gold/20 animate-pulse"></div>
              </div>

              {/* Brand Text */}
              <span className="text-xl font-bold tracking-tight text-gold">AuriX Finance</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {mainNavigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-gold/20 text-gold"
                        : "text-soft-white/70 hover:bg-gold/10 hover:text-gold",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "gap-2 rounded-lg text-sm font-medium text-soft-white/70 hover:bg-gold/10 hover:text-gold",
                      moreNavigation.some((item) => pathname === item.href) && "bg-gold/20 text-gold",
                    )}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    More
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-gold/20 bg-navy-900">
                  {moreNavigation.map((item) => {
                    const Icon = item.icon
                    return (
                      <DropdownMenuItem key={item.name} asChild>
                        <Link href={item.href} className="flex cursor-pointer items-center gap-2 text-soft-white/80 focus:bg-gold/10 focus:text-gold">
                          <Icon className="h-4 w-4" />
                          {item.name}
                        </Link>
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center space-x-3">
              {/* Language Toggle */}
              <LanguageToggle />

              {/* Wallet Connect Component */}
              <WalletConnect />

              {/* Mobile Navigation */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5 text-soft-white" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-navy-900 border-gold/20">
                  <div className="flex flex-col space-y-4 mt-8">
                    {allNavigation.map((item) => {
                      if (!item.icon) return null
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                            pathname === item.href
                              ? "bg-gold/20 text-gold"
                              : "text-soft-white/70 hover:text-gold hover:bg-gold/10",
                          )}
                        >
                          <Icon className="h-4 w-4" />
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

      {/* Refresh Button - Positioned below header */}
      <div className="sticky top-16 z-40 w-full bg-navy-900/50 backdrop-blur-sm border-b border-gold/10">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="border-gold/20 text-soft-white hover:bg-gold/10 bg-transparent"
            >
              {isRefreshing ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                  {t("nav.refreshing")}
                </>
              ) : (
                <>
                  <RefreshCw className="h-3 w-3 mr-2" />
                  {t("nav.refresh")}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
