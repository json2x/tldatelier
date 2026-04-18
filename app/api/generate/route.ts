import { NextRequest, NextResponse } from 'next/server'
import { generateDomains } from '@/lib/ai'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { getGeoTlds } from '@/lib/geo'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  const { allowed, remaining } = checkRateLimit(ip)

  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please wait a minute before trying again.' },
      {
        status: 429,
        headers: { 'X-RateLimit-Remaining': '0' },
      }
    )
  }

  let body: { input?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const input = body.input?.trim()
  if (!input || input.length < 2) {
    return NextResponse.json(
      { error: 'Please provide a description of at least 2 characters.' },
      { status: 400 }
    )
  }

  if (input.length > 500) {
    return NextResponse.json(
      { error: 'Input is too long. Max 500 characters.' },
      { status: 400 }
    )
  }

  // Geo lookup — runs in parallel with nothing, just needs to finish before AI call
  const { countryCode, countryTlds } = await getGeoTlds(ip)

  try {
    const domains = await generateDomains(input, countryTlds)

    if (!domains.length) {
      return NextResponse.json(
        { error: 'AI returned no domain suggestions. Try a different input.' },
        { status: 502 }
      )
    }

    return NextResponse.json(
      {
        domains,
        countryCode: countryCode ?? null,
        countryTlds,
      },
      {
        headers: {
          'X-RateLimit-Remaining': String(remaining),
        },
      }
    )
  } catch (err) {
    console.error('[/api/generate] Error:', err)
    return NextResponse.json(
      { error: 'Failed to generate domains. Check your AI API key configuration.' },
      { status: 500 }
    )
  }
}
