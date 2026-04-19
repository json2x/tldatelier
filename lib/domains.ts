export type { DomainResult } from './types'
import type { DomainResult } from './types'

// ─── Shared helpers ───────────────────────────────────────────────────────────

/**
 * Parse a full domain string into name + tld parts.
 */
function parseDomain(domain: string): Omit<DomainResult, 'available'> {
  const lower = domain.toLowerCase().trim()
  const dotIndex = lower.indexOf('.')
  if (dotIndex === -1) return { domain: lower, name: lower, tld: '', tone: [] }
  return {
    domain: lower,
    name: lower.slice(0, dotIndex),
    tld: lower.slice(dotIndex),
    tone: [],
  }
}

/**
 * Generate a Namecheap affiliate buy link for a domain.
 */
export function getAffiliateLink(domain: string): string {
  const base =
    process.env.NAMECHEAP_AFFILIATE_LINK ??
    'https://www.namecheap.com/domains/registration/results/?domain='
  return `${base}${encodeURIComponent(domain)}`
}

// ─── Namecheap provider ───────────────────────────────────────────────────────

function parseNamecheapXml(xml: string): Record<string, boolean> {
  const result: Record<string, boolean> = {}
  const regex = /<DomainCheckResult\s+Domain="([^"]+)"\s+Available="(true|false)"/gi
  let match: RegExpExecArray | null
  while ((match = regex.exec(xml)) !== null) {
    result[match[1].toLowerCase()] = match[2].toLowerCase() === 'true'
  }
  return result
}

async function checkWithNamecheap(domains: string[]): Promise<DomainResult[]> {
  const parsed = domains.map(parseDomain)
  const apiUser = process.env.NAMECHEAP_API_USER
  const apiKey = process.env.NAMECHEAP_API_KEY
  const username = process.env.NAMECHEAP_USERNAME
  const clientIp = process.env.NAMECHEAP_CLIENT_IP

  if (!apiUser || !apiKey || !username || !clientIp) {
    return parsed.map((d) => ({ ...d, available: null }))
  }

  try {
    const url = new URL('https://api.namecheap.com/xml.response')
    url.searchParams.set('ApiUser', apiUser)
    url.searchParams.set('ApiKey', apiKey)
    url.searchParams.set('UserName', username)
    url.searchParams.set('ClientIp', clientIp)
    url.searchParams.set('Command', 'namecheap.domains.check')
    url.searchParams.set('DomainList', domains.join(','))

    const response = await fetch(url.toString(), { next: { revalidate: 0 } })
    if (!response.ok) return parsed.map((d) => ({ ...d, available: null }))

    const xml = await response.text()
    const availabilityMap = parseNamecheapXml(xml)
    return parsed.map((d) => ({ ...d, available: availabilityMap[d.domain] ?? null }))
  } catch {
    return parsed.map((d) => ({ ...d, available: null }))
  }
}

// ─── GoDaddy provider ─────────────────────────────────────────────────────────

interface GoDaddyDomainResult {
  domain: string
  available: boolean
  definitive?: boolean
  price?: number
  currency?: string
}

async function checkWithGodaddy(domains: string[]): Promise<DomainResult[]> {
  const parsed = domains.map(parseDomain)
  const apiKey = process.env.GODADDY_API_KEY
  const apiSecret = process.env.GODADDY_API_SECRET
  const baseUrl = process.env.GODADDY_BASE_URL ?? 'https://api.ote-godaddy.com'

  if (!apiKey || !apiSecret) {
    return parsed.map((d) => ({ ...d, available: null }))
  }

  // GoDaddy batch limit is 500, but we keep it conservative at 50
  const BATCH_SIZE = 50
  const allResults: DomainResult[] = []

  for (let i = 0; i < domains.length; i += BATCH_SIZE) {
    const batch = domains.slice(i, i + BATCH_SIZE)
    const batchParsed = batch.map(parseDomain)

    try {
      const response = await fetch(`${baseUrl}/v1/domains/available?checkType=FAST`, {
        method: 'POST',
        headers: {
          Authorization: `sso-key ${apiKey}:${apiSecret}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(batch),
      })

      if (!response.ok) {
        console.error('[GoDaddy] API error:', response.status, response.statusText)
        allResults.push(...batchParsed.map((d) => ({ ...d, available: null })))
        continue
      }

      const data = await response.json() as { domains?: GoDaddyDomainResult[] }
      const map: Record<string, boolean> = {}

      if (Array.isArray(data.domains)) {
        for (const r of data.domains) {
          map[r.domain.toLowerCase()] = r.available
        }
      }

      allResults.push(...batchParsed.map((d) => ({ ...d, available: map[d.domain] ?? null })))
    } catch (err) {
      console.error('[GoDaddy] Batch error:', err)
      allResults.push(...batchParsed.map((d) => ({ ...d, available: null })))
    }

    // Small delay between batches to be respectful of the API
    if (i + BATCH_SIZE < domains.length) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }

  return allResults
}

// ─── Porkbun provider ─────────────────────────────────────────────────────────

interface PorkbunCheckResponse {
  status: 'SUCCESS' | 'ERROR'
  response?: {
    avail: 'yes' | 'no'
  }
  message?: string
}

/**
 * Porkbun only supports single-domain checks. The API is rate-limited to
 * 1 request per 10 seconds per account by default, so we add a 10 s delay
 * between requests to stay within that limit.
 */
async function checkWithPorkbun(domains: string[]): Promise<DomainResult[]> {
  const parsed = domains.map(parseDomain)
  const apiKey = process.env.PORKBUN_API_KEY
  const secretKey = process.env.PORKBUN_SECRET_KEY

  if (!apiKey || !secretKey) {
    return parsed.map((d) => ({ ...d, available: null }))
  }

  const results: DomainResult[] = []

  for (let i = 0; i < domains.length; i++) {
    const domain = domains[i]
    const meta = parsed[i]

    try {
      const response = await fetch(
        `https://api.porkbun.com/api/json/v3/domain/checkDomain/${encodeURIComponent(domain)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ apikey: apiKey, secretapikey: secretKey }),
          next: { revalidate: 0 },
        },
      )

      if (!response.ok) {
        console.error('[Porkbun] HTTP error:', response.status, response.statusText)
        results.push({ ...meta, available: null })
        continue
      }

      const data = (await response.json()) as PorkbunCheckResponse

      if (data.status !== 'SUCCESS' || !data.response) {
        console.error('[Porkbun] API error for', domain, ':', data.message)
        results.push({ ...meta, available: null })
        continue
      }

      results.push({ ...meta, available: data.response.avail === 'yes' })
    } catch (err) {
      console.error('[Porkbun] Request error for', domain, ':', err)
      results.push({ ...meta, available: null })
    }

    if (i < domains.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 10_000))
    }
  }

  return results
}

// ─── Public entry point ───────────────────────────────────────────────────────

export type DomainProvider = 'namecheap' | 'godaddy' | 'porkbun'

/**
 * Check availability for a batch of domains.
 * Provider is selected via DOMAIN_PROVIDER env var ("godaddy" | "namecheap").
 * Falls back to null availability when credentials are missing.
 */
export async function checkDomainAvailability(domains: string[]): Promise<DomainResult[]> {
  const provider = (process.env.DOMAIN_PROVIDER ?? 'godaddy').toLowerCase() as DomainProvider

  switch (provider) {
    case 'namecheap':
      return checkWithNamecheap(domains)
    case 'porkbun':
      return checkWithPorkbun(domains)
    case 'godaddy':
    default:
      return checkWithGodaddy(domains)
  }
}
