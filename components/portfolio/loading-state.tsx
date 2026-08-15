"use client"

import { Card, CardContent } from "@/components/ui/card"
import { PORTFOLIO_STYLES } from "./portfolio-styles"

export function LoadingState() {
  return (
    <section className="min-h-screen px-4 py-16">
      <div className="container mx-auto max-w-4xl">
        <Card className={PORTFOLIO_STYLES.primaryCard}>
          <CardContent className="flex flex-col items-center justify-center gap-4 p-10 text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gold" />
            <div className="space-y-1">
              <p className={PORTFOLIO_STYLES.heading}>Loading portfolio</p>
              <p className={PORTFOLIO_STYLES.label}>Synchronizing wallet balances and contract state.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
