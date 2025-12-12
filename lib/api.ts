// Utility to get the correct API base URL
export function getApiBase(): string {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
  }
  
  // In the browser, prefer relative path to avoid port mismatches
  // This ensures requests hit the same Next.js origin (Turbopack dev, start, or production)
  const relative = '/api'

  // Allow explicit override only if set to an absolute URL (e.g., external PHP backend)
  const envUrl = (process.env.NEXT_PUBLIC_API_URL || '').trim()
  if (envUrl.startsWith('http://') || envUrl.startsWith('https://')) {
    return envUrl
  }

  return relative
}
