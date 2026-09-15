"use client"

import { WEB3AUTH_NETWORK } from "@web3auth/base"
import { Web3Auth } from "@web3auth/modal"

let web3Auth: Web3Auth | null = null
let initialized = false

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID
const chainId = process.env.NEXT_PUBLIC_WEB3AUTH_CHAIN_ID ?? "0x38"
const rpcTarget = process.env.NEXT_PUBLIC_WEB3AUTH_RPC_URL ?? "https://bsc-dataseed.binance.org/"

export function isWeb3AuthConfigured() {
  return Boolean(clientId)
}

export async function connectGoogleSmartWallet() {
  if (!clientId) throw new Error("Google smart wallet is not configured yet.")

  if (!web3Auth) {
    web3Auth = new Web3Auth({
      clientId,
      web3AuthNetwork: (process.env.NEXT_PUBLIC_WEB3AUTH_NETWORK as WEB3AUTH_NETWORK | undefined) ?? WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
      uiConfig: {
        appName: "AuriX",
        mode: "dark",
        loginMethodsOrder: ["google"],
      },
      chainConfig: {
        chainNamespace: "EIP155",
        chainId,
        rpcTarget,
        displayName: "BNB Smart Chain",
        ticker: "BNB",
        tickerName: "BNB",
      },
    })
  }

  if (!initialized) {
    await web3Auth.init()
    initialized = true
  }

  const provider = await web3Auth.connect()
  if (!provider) throw new Error("Google wallet connection was cancelled.")
  return provider
}

export async function disconnectGoogleSmartWallet() {
  await web3Auth?.logout()
  initialized = false
}
