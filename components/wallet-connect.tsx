"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Wallet, ChevronDown, Copy, ExternalLink, Power, RefreshCw, Network, Coins } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { contractService, requestWalletAccounts } from "@/services/contracts"
import { connectGoogleSmartWallet, disconnectGoogleSmartWallet, isWeb3AuthConfigured } from "@/services/web3auth-wallet"

const networks = [
  {
    id: "bsc",
    name: "Binance Smart Chain",
    chainId: "0x38",
    rpcUrl: "https://bsc-dataseed.binance.org/",
    currency: "BNB",
    explorer: "https://bscscan.com",
    color: "bg-yellow-500",
  },
  {
    id: "sepolia",
    name: "Sepolia Testnet",
    chainId: "0xaa36a7",
    rpcUrl: "https://sepolia.infura.io/v3/",
    currency: "ETH",
    explorer: "https://sepolia.etherscan.io",
    color: "bg-blue-500",
  },
  {
    id: "polygon",
    name: "Polygon",
    chainId: "0x89",
    rpcUrl: "https://polygon-rpc.com/",
    currency: "MATIC",
    explorer: "https://polygonscan.com",
    color: "bg-purple-500",
  },
]

interface WalletState {
  isConnected: boolean
  address: string
  balance: string
  idrtBalance: string
  goldTokenBalance: string
  network: (typeof networks)[0] | null
  isConnecting: boolean
  providerType: "metamask" | "web3auth" | null
  canClaimFaucet: boolean
  nextClaimTime: number
}

export function WalletConnect() {
  const { t } = useLanguage()
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: "",
    balance: "0.0",
    idrtBalance: "0.0",
    goldTokenBalance: "0.0",
    network: null,
    isConnecting: false,
    providerType: null,
    canClaimFaucet: false,
    nextClaimTime: 0,
  })
  const [showNetworkDialog, setShowNetworkDialog] = useState(false)
  const [isClaimingFaucet, setIsClaimingFaucet] = useState(false)

  useEffect(() => {
    const ethereum = typeof window !== "undefined" ? (window as any).ethereum : undefined
    if (!ethereum?.on) return

    const handleAccountsChanged = (accounts: string[]) => {
      if (!accounts?.[0]) disconnectWallet()
      else setWallet((prev) => ({ ...prev, address: accounts[0] }))
    }
    const handleChainChanged = () => window.location.reload()

    ethereum.on("accountsChanged", handleAccountsChanged)
    ethereum.on("chainChanged", handleChainChanged)
    return () => {
      ethereum.removeListener?.("accountsChanged", handleAccountsChanged)
      ethereum.removeListener?.("chainChanged", handleChainChanged)
    }
  }, [])

  // Load wallet data after connection
  const loadWalletData = async (address: string) => {
    try {
      console.log("🔄 Loading wallet data for:", address)

      // Check if we can initialize contracts
      let contractsAvailable = true
      try {
        await contractService.initialize()
      } catch (error) {
        console.warn("Contracts not available, using demo mode:", error)
        contractsAvailable = false
      }

      if (!contractsAvailable || contractService.isDemoMode()) {
        // Use demo data when contracts aren't available
        console.log("📱 Using demo wallet data")
        const demoData = contractService.getDemoBalances(address)

        setWallet((prev) => ({
          ...prev,
          balance: demoData.bnbBalance,
          idrtBalance: demoData.idrtBalance,
          goldTokenBalance: demoData.goldTokenBalance,
          canClaimFaucet: demoData.faucetStatus.canClaim,
          nextClaimTime: demoData.faucetStatus.nextClaimTime,
        }))
        return
      }

      // Try to load real contract data
      const syncedData = await contractService.syncWalletBalances(address)

      setWallet((prev) => ({
        ...prev,
        balance: syncedData.bnbBalance,
        idrtBalance: syncedData.idrtBalance,
        goldTokenBalance: syncedData.goldTokenBalance,
        canClaimFaucet: syncedData.faucetStatus.canClaim,
        nextClaimTime: syncedData.faucetStatus.nextClaimTime,
      }))

      console.log("✅ Real wallet data loaded successfully")
    } catch (error) {
      console.error("Failed to load wallet data:", error)

      // Fallback to demo data on any error
      console.log("📱 Falling back to demo wallet data")
      setWallet((prev) => ({
        ...prev,
        balance: "2.5847",
        idrtBalance: "50000000",
        goldTokenBalance: "125.500000",
        canClaimFaucet: true,
        nextClaimTime: 0,
      }))
    }
  }

  const connectWallet = async () => {
    if (wallet.isConnecting) return
    setWallet((prev) => ({ ...prev, isConnecting: true }))

    try {
      const ethereum = typeof window !== "undefined" ? (window as any).ethereum : undefined
      if (!ethereum?.request) {
        throw new Error("MetaMask is not installed. Install MetaMask and try again.")
      }

      const accounts = await requestWalletAccounts()
      const address = accounts?.[0]
      if (!address) throw new Error("No wallet account was selected.")

      const chainId = await ethereum.request({ method: "eth_chainId" })
      const network = networks.find((item) => item.chainId.toLowerCase() === String(chainId).toLowerCase()) ?? networks[0]

      await contractService.connectSigner(address)
      setWallet((prev) => ({ ...prev, isConnected: true, address, network, providerType: "metamask", isConnecting: false }))
      await loadWalletData(address)

      toast({
        title: t("wallet.connected"),
        description: `${t("wallet.connectedDesc")} ${address.slice(0, 6)}...${address.slice(-4)}`,
      })
    } catch (error: any) {
      const code = error?.code
      const message = code === 4001
        ? "Connection request was rejected in MetaMask. Approve the request to continue."
        : error?.message || t("wallet.connectionFailedDesc")
      console.error("Failed to connect wallet:", error)
      setWallet((prev) => ({ ...prev, isConnecting: false }))
      toast({ title: t("wallet.connectionFailed"), description: message, variant: "destructive" })
    }
  }

  const connectSmartWallet = async () => {
    if (!isWeb3AuthConfigured()) {
      toast({ title: "Google smart wallet belum dikonfigurasi", description: "Tambahkan NEXT_PUBLIC_WEB3AUTH_CLIENT_ID untuk mengaktifkan login Google.", variant: "destructive" })
      return
    }
    if (wallet.isConnecting) return
    setWallet((prev) => ({ ...prev, isConnecting: true }))
    try {
      const provider = await connectGoogleSmartWallet()
      const accounts = (await provider.request({ method: "eth_accounts" })) as string[]
      const address = accounts?.[0]
      if (!address) throw new Error("No Google smart wallet account was returned.")
      const chainId = await provider.request({ method: "eth_chainId" })
      const network = networks.find((item) => item.chainId.toLowerCase() === String(chainId).toLowerCase()) ?? networks[0]
      await contractService.connectSigner(address, provider as any)
      setWallet((prev) => ({ ...prev, isConnected: true, address, network, providerType: "web3auth", isConnecting: false }))
      await loadWalletData(address)
      toast({ title: "Google smart wallet connected", description: `${address.slice(0, 6)}...${address.slice(-4)}` })
    } catch (error: any) {
      setWallet((prev) => ({ ...prev, isConnecting: false }))
      toast({ title: "Google wallet connection failed", description: error?.message ?? "Please try again.", variant: "destructive" })
    }
  }

  const disconnectWallet = () => {
    if (wallet.providerType === "web3auth") void disconnectGoogleSmartWallet()
    setWallet({
      isConnected: false,
      address: "",
      balance: "0.0",
      idrtBalance: "0.0",
      goldTokenBalance: "0.0",
      network: null,
      isConnecting: false,
      canClaimFaucet: false,
      nextClaimTime: 0,
    })

    toast({
      title: t("wallet.disconnected"),
      description: t("wallet.disconnectedDesc"),
    })
  }

  const switchNetwork = async (network: (typeof networks)[0]) => {
    try {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        await (window as any).ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: network.chainId }],
        })
      }

      setWallet((prev) => ({ ...prev, network }))

      // Reload wallet data for new network
      if (wallet.address) {
        await loadWalletData(wallet.address)
      }

      toast({
        title: t("wallet.networkSwitched"),
        description: `${t("wallet.networkSwitchedDesc")} ${network.name}`,
      })
      setShowNetworkDialog(false)
    } catch (error) {
      console.error("Failed to switch network:", error)
      toast({
        title: "Network Switch Failed",
        description: "Failed to switch network. Please try manually.",
        variant: "destructive",
      })
    }
  }

  const claimFaucet = async () => {
    if (!wallet.canClaimFaucet || isClaimingFaucet) return

    setIsClaimingFaucet(true)
    try {
      if (wallet.isConnected && wallet.address !== "0x742d35Cc6634C0532925a3b8D4C2C4e0C8b4C8b4") {
        // Real contract interaction
        console.log("Claiming from faucet contract...")
        await contractService.claimFaucet()

        // Wait for blockchain confirmation
        await new Promise((resolve) => setTimeout(resolve, 3000))

        // Reload wallet data
        await loadWalletData(wallet.address)

        toast({
          title: "Faucet Claimed",
          description: "Successfully claimed IDRT tokens from smart contract",
        })
      } else {
        // Demo mode
        await new Promise((resolve) => setTimeout(resolve, 2000))
        const newBalance = (Number.parseFloat(wallet.idrtBalance) + 1000000).toString()
        setWallet((prev) => ({
          ...prev,
          idrtBalance: newBalance,
          canClaimFaucet: false,
          nextClaimTime: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        }))

        toast({
          title: "Faucet Claimed (Demo)",
          description: "Successfully claimed 1,000,000 IDRT tokens",
        })
      }
    } catch (error: any) {
      console.error("Failed to claim faucet:", error)

      let errorMessage = "Failed to claim tokens from faucet"
      if (error.message?.includes("insufficient funds")) {
        errorMessage = "Insufficient BNB for gas fees"
      } else if (error.message?.includes("already claimed")) {
        errorMessage = "Already claimed recently. Wait for cooldown."
      }

      toast({
        title: "Claim Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsClaimingFaucet(false)
    }
  }

  const reinitializeWallet = async () => {
    if (!wallet.isConnected) return

    try {
      await loadWalletData(wallet.address)

      toast({
        title: t("wallet.refreshed"),
        description: t("wallet.refreshedDesc"),
      })
    } catch (error) {
      console.error("Failed to reinitialize wallet:", error)
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh wallet data",
        variant: "destructive",
      })
    }
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.address)
    toast({
      title: t("wallet.addressCopied"),
      description: t("wallet.addressCopiedDesc"),
    })
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatBalance = (balance: string) => {
    const num = Number.parseFloat(balance)
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`
    }
    return num.toFixed(4)
  }

  if (!wallet.isConnected) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button disabled={wallet.isConnecting} className="bg-gold hover:bg-gold-600 text-navy-900 font-semibold">
            {wallet.isConnecting ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Wallet className="h-4 w-4 mr-2" />}
            {wallet.isConnecting ? t("wallet.connecting") : t("nav.connectWallet")}
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-navy-800 border-gold/20">
          <DialogHeader>
            <DialogTitle className="text-gold">Connect to AuriX</DialogTitle>
            <DialogDescription className="text-soft-white/70">Choose MetaMask or create an embedded smart wallet with Google.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <Button onClick={connectWallet} className="bg-gold text-navy-900 hover:bg-gold-600"><Wallet className="mr-2 h-4 w-4" />Connect MetaMask</Button>
            <Button onClick={connectSmartWallet} variant="outline" className="border-gold/30 text-soft-white hover:bg-gold/10"><span className="mr-2 text-base font-bold">G</span>Continue with Google smart wallet</Button>
            {!isWeb3AuthConfigured() && <p className="text-xs text-soft-white/50">Google smart wallet requires Web3Auth configuration. MetaMask is ready now.</p>}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-prosperity hover:bg-prosperity/80 text-navy-900 font-semibold">
          <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full ${wallet.network?.color}`}></div>
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">{formatAddress(wallet.address)}</span>
            <ChevronDown className="h-3 w-3" />
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 bg-navy-800 border-gold/20">
        <DropdownMenuLabel className="text-gold">{t("wallet.walletDetails")}</DropdownMenuLabel>

        <div className="px-2 py-3 space-y-3">
          {/* Address */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-soft-white/70">{t("wallet.address")}:</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-mono text-soft-white">{formatAddress(wallet.address)}</span>
              <Button variant="ghost" size="sm" onClick={copyAddress} className="h-6 w-6 p-0">
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* BNB Balance */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-soft-white/70">BNB {t("wallet.balance")}:</span>
            <span className="text-sm font-semibold text-prosperity">
              {formatBalance(wallet.balance)} {wallet.network?.currency}
            </span>
          </div>

          {/* IDRT Balance */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-soft-white/70">IDRT Balance:</span>
            <span className="text-sm font-semibold text-gold">Rp {formatBalance(wallet.idrtBalance)}</span>
          </div>

          {/* G-Token Balance */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-soft-white/70">G-TOKEN Balance:</span>
            <span className="text-sm font-semibold text-gold">{formatBalance(wallet.goldTokenBalance)} g</span>
          </div>

          {/* Network */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-soft-white/70">{t("wallet.network")}:</span>
            <Badge className={`${wallet.network?.color} text-white border-0`}>{wallet.network?.name}</Badge>
          </div>
        </div>

        <DropdownMenuSeparator className="bg-gold/20" />

        {/* Faucet Claim */}
        <DropdownMenuItem
          onClick={claimFaucet}
          disabled={!wallet.canClaimFaucet || isClaimingFaucet}
          className={wallet.canClaimFaucet ? "text-prosperity" : "text-soft-white/50"}
        >
          <Coins className="h-4 w-4 mr-2" />
          {isClaimingFaucet ? "Claiming..." : "Claim IDRT Faucet"}
        </DropdownMenuItem>

        {/* Network Switch */}
        <Dialog open={showNetworkDialog} onOpenChange={setShowNetworkDialog}>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Network className="h-4 w-4 mr-2" />
              {t("wallet.switchNetwork")}
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="bg-navy-800 border-gold/20">
            <DialogHeader>
              <DialogTitle className="text-gold">{t("wallet.selectNetwork")}</DialogTitle>
              <DialogDescription className="text-soft-white/70">{t("wallet.selectNetworkDesc")}</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              {networks.map((network) => (
                <Button
                  key={network.id}
                  variant="outline"
                  className="w-full justify-start border-gold/20 hover:bg-gold/10 bg-transparent"
                  onClick={() => switchNetwork(network)}
                >
                  <div className={`h-3 w-3 rounded-full ${network.color} mr-3`}></div>
                  <div className="text-left">
                    <div className="font-medium text-soft-white">{network.name}</div>
                    <div className="text-xs text-soft-white/70">{network.currency}</div>
                  </div>
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Reinitialize */}
        <DropdownMenuItem onClick={reinitializeWallet}>
          <RefreshCw className="h-4 w-4 mr-2" />
          {t("wallet.reinitializeWallet")}
        </DropdownMenuItem>

        {/* View on Explorer */}
        <DropdownMenuItem asChild>
          <a
            href={`${wallet.network?.explorer}/address/${wallet.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            {t("wallet.viewOnExplorer")}
          </a>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gold/20" />

        {/* Disconnect */}
        <DropdownMenuItem onClick={disconnectWallet} className="text-red-400 focus:text-red-400">
          <Power className="h-4 w-4 mr-2" />
          {t("wallet.disconnect")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
