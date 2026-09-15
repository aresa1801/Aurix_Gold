// Portfolio page styling constants
export const PORTFOLIO_STYLES = {
  primaryCard: "rounded-2xl border border-soft-white/5 bg-navy-800/30 backdrop-blur-md hover:border-gold/20 transition-all duration-300",
  innerCard: "rounded-2xl border border-soft-white/5 bg-navy-900/30",
  label: "text-soft-white/50",
  heading: "font-bold text-soft-white",
  tabTrigger: "rounded-xl px-4 py-3 text-soft-white/60 data-[state=active]:bg-gold/15 data-[state=active]:text-gold data-[state=active]:shadow-none",
  inputRow: "flex items-center justify-between gap-4 border-b border-soft-white/5 py-3 last:border-b-0 last:pb-0 first:pt-0",
}

// Button variant styles
export const BUTTON_STYLES = {
  primary: "rounded-xl bg-prosperity text-navy-900 hover:bg-prosperity/80 transition-all active:scale-95",
  secondary: "rounded-xl bg-gold text-navy-900 hover:bg-gold-600 transition-all active:scale-95",
  tertiary: "rounded-xl bg-soft-white text-navy-900 hover:bg-soft-white/80 transition-all active:scale-95",
  sync: "rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50",
  outline: "rounded-xl border-gold/20 bg-transparent text-soft-white hover:bg-gold/10",
}

// Color classes for different assets
export const ASSET_COLORS = {
  IDRT: {
    color: "bg-prosperity",
    accent: "text-prosperity",
  },
  GTOKEN: {
    color: "bg-gold",
    accent: "text-gold",
  },
  BNB: {
    color: "bg-yellow-500",
    accent: "text-soft-white",
  },
}

// Transaction status badge styles
export const TRANSACTION_STATUS_STYLES = {
  completed: "border-prosperity/30 bg-prosperity/15 text-prosperity",
  pending: "border-gold/30 bg-gold/15 text-gold",
  failed: "border-red-500/30 bg-red-500/15 text-red-400",
}

// Animation classes
export const ANIMATIONS = {
  pulse: "animate-pulse",
  spin: "animate-spin",
  fadeIn: "animate-in fade-in duration-300",
  slideIn: "animate-in slide-in-from-top duration-300",
}
