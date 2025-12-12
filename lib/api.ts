// Utility to get the correct API base URL
export function getApiBase(): string {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
  }
  
  // Try multiple sources in order of preference
  return (
    process.env.NEXT_PUBLIC_API_URL || 
    (window as any).API_BASE ||
    `http://${window.location.hostname}:${window.location.port}/api` ||
    'http://localhost:3000/api'
  )
}
