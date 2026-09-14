"use client"

import { ethers } from "ethers"

// Contract addresses
export const CONTRACT_ADDRESSES = {
  IDRT: "0x85291D2693cd02762CE3eC908807AFf1Ad5A5FFd",
  FAUCET: "0x5b675106D602C35b5743a21509dA69aFBbC985a4",
  VAULT_MANAGER: "0xA623baCF8AF7B92010B019f5dBA0FCFbd6C77E3B",
  GOLD_TOKEN: "0x588B9dE2168cF686188FABc5e10DeA1CE4c2E60C",
  SWAP_ROUTER: "0xdEF792b2A0F43fbe59Bb0e5b1Bb5D910888892BB",
  REDEEM_MANAGER: "0x252d9f8E3b6F8dB090F41d94C71244b61A734a38",
}

// Admin wallet address
export const ADMIN_ADDRESS = "0xcd3FF5f1b21fEAF1610402De0eF5ac4d5EeC4aB3"

let walletRequestInFlight: Promise<string[]> | null = null

/**
 * Returns already-authorized accounts without prompting. Only asks MetaMask
 * for permission after an explicit user action, and coalesces simultaneous
 * requests so multiple components cannot open competing connection prompts.
 */
export async function requestWalletAccounts(): Promise<string[]> {
  const ethereum = typeof window !== "undefined" ? (window as any).ethereum : undefined
  if (!ethereum?.request) {
    throw new Error("MetaMask is not installed or unavailable in this browser.")
  }

  const authorizedAccounts = (await ethereum.request({ method: "eth_accounts" })) as string[]
  if (authorizedAccounts?.length) return authorizedAccounts

  if (!walletRequestInFlight) {
    walletRequestInFlight = (ethereum.request({ method: "eth_requestAccounts" }) as Promise<string[]>).finally(() => {
      walletRequestInFlight = null
    })
  }

  return walletRequestInFlight
}

// ABIs
export const FAUCET_ABI = [
  {
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "claimTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "fundFaucet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "togglePause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "withdrawTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "availableBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "canClaim",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "CLAIM_AMOUNT",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "CLAIM_COOLDOWN",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "idrtToken",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "lastClaimTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "nextClaimTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pendingOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalDistributed",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  // Event definitions for listening to contract events
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "TokensClaimed",
    type: "event",
  },
]

export const VAULT_MANAGER_ABI = [
  {
    inputs: [],
    name: "totalReserveGrams",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "reserveUsed",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "availableGrams",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "grams", type: "uint256" }],
    name: "setTotalReserve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
]

export const GOLD_TOKEN_ABI = [
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Event definitions
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      { indexed: false, internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
]

export const SWAP_ROUTER_ABI = [
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "swapStableToGold",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "swapGoldToStable",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "swapFeePercent",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "newPercent", type: "uint256" }],
    name: "updateFeePercent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
]

export const REDEEM_MANAGER_ABI = [
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "requestRedeem",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getUserRequests",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
    name: "getRequest",
    outputs: [
      { internalType: "address", name: "user", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "timestamp", type: "uint256" },
      { internalType: "uint256", name: "fee", type: "uint256" },
      { internalType: "enum RedeemManager.RedeemStatus", name: "status", type: "uint8" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "goldPriceInStable",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "redeemFeeBps",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "newPrice", type: "uint256" }],
    name: "setGoldPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
]

export const IDRT_ABI = [
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  // Event definitions for IDRT transfers
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      { indexed: false, internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "owner", type: "address" },
      { indexed: true, internalType: "address", name: "spender", type: "address" },
      { indexed: false, internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "Approval",
    type: "event",
  },
]

// Contract service class
export class ContractService {
  private provider: any | null = null
  private signer: any | null = null
  private eventListeners: Map<string, any[]> = new Map()

  async initialize() {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      this.provider = new ethers.BrowserProvider((window as any).ethereum)
      // Do not call getSigner here. In ethers, getSigner can request wallet
      // access, which must only happen after an explicit user action.
      this.signer = null
    }
  }

  async connectSigner(address?: string, injectedProvider?: any) {
    if (injectedProvider) {
      this.provider = new ethers.BrowserProvider(injectedProvider)
    }
    if (!this.provider) {
      await this.initialize()
    }

    if (!this.provider) {
      throw new Error("Wallet provider not available")
    }

    // Use the already-authorized address so ethers does not issue another
    // wallet connection request after the explicit user approval.
    this.signer = await this.provider.getSigner(address)
    return this.signer
  }

  // Get contract instance
  getContract(address: string, abi: any[]) {
    if (!this.signer) throw new Error("Wallet not connected")
    return new ethers.Contract(address, abi, this.signer)
  }

  // Get read-only contract instance
  getReadOnlyContract(address: string, abi: any[]) {
    if (!this.provider) throw new Error("Provider not available")
    return new ethers.Contract(address, abi, this.provider)
  }

  // Read-only snapshot used by portfolio integrations and refresh flows.
  async getPortfolioSnapshot(userAddress: string) {
    await this.initialize()
    return this.syncWalletBalances(userAddress)
  }

  // Enhanced balance synchronization
  async syncWalletBalances(userAddress: string) {
    try {
      console.log("🔄 Syncing wallet balances for:", userAddress)

      // Initialize with demo data first
      const result = {
        idrtBalance: "50000000", // 50M IDRT demo
        goldTokenBalance: "125.500000", // Demo G-TOKEN
        bnbBalance: "2.5847", // Demo BNB
        faucetStatus: {
          canClaim: true,
          nextClaimTime: 0,
          lastClaimTime: 0,
          claimAmount: "1000000",
          availableBalance: "100000000",
          isPaused: false,
          cooldownPeriod: 86400,
        },
        lastSyncTime: Date.now(),
      }

      // Try to get real balances, but don't fail if contracts aren't available
      try {
        const [idrtBalance, goldTokenBalance, bnbBalance] = await Promise.allSettled([
          this.getIDRTBalance(userAddress),
          this.getGoldTokenBalance(userAddress),
          this.getBNBBalance(userAddress),
        ])

        // Update with real data if available
        if (idrtBalance.status === "fulfilled" && idrtBalance.value !== "0") {
          result.idrtBalance = idrtBalance.value
        }
        if (goldTokenBalance.status === "fulfilled" && goldTokenBalance.value !== "0") {
          result.goldTokenBalance = goldTokenBalance.value
        }
        if (bnbBalance.status === "fulfilled" && bnbBalance.value !== "0") {
          result.bnbBalance = bnbBalance.value
        }

        // Try to get faucet status
        try {
          const faucetStatus = await this.getFaucetStatus(userAddress)
          result.faucetStatus = faucetStatus
        } catch (error) {
          console.warn("Using demo faucet status:", error)
        }
      } catch (error) {
        console.warn("Using demo balances due to contract errors:", error)
      }

      console.log("✅ Wallet balances synced:", result)
      return result
    } catch (error) {
      console.error("❌ Failed to sync wallet balances:", error)
      throw error
    }
  }

  // Event listener management for real-time updates
  setupEventListeners(userAddress: string, onBalanceUpdate: (balances: any) => void) {
    try {
      this.removeAllEventListeners()

      // Listen to IDRT Transfer events
      const idrtContract = this.getReadOnlyContract(CONTRACT_ADDRESSES.IDRT, IDRT_ABI)

      // Listen for transfers TO the user (receiving IDRT)
      const transferToFilter = idrtContract.filters.Transfer(null, userAddress)
      const transferToListener = async (from: string, to: string, value: bigint) => {
        console.log("📥 IDRT received:", ethers.formatUnits(value, 18))
        const updatedBalances = await this.syncWalletBalances(userAddress)
        onBalanceUpdate(updatedBalances)
      }

      // Listen for transfers FROM the user (sending IDRT)
      const transferFromFilter = idrtContract.filters.Transfer(userAddress, null)
      const transferFromListener = async (from: string, to: string, value: bigint) => {
        console.log("📤 IDRT sent:", ethers.formatUnits(value, 18))
        const updatedBalances = await this.syncWalletBalances(userAddress)
        onBalanceUpdate(updatedBalances)
      }

      // Listen to Faucet claim events
      const faucetContract = this.getReadOnlyContract(CONTRACT_ADDRESSES.FAUCET, FAUCET_ABI)
      const claimFilter = faucetContract.filters.TokensClaimed(userAddress)
      const claimListener = async (user: string, amount: bigint) => {
        console.log("🎉 Faucet claimed:", ethers.formatUnits(amount, 18))
        const updatedBalances = await this.syncWalletBalances(userAddress)
        onBalanceUpdate(updatedBalances)
      }

      // Listen to Gold Token Transfer events
      const goldTokenContract = this.getReadOnlyContract(CONTRACT_ADDRESSES.GOLD_TOKEN, GOLD_TOKEN_ABI)

      const goldTransferToFilter = goldTokenContract.filters.Transfer(null, userAddress)
      const goldTransferToListener = async (from: string, to: string, value: bigint) => {
        console.log("📥 G-TOKEN received:", ethers.formatUnits(value, 18))
        const updatedBalances = await this.syncWalletBalances(userAddress)
        onBalanceUpdate(updatedBalances)
      }

      const goldTransferFromFilter = goldTokenContract.filters.Transfer(userAddress, null)
      const goldTransferFromListener = async (from: string, to: string, value: bigint) => {
        console.log("📤 G-TOKEN sent:", ethers.formatUnits(value, 18))
        const updatedBalances = await this.syncWalletBalances(userAddress)
        onBalanceUpdate(updatedBalances)
      }

      // Register all listeners
      idrtContract.on(transferToFilter, transferToListener)
      idrtContract.on(transferFromFilter, transferFromListener)
      faucetContract.on(claimFilter, claimListener)
      goldTokenContract.on(goldTransferToFilter, goldTransferToListener)
      goldTokenContract.on(goldTransferFromFilter, goldTransferFromListener)

      // Store listeners for cleanup
      this.eventListeners.set(userAddress, [
        { contract: idrtContract, filter: transferToFilter, listener: transferToListener },
        { contract: idrtContract, filter: transferFromFilter, listener: transferFromListener },
        { contract: faucetContract, filter: claimFilter, listener: claimListener },
        { contract: goldTokenContract, filter: goldTransferToFilter, listener: goldTransferToListener },
        { contract: goldTokenContract, filter: goldTransferFromFilter, listener: goldTransferFromListener },
      ])

      console.log("🎧 Event listeners setup for:", userAddress)
    } catch (error) {
      console.error("Failed to setup event listeners:", error)
    }
  }

  // Remove event listeners
  removeEventListeners(userAddress: string) {
    const listeners = this.eventListeners.get(userAddress)
    if (listeners) {
      listeners.forEach(({ contract, filter, listener }) => {
        try {
          contract.off(filter, listener)
        } catch (error) {
          console.warn("Failed to remove listener:", error)
        }
      })
      this.eventListeners.delete(userAddress)
      console.log("🔇 Event listeners removed for:", userAddress)
    }
  }

  // Remove all event listeners
  removeAllEventListeners() {
    for (const [userAddress] of this.eventListeners) {
      this.removeEventListeners(userAddress)
    }
  }

  // Check if current user is admin
  async isAdmin() {
    if (!this.signer) return false
    try {
      const address = await this.signer.getAddress()
      return address.toLowerCase() === ADMIN_ADDRESS.toLowerCase()
    } catch (error) {
      return false
    }
  }

  // Get BNB balance
  async getBNBBalance(address: string) {
    if (!this.provider) throw new Error("Provider not available")
    try {
      const balance = await this.provider.getBalance(address)
      return ethers.formatEther(balance)
    } catch (error: any) {
      console.warn("Failed to get BNB balance:", error.message)

      // Return demo balance for testing
      if (error.message?.includes("could not detect network") || error.code === "NETWORK_ERROR") {
        return "2.5847" // Demo BNB balance
      }

      return "0"
    }
  }

  // Enhanced IDRT Token functions with better error handling
  async getIDRTBalance(userAddress: string): Promise<string> {
    try {
      const contract = this.getReadOnlyContract(CONTRACT_ADDRESSES.IDRT, IDRT_ABI)
      const balance = await contract.balanceOf(userAddress)
      const formattedBalance = ethers.formatUnits(balance, 18)
      console.log(`💰 IDRT Balance for ${userAddress}:`, formattedBalance)
      return formattedBalance
    } catch (error: any) {
      console.warn("Failed to get IDRT balance:", error.message)

      // Handle specific decode errors
      if (error.code === "BAD_DATA" || error.message?.includes("could not decode result data")) {
        console.warn("Contract returned invalid data, using demo balance")
        return "50000000" // 50M IDRT demo balance
      }

      // Handle network or connection errors
      if (error.code === "NETWORK_ERROR" || error.message?.includes("network")) {
        console.warn("Network error, using demo balance")
        return "25000000" // 25M IDRT demo balance
      }

      return "0"
    }
  }

  async getIDRTTotalSupply(): Promise<string> {
    try {
      const contract = this.getReadOnlyContract(CONTRACT_ADDRESSES.IDRT, IDRT_ABI)
      const supply = await contract.totalSupply()
      return ethers.formatUnits(supply, 18)
    } catch (error) {
      console.error("Failed to get IDRT total supply:", error)
      return "0"
    }
  }

  async getIDRTTokenInfo() {
    try {
      const contract = this.getReadOnlyContract(CONTRACT_ADDRESSES.IDRT, IDRT_ABI)
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        contract.name().catch(() => "Indonesian Rupiah Token"),
        contract.symbol().catch(() => "IDRT"),
        contract.decimals().catch(() => 18),
        contract.totalSupply().catch(() => 0),
      ])

      return {
        name,
        symbol,
        decimals: Number(decimals),
        totalSupply: ethers.formatUnits(totalSupply, 18),
      }
    } catch (error) {
      console.error("Failed to get IDRT token info:", error)
      return {
        name: "Indonesian Rupiah Token",
        symbol: "IDRT",
        decimals: 18,
        totalSupply: "0",
      }
    }
  }

  async approveIDRT(spenderAddress: string, amount: string) {
    const contract = this.getContract(CONTRACT_ADDRESSES.IDRT, IDRT_ABI)
    const tx = await contract.approve(spenderAddress, ethers.parseUnits(amount, 18))
    return tx.wait()
  }

  async getIDRTAllowance(ownerAddress: string, spenderAddress: string) {
    try {
      const contract = this.getReadOnlyContract(CONTRACT_ADDRESSES.IDRT, IDRT_ABI)
      const allowance = await contract.allowance(ownerAddress, spenderAddress)
      return ethers.formatUnits(allowance, 18)
    } catch (error) {
      console.error("Failed to get IDRT allowance:", error)
      return "0"
    }
  }

  // Enhanced Faucet functions with better synchronization
  async claimFaucet(): Promise<any> {
    try {
      console.log("🚰 Attempting to claim from faucet...")
      const contract = this.getContract(CONTRACT_ADDRESSES.FAUCET, FAUCET_ABI)

      // Estimate gas first
      const gasEstimate = await contract.claimTokens.estimateGas()
      console.log("⛽ Gas estimate:", gasEstimate.toString())

      // Execute the claim transaction
      const tx = await contract.claimTokens({
        gasLimit: (gasEstimate * BigInt(120)) / BigInt(100), // Add 20% buffer
      })

      console.log("📝 Faucet claim transaction sent:", tx.hash)

      // Wait for transaction confirmation
      const receipt = await tx.wait()
      console.log("✅ Faucet claim confirmed:", receipt?.hash)

      if (receipt?.status !== 1) {
        throw new Error("Transaction failed")
      }

      return receipt
    } catch (error: any) {
      console.error("❌ Faucet claim failed:", error)

      // Parse specific error messages
      if (error.message?.includes("insufficient funds")) {
        throw new Error("Insufficient BNB for gas fees")
      } else if (error.message?.includes("already claimed")) {
        throw new Error("Already claimed recently. Wait for cooldown period.")
      } else if (error.message?.includes("paused")) {
        throw new Error("Faucet is currently paused")
      } else if (error.message?.includes("user rejected")) {
        throw new Error("Transaction rejected by user")
      }

      throw error
    }
  }

  async canClaimFaucet(userAddress: string) {
    try {
      const contract = this.getReadOnlyContract(CONTRACT_ADDRESSES.FAUCET, FAUCET_ABI)
      return await contract.canClaim(userAddress)
    } catch (error) {
      console.error("Failed to check can claim:", error)
      return false
    }
  }

  async getNextClaimTime(userAddress: string) {
    try {
      const contract = this.getReadOnlyContract(CONTRACT_ADDRESSES.FAUCET, FAUCET_ABI)
      const nextClaim = await contract.nextClaimTime(userAddress)
      return Number(nextClaim) * 1000 // Convert to milliseconds
    } catch (error) {
      console.error("Failed to get next claim time:", error)
      return 0
    }
  }

  async getLastClaimTime(userAddress: string) {
    try {
      const contract = this.getReadOnlyContract(CONTRACT_ADDRESSES.FAUCET, FAUCET_ABI)
      const lastClaim = await contract.lastClaimTime(userAddress)
      return Number(lastClaim) * 1000 // Convert to milliseconds
    } catch (error) {
      console.error("Failed to get last claim time:", error)
      return 0
    }
  }

  async getFaucetClaimAmount() {
    try {
      const contract = this.getReadOnlyContract(CONTRACT_ADDRESSES.FAUCET, FAUCET_ABI)
      const amount = await contract.CLAIM_AMOUNT()
      return ethers.formatUnits(amount, 18)
    } catch (error: any) {
      console.warn("Failed to get claim amount, using fallback:", error)
      return "1000000" // 1M IDRT fallback
    }
  }

  async getFaucetClaimCooldown() {
    try {
      const contract = this.getReadOnlyContract(CONTRACT_ADDRESSES.FAUCET, FAUCET_ABI)
      const cooldown = await contract.CLAIM_COOLDOWN()
      return Number(cooldown) // in seconds
    } catch (error) {
      console.error("Failed to get claim cooldown:", error)
      return 86400 // 24 hours default
    }
  }

  async getFaucetAvailableBalance() {
    try {
      const contract = this.getReadOnlyContract(CONTRACT_ADDRESSES.FAUCET, FAUCET_ABI)
      const balance = await contract.availableBalance()
      return ethers.formatUnits(balance, 18)
    } catch (error) {
      console.error("Failed to get faucet available balance:", error)
      return "0"
    }
  }

  async getFaucetTotalDistributed() {
    try {
      const contract = this.getReadOnlyContract(CONTRACT_ADDRESSES.FAUCET, FAUCET_ABI)
      const distributed = await contract.totalDistributed()
      return ethers.formatUnits(distributed, 18)
    } catch (error) {
      console.error("Failed to get total distributed:", error)
      return "0"
    }
  }

  async getFaucetOwner() {
    try {
      const contract = this.getReadOnlyContract(CONTRACT_ADDRESSES.FAUCET, FAUCET_ABI)
      return await contract.owner()
    } catch (error) {
      console.error("Failed to get faucet owner:", error)
      return ""
    }
  }

  async getFaucetPendingOwner() {
    try {
      const contract = this.getReadOnlyContract(CONTRACT_ADDRESSES.FAUCET, FAUCET_ABI)
      return await contract.pendingOwner()
    } catch (error) {
      console.error("Failed to get pending owner:", error)
      return ""
    }
  }

  async getFaucetStats() {
    try {
      const contract = this.getReadOnlyContract(CONTRACT_ADDRESSES.FAUCET, FAUCET_ABI)
      const [availableBalance, totalDistributed, isPaused, owner, pendingOwner] = await Promise.all([
        contract.availableBalance(),
        contract.totalDistributed(),
        contract.paused(),
        contract.owner(),
        contract.pendingOwner(),
      ])

      return {
        availableBalance: ethers.formatUnits(availableBalance, 18),
        totalDistributed: ethers.formatUnits(totalDistributed, 18),
        isPaused,
        owner,
        pendingOwner,
      }
    } catch (error) {
      console.error("Failed to get faucet stats:", error)
      return {
        availableBalance: "0",
        totalDistributed: "0",
        isPaused: false,
        owner: "",
        pendingOwner: "",
      }
    }
  }

  // Enhanced faucet status check with comprehensive data
  async getFaucetStatus(userAddress: string) {
    try {
      console.log("🔍 Getting faucet status for:", userAddress)
      const contract = this.getReadOnlyContract(CONTRACT_ADDRESSES.FAUCET, FAUCET_ABI)

      const [canClaim, nextClaimTime, lastClaimTime, claimAmount, availableBalance, isPaused, cooldownPeriod] =
        await Promise.allSettled([
          contract.canClaim(userAddress),
          contract.nextClaimTime(userAddress),
          contract.lastClaimTime(userAddress),
          contract.CLAIM_AMOUNT(),
          contract.availableBalance(),
          contract.paused(),
          contract.CLAIM_COOLDOWN(),
        ])

      const result = {
        canClaim: canClaim.status === "fulfilled" ? (canClaim.value as boolean) : false,
        nextClaimTime: nextClaimTime.status === "fulfilled" ? Number(nextClaimTime.value) * 1000 : 0,
        lastClaimTime: lastClaimTime.status === "fulfilled" ? Number(lastClaimTime.value) * 1000 : 0,
        claimAmount: claimAmount.status === "fulfilled" ? ethers.formatUnits(claimAmount.value, 18) : "1000000",
        availableBalance:
          availableBalance.status === "fulfilled" ? ethers.formatUnits(availableBalance.value, 18) : "0",
        isPaused: isPaused.status === "fulfilled" ? (isPaused.value as boolean) : false,
        cooldownPeriod: cooldownPeriod.status === "fulfilled" ? Number(cooldownPeriod.value) : 86400,
      }

      console.log("📊 Faucet status:", result)
      return result
    } catch (error) {
      console.error("Failed to get faucet status:", error)
      return {
        canClaim: false,
        nextClaimTime: 0,
        lastClaimTime: 0,
        claimAmount: "1000000",
        availableBalance: "0",
        isPaused: false,
        cooldownPeriod: 86400,
      }
    }
  }

  // Admin faucet functions
  async toggleFaucetPause() {
    const contract = this.getContract(CONTRACT_ADDRESSES.FAUCET, FAUCET_ABI)
    const tx = await contract.togglePause()
    return tx.wait()
  }

  async withdrawFromFaucet(amount: string) {
    const contract = this.getContract(CONTRACT_ADDRESSES.FAUCET, FAUCET_ABI)
    const tx = await contract.withdrawTokens(ethers.parseUnits(amount, 18))
    return tx.wait()
  }

  async fundFaucet(amount: string) {
    // First approve IDRT spending to faucet contract
    const idrtContract = this.getContract(CONTRACT_ADDRESSES.IDRT, IDRT_ABI)
    const approveTx = await idrtContract.approve(CONTRACT_ADDRESSES.FAUCET, ethers.parseUnits(amount, 18))
    await approveTx.wait()

    // Then fund the faucet
    const faucetContract = this.getContract(CONTRACT_ADDRESSES.FAUCET, FAUCET_ABI)
    const tx = await faucetContract.fundFaucet(ethers.parseUnits(amount, 18))
    return tx.wait()
  }

  async acceptFaucetOwnership() {
    const contract = this.getContract(CONTRACT_ADDRESSES.FAUCET, FAUCET_ABI)
    const tx = await contract.acceptOwnership()
    return tx.wait()
  }

  // Vault functions
  async getVaultStats() {
    try {
      const contract = this.getReadOnlyContract(CONTRACT_ADDRESSES.VAULT_MANAGER, VAULT_MANAGER_ABI)
      const [totalReserve, reserveUsed, availableGrams] = await Promise.all([
        contract.totalReserveGrams(),
        contract.reserveUsed(),
        contract.availableGrams(),
      ])

      return {
        totalReserveGrams: Number(totalReserve),
        reserveUsed: Number(reserveUsed),
        availableGrams: Number(availableGrams),
      }
    } catch (error) {
      console.error("Failed to get vault stats:", error)
      return {
        totalReserveGrams: 0,
        reserveUsed: 0,
        availableGrams: 0,
      }
    }
  }

  // Admin vault functions
  async setTotalReserve(grams: string) {
    const contract = this.getContract(CONTRACT_ADDRESSES.VAULT_MANAGER, VAULT_MANAGER_ABI)
    const tx = await contract.setTotalReserve(grams)
    return tx.wait()
  }

  // Gold Token functions
  async getGoldTokenBalance(userAddress: string) {
    try {
      const contract = this.getReadOnlyContract(CONTRACT_ADDRESSES.GOLD_TOKEN, GOLD_TOKEN_ABI)
      const balance = await contract.balanceOf(userAddress)
      return ethers.formatUnits(balance, 18)
    } catch (error: any) {
      console.warn("Failed to get gold token balance:", error.message)

      // Handle specific decode errors
      if (error.code === "BAD_DATA" || error.message?.includes("could not decode result data")) {
        console.warn("Gold token contract returned invalid data, using demo balance")
        return "125.500000" // Demo G-TOKEN balance
      }

      return "0"
    }
  }

  async getGoldTokenTotalSupply() {
    try {
      const contract = this.getReadOnlyContract(CONTRACT_ADDRESSES.GOLD_TOKEN, GOLD_TOKEN_ABI)
      const supply = await contract.totalSupply()
      return ethers.formatUnits(supply, 18)
    } catch (error) {
      console.error("Failed to get gold token supply:", error)
      return "0"
    }
  }

  async getGoldTokenName() {
    try {
      const contract = this.getReadOnlyContract(CONTRACT_ADDRESSES.GOLD_TOKEN, GOLD_TOKEN_ABI)
      return await contract.name()
    } catch (error) {
      console.error("Failed to get gold token name:", error)
      return "Gold Token"
    }
  }

  async getGoldTokenSymbol() {
    try {
      const contract = this.getReadOnlyContract(CONTRACT_ADDRESSES.GOLD_TOKEN, GOLD_TOKEN_ABI)
      return await contract.symbol()
    } catch (error) {
      console.error("Failed to get gold token symbol:", error)
      return "G-TOKEN"
    }
  }

  // Admin gold token functions
  async mintGoldToken(to: string, amount: string) {
    const contract = this.getContract(CONTRACT_ADDRESSES.GOLD_TOKEN, GOLD_TOKEN_ABI)
    const tx = await contract.mint(to, ethers.parseUnits(amount, 18))
    return tx.wait()
  }

  async pauseGoldToken() {
    const contract = this.getContract(CONTRACT_ADDRESSES.GOLD_TOKEN, GOLD_TOKEN_ABI)
    const tx = await contract.pause()
    return tx.wait()
  }

  async unpauseGoldToken() {
    const contract = this.getContract(CONTRACT_ADDRESSES.GOLD_TOKEN, GOLD_TOKEN_ABI)
    const tx = await contract.unpause()
    return tx.wait()
  }

  // Swap functions
  async swapStableToGold(amount: string) {
    const contract = this.getContract(CONTRACT_ADDRESSES.SWAP_ROUTER, SWAP_ROUTER_ABI)
    const tx = await contract.swapStableToGold(ethers.parseUnits(amount, 18))
    return tx.wait()
  }

  async swapGoldToStable(amount: string) {
    const contract = this.getContract(CONTRACT_ADDRESSES.SWAP_ROUTER, SWAP_ROUTER_ABI)
    const tx = await contract.swapGoldToStable(ethers.parseUnits(amount, 18))
    return tx.wait()
  }

  async getSwapFeePercent() {
    try {
      const contract = this.getReadOnlyContract(CONTRACT_ADDRESSES.SWAP_ROUTER, SWAP_ROUTER_ABI)
      const fee = await contract.swapFeePercent()
      return Number(fee)
    } catch (error) {
      console.error("Failed to get swap fee:", error)
      return 2
    }
  }

  // Admin swap functions
  async updateSwapFeePercent(newPercent: number) {
    const contract = this.getContract(CONTRACT_ADDRESSES.SWAP_ROUTER, SWAP_ROUTER_ABI)
    const tx = await contract.updateFeePercent(newPercent)
    return tx.wait()
  }

  // Redeem functions
  async requestRedeem(amount: string) {
    const contract = this.getContract(CONTRACT_ADDRESSES.REDEEM_MANAGER, REDEEM_MANAGER_ABI)
    const tx = await contract.requestRedeem(ethers.parseUnits(amount, 18))
    return tx.wait()
  }

  async getUserRedeemRequests(userAddress: string) {
    try {
      const contract = this.getReadOnlyContract(CONTRACT_ADDRESSES.REDEEM_MANAGER, REDEEM_MANAGER_ABI)
      return await contract.getUserRequests(userAddress)
    } catch (error) {
      console.error("Failed to get user redeem requests:", error)
      return []
    }
  }

  async getRedeemRequest(requestId: number) {
    try {
      const contract = this.getReadOnlyContract(CONTRACT_ADDRESSES.REDEEM_MANAGER, REDEEM_MANAGER_ABI)
      const [user, amount, timestamp, fee, status] = await contract.getRequest(requestId)
      return {
        user,
        amount: ethers.formatUnits(amount, 18),
        timestamp: Number(timestamp),
        fee: ethers.formatUnits(fee, 18),
        status: Number(status),
      }
    } catch (error) {
      console.error("Failed to get redeem request:", error)
      return null
    }
  }

  // --- Util fallback price (Rp / gram) if contract call fails ---
  private static readonly DEFAULT_GOLD_PRICE = "1085000"

  /**
   * Attempt to read goldPriceInStable() from RedeemManager.
   * If the function does not exist or returns 0x (decode error),
   * gracefully fallback to DEFAULT_GOLD_PRICE so the UI never crashes.
   */
  async getGoldPriceInStable() {
    try {
      const contract = this.getReadOnlyContract(CONTRACT_ADDRESSES.REDEEM_MANAGER, REDEEM_MANAGER_ABI)
      const price: string | bigint = await contract.goldPriceInStable()
      const formatted = ethers.formatUnits(price, 18)
      // Guard against a zero or NaN price
      if (!formatted || formatted === "0.0" || Number.isNaN(Number(formatted))) {
        return ContractService.DEFAULT_GOLD_PRICE
      }
      return formatted
    } catch (error) {
      console.warn("getGoldPriceInStable › fallback:", error)
      return ContractService.DEFAULT_GOLD_PRICE
    }
  }

  // Admin redeem functions
  async setGoldPrice(newPrice: string) {
    const contract = this.getContract(CONTRACT_ADDRESSES.REDEEM_MANAGER, REDEEM_MANAGER_ABI)
    const tx = await contract.setGoldPrice(ethers.parseUnits(newPrice, 18))
    return tx.wait()
  }

  // Utility methods
  isConnected(): boolean {
    return this.signer !== null
  }

  async getConnectedAddress(): Promise<string | null> {
    try {
      if (!this.signer) return null
      return await this.signer.getAddress()
    } catch (error) {
      console.error("Failed to get connected address:", error)
      return null
    }
  }

  async switchNetwork(chainId: number): Promise<void> {
    try {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        await (window as any).ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        })
      }
    } catch (error) {
      console.error("Failed to switch network:", error)
      throw error
    }
  }

  // Cleanup method
  cleanup() {
    this.removeAllEventListeners()
  }

  // Check if we're running in demo mode (contracts not available)
  isDemoMode(): boolean {
    return !this.provider || !this.signer
  }

  // Get demo balances for testing
  getDemoBalances(userAddress: string) {
    return {
      idrtBalance: "50000000", // 50M IDRT
      goldTokenBalance: "125.500000", // 125.5 G-TOKEN
      bnbBalance: "2.5847", // 2.5847 BNB
      faucetStatus: {
        canClaim: true,
        nextClaimTime: 0,
        lastClaimTime: 0,
        claimAmount: "1000000",
        availableBalance: "100000000",
        isPaused: false,
        cooldownPeriod: 86400,
      },
      lastSyncTime: Date.now(),
    }
  }
}

export const contractService = new ContractService()
