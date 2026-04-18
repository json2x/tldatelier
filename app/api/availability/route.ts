import { NextRequest } from 'next/server'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import type { DomainResult } from '@/lib/types'

export const runtime = 'nodejs'

// ─── Inline provider logic (streaming-compatible) ────────────────────────────

function parseDomain(domain: string): Omit<DomainResult, 'available'> {
  const lower = domain.toLowerCase().trim()
  const dotIndex = lower.indexOf('.')
  if (dotIndex === -1) return { domain: lower, name: lower, tld: '' }
  return { domain: lower, name: lower.slice(0, dotIndex), tld: lower.slice(dotIndex) }
}

interface GoDaddyDomainResult {
  domain: string
  available: boolean
}

async function* streamGodaddy(domains: string[]) {
  const apiKey = process.env.GODADDY_API_KEY
  const apiSecret = process.env.GODADDY_API_SECRET
  const baseUrl = process.env.GODADDY_BASE_URL ?? 'https://api.ote-godaddy.com'

  const BATCH_SIZE = 50

  for (let i = 0; i < domains.length; i += BATCH_SIZE) {
    const batch = domains.slice(i, i + BATCH_SIZE)
    const batchParsed = batch.map(parseDomain)

    if (!apiKey || !apiSecret) {
      yield batchParsed.map((d) => ({ ...d, available: null }))
      continue
    }

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
        yield batchParsed.map((d) => ({ ...d, available: null }))
        continue
      }

      const data = await response.json() as { domains?: GoDaddyDomainResult[] }
      const map: Record<string, boolean> = {}
      if (Array.isArray(data.domains)) {
        for (const r of data.domains) map[r.domain.toLowerCase()] = r.available
      }
      yield batchParsed.map((d) => ({ ...d, available: map[d.domain] ?? null }))
    } catch {
      yield batchParsed.map((d) => ({ ...d, available: null }))
    }

    if (i + BATCH_SIZE < domains.length) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }
}

async function* streamNamecheap(domains: string[]) {
  // Namecheap doesn't batch-stream naturally — yield all at once
  const parsed = domains.map(parseDomain)
  const apiUser = process.env.NAMECHEAP_API_USER
  const apiKey = process.env.NAMECHEAP_API_KEY
  const username = process.env.NAMECHEAP_USERNAME
  const clientIp = process.env.NAMECHEAP_CLIENT_IP

  if (!apiUser || !apiKey || !username || !clientIp) {
    yield parsed.map((d) => ({ ...d, available: null }))
    return
  }

  try {
    const url = new URL('https://api.namecheap.com/xml.response')
    url.searchParams.set('ApiUser', apiUser)
    url.searchParams.set('ApiKey', apiKey)
    url.searchParams.set('UserName', username)
    url.searchParams.set('ClientIp', clientIp)
    url.searchParams.set('Command', 'namecheap.domains.check')
    url.searchParams.set('DomainList', domains.join(','))

    const response = await fetch(url.toString(), { cache: 'no-store' })
    if (!response.ok) { yield parsed.map((d) => ({ ...d, available: null })); return }

    const xml = await response.text()
    const result: Record<string, boolean> = {}
    const regex = /<DomainCheckResult\s+Domain="([^"]+)"\s+Available="(true|false)"/gi
    let match: RegExpExecArray | null
    while ((match = regex.exec(xml)) !== null) {
      result[match[1].toLowerCase()] = match[2].toLowerCase() === 'true'
    }
    yield parsed.map((d) => ({ ...d, available: result[d.domain] ?? null }))
  } catch {
    yield parsed.map((d) => ({ ...d, available: null }))
  }
}

// ─── Route ────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  const { allowed } = checkRateLimit(`avail:${ip}`)

  if (!allowed) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please wait a minute.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let body: { domains?: unknown }
  try {
    body = await request.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!Array.isArray(body.domains)) {
    return new Response(JSON.stringify({ error: 'Expected { domains: string[] }' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const domains = (body.domains as unknown[])
    .filter((d): d is string => typeof d === 'string')
    .slice(0, 100)

  if (!domains.length) {
    return new Response('', { status: 200, headers: { 'Content-Type': 'text/plain' } })
  }

  const provider = (process.env.DOMAIN_PROVIDER ?? 'godaddy').toLowerCase()
  const stream = provider === 'namecheap' ? streamNamecheap(domains) : streamGodaddy(domains)

  const readable = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      for await (const batch of stream) {
        controller.enqueue(encoder.encode(JSON.stringify(batch) + '\n'))
      }
      controller.close()
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'application/x-ndjson',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
    },
  })
}
