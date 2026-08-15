"use client"

import { Card, CardContent } from "@/components/ui/card"

const primaryCardClass =
  "rounded-2xl border border-soft-white/5 bg-navy-800/30 backdrop-blur-md hover:border-gold/20 transition-all duration-300"
const headingClass = "font-bold text-soft-white"
const labelClass = "text-soft-white/50"

export function LoadingState() {
  return (
    <section className="min-h-screen px-4 py-16">
      <div className="container mx-auto max-w-4xl">
        <Card className={primaryCardClass}>
          <CardContent className="flex flex-col items-center justify-center gap-4 p-10 text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gold" />
            <div className="space-y-1">
              <p className={headingClass}>Loading portfolio</p>
              <p className={labelClass}>Synchronizing wallet balances and contract state.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
