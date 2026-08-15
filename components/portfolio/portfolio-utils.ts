/**
 * Portfolio formatting and utility functions
 */

/**
 * Format a number into a human-readable format (K, M, B)
 * @param num - Number to format
 * @returns Formatted string
 */
export function formatNumber(num: string | number): string {
  const n = typeof num === "string" ? parseFloat(num) : num

  if (isNaN(n)) return "0"

  if (n >= 1000000000) {
    return `${(n / 1000000000).toFixed(2)}B`
  } else if (n >= 1000000) {
    return `${(n / 1000000).toFixed(2)}M`
  } else if (n >= 1000) {
    return `${(n / 1000).toFixed(2)}K`
  }

  return n.toLocaleString()
}

/**
 * Format a number as currency with IDR symbol
 * @param num - Number to format
 * @returns Formatted currency string
 */
export function formatCurrency(num: string | number): string {
  const n = typeof num === "string" ? parseFloat(num) : num
  return `Rp ${formatNumber(n)}`
}

/**
 * Format a percentage with proper sign
 * @param value - Percentage value
 * @param decimals - Number of decimal places
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  const sign = value >= 0 ? "+" : ""
  return `${sign}${value.toFixed(decimals)}%`
}

/**
 * Format a date time to a readable format
 * @param timestamp - Timestamp in milliseconds
 * @returns Formatted date time string
 */
export function formatDateTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString()
}

/**
 * Format a time to HH:MM:SS format
 * @param timestamp - Timestamp in milliseconds
 * @returns Formatted time string
 */
export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString()
}

/**
 * Shorten an address to 0x1234...5678 format
 * @param address - Full address
 * @returns Shortened address
 */
export function shortenAddress(address: string | null | undefined): string {
  if (!address) return "..."
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

/**
 * Get color class based on change value
 * @param value - Change value (positive or negative)
 * @returns Tailwind color class
 */
export function getChangeColor(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value
  return num >= 0 ? "text-prosperity" : "text-red-400"
}

/**
 * Get background color class based on change value
 * @param value - Change value (positive or negative)
 * @returns Tailwind background color class
 */
export function getChangeBgColor(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value
  return num >= 0 ? "bg-prosperity/15" : "bg-red-500/15"
}

/**
 * Calculate percentage with safe division
 * @param value - Value to calculate percentage
 * @param total - Total value
 * @returns Percentage value (0-100)
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0
  return (value / total) * 100
}

/**
 * Parse balance string safely
 * @param balance - Balance string
 * @returns Parsed number or 0 if invalid
 */
export function parseBalance(balance: string | number): number {
  const num = typeof balance === "string" ? parseFloat(balance) : balance
  return isNaN(num) ? 0 : num
}
