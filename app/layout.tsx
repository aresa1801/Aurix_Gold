import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Navigation } from "@/components/navigation"
import { LanguageProvider } from "@/contexts/language-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Aurix Finance - Tokenized Gold Investment Platform",
  description: "Invest in tokenized gold backed by physical reserves with Aurix Finance",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body
        className={`${inter.className} bg-gradient-to-br from-navy-900 via-black to-navy-800 min-h-screen text-soft-white`}
      >
        <LanguageProvider>
          <div className="relative min-h-screen">
            <Navigation />
            <main className="relative z-10">{children}</main>
          </div>
        </LanguageProvider>
      </body>
    </html>
  )
}
