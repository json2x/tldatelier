/**
 * Shared types used by both client components and server-side lib.
 * Keep this file free of any server-only imports.
 */
export interface DomainResult {
  domain: string
  available: boolean | null // null = unknown/checking
  tld: string
  name: string
  tone: string[]
}
