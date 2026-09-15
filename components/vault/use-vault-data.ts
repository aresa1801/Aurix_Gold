"use client"

import { useCallback, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export type VaultSummary = {
  id: string
  name: string
  wallet_address: string | null
  chain_id: number
  verification_status: string
  reserve_ratio: number
  utilization_ratio: number
  insurance_coverage: number
}

type VaultData = {
  vault: VaultSummary | null
  reserves: Array<{ id: string; weight_grams: number; status: string; location: string | null; purity: number }>
  revenue: Array<{ id: string; event_type: string; amount: number; currency: string; source: string; occurred_at: string; transaction_hash: string | null }>
  payouts: Array<{ id: string; amount: number; currency: string; status: string; requested_at: string }>
  loading: boolean
  error: string | null
  requestAction: (actionType: string, payload?: Record<string, unknown>) => Promise<void>
  refresh: () => Promise<void>
}

export function useVaultData(): VaultData {
  const [data, setData] = useState<VaultData["vault"]>(null)
  const [reserves, setReserves] = useState<VaultData["reserves"]>([])
  const [revenue, setRevenue] = useState<VaultData["revenue"]>([])
  const [payouts, setPayouts] = useState<VaultData["payouts"]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    const supabase = createClient()
    setLoading(true)
    setError(null)
    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) {
      setLoading(false)
      setError("Sign in to access vault data")
      return
    }
    const membership = await supabase.from("vault_members").select("vault_id, vaults(*)").eq("user_id", auth.user.id).eq("status", "active").limit(1).maybeSingle()
    if (membership.error || !membership.data?.vaults) {
      setLoading(false)
      setError(membership.error?.message ?? "No active vault membership found")
      return
    }
    const vault = Array.isArray(membership.data.vaults) ? membership.data.vaults[0] : membership.data.vaults
    const [reserveResult, revenueResult, payoutResult] = await Promise.all([
      supabase.from("vault_reserves").select("id,weight_grams,status,location,purity").eq("vault_id", vault.id).order("created_at", { ascending: false }),
      supabase.from("vault_revenue_events").select("id,event_type,amount,currency,source,occurred_at,transaction_hash").eq("vault_id", vault.id).order("occurred_at", { ascending: false }).limit(20),
      supabase.from("vault_payout_requests").select("id,amount,currency,status,requested_at").eq("vault_id", vault.id).order("requested_at", { ascending: false }).limit(10),
    ])
    const queryError = reserveResult.error ?? revenueResult.error ?? payoutResult.error
    if (queryError) setError(queryError.message)
    setData(vault as VaultSummary)
    setReserves((reserveResult.data ?? []) as VaultData["reserves"])
    setRevenue((revenueResult.data ?? []) as VaultData["revenue"])
    setPayouts((payoutResult.data ?? []) as VaultData["payouts"])
    setLoading(false)
  }, [])

  useEffect(() => { void refresh() }, [refresh])

  const requestAction = useCallback(async (actionType: string, payload: Record<string, unknown> = {}) => {
    if (!data) throw new Error("No vault selected")
    const supabase = createClient()
    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) throw new Error("Sign in to submit a vault request")
    const { error: insertError } = await supabase.from("vault_action_requests").insert({ vault_id: data.id, action_type: actionType, payload, requested_by: auth.user.id })
    if (insertError) throw insertError
    await refresh()
  }, [data, refresh])

  return { vault: data, reserves, revenue, payouts, loading, error, requestAction, refresh }
}
