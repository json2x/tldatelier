import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'

// ─── TLD catalogue ────────────────────────────────────────────────────────────

const TLD_CATALOGUE = `
CORE TRADITIONAL:   .com .net .org .info .biz
STARTUP/TECH:       .io .ai .co .dev .app .tech .cloud .software .systems .digital .network .tools .build .run .stack
CREATIVE:           .design .studio .art .media .ink .gallery .show .style .works
BUSINESS/BRAND:     .agency .consulting .ventures .capital .group .partners .solutions .services .pro .biz
CONSUMER/RETAIL:    .shop .store .market .deals .buy .products .online .site
LIFESTYLE:          .life .live .zone .space .world .social .community .club
EMERGING HOT:       .xyz .gg .so .to .sh .wtf .lol .fun .cool .vip .pro .plus .one
NEW GTLD:           .page .web .link .blog .wiki .today .news .info
`.trim()

// ─── Tone definitions ─────────────────────────────────────────────────────────

const TONE_DEFINITIONS = `
Tone categories (assign 1–3 per domain name):
- "Premium": Sophisticated, exclusive, high-end, luxury, professional
- "Techy": Technical, developer-focused, engineering, digital, code-like
- "Playful": Fun, whimsical, lighthearted, creative, quirky
- "Bold": Strong, assertive, memorable, punchy, impactful
- "Minimal": Clean, simple, concise, understated, elegant
`.trim()

// ─── Structured domain result ─────────────────────────────────────────────────

export interface AIDomainResult {
  domain: string
  tone: string[]
}

// ─── Prompt builder ───────────────────────────────────────────────────────────

function buildPrompt(input: string, countryTlds: string[]): string {
  const countrySection = countryTlds.length > 0
    ? `\nCOUNTRY-SPECIFIC (user's location): ${countryTlds.join(' ')} — include at least 3 domains using these TLDs.\n`
    : ''

  return `You are a world-class domain name strategist and brand naming expert.

The user wants domain names for: "${input}"

Generate exactly 100 unique, high-quality domain name suggestions.

Rules:
1. Spread across ALL TLD categories below — at minimum 3 domains per category.
2. Names must be brandable, memorable, and feel startup/product-ready.
3. Prefer short names (6-20 chars total including TLD). Avoid hyphens and numbers unless essential.
4. Be creative: compound words, portmanteaus, invented words, action verbs, evocative nouns.
5. All lowercase. No spaces. No special chars except dots.
6. DO NOT repeat the same name with different TLDs more than twice.
7. For each domain, assign 1–3 tone tags from: "Premium", "Techy", "Playful", "Bold", "Minimal".
8. Output ONLY a valid JSON array of 100 objects. No markdown, no explanation.

TLD catalogue to draw from:
${TLD_CATALOGUE}${countrySection}

${TONE_DEFINITIONS}

Output format — each element must be an object with "domain" (string) and "tone" (string array):
[{"domain":"brandly.ai","tone":["Techy","Minimal"]},{"domain":"getnovaapp.com","tone":["Bold","Premium"]},...]`
}

// ─── Generators ───────────────────────────────────────────────────────────────

export async function generateDomains(input: string, countryTlds: string[] = []): Promise<AIDomainResult[]> {
  const provider = process.env.AI_PROVIDER ?? 'openai'
  return provider === 'claude'
    ? generateWithClaude(input, countryTlds)
    : generateWithOpenAI(input, countryTlds)
}

async function generateWithOpenAI(input: string, countryTlds: string[]): Promise<AIDomainResult[]> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const response = await client.chat.completions.create({
    model: 'gpt-4.1-nano',
    messages: [
      {
        role: 'system',
        content:
          'You are a domain name expert. You only respond with valid JSON arrays of domain objects with "domain" and "tone" fields. Never include explanation or markdown fences.',
      },
      { role: 'user', content: buildPrompt(input, countryTlds) },
    ],
    temperature: 0.9,
    max_tokens: 6000,
  })

  const content = response.choices[0]?.message?.content ?? '[]'
  return parseDomainResponse(content)
}

async function generateWithClaude(input: string, countryTlds: string[]): Promise<AIDomainResult[]> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 6000,
    system:
      'You are a domain name expert. You only respond with valid JSON arrays of domain objects with "domain" and "tone" fields. Never include explanation or markdown fences.',
    messages: [{ role: 'user', content: buildPrompt(input, countryTlds) }],
  })

  const content = message.content[0]?.type === 'text' ? message.content[0].text : '[]'
  return parseDomainResponse(content)
}

// ─── Parser ───────────────────────────────────────────────────────────────────

const VALID_TONES = new Set(['Premium', 'Techy', 'Playful', 'Bold', 'Minimal'])

function parseDomainResponse(raw: string): AIDomainResult[] {
  try {
    const cleaned = raw
      .replace(/```json\n?/gi, '')
      .replace(/```\n?/gi, '')
      .trim()

    const match = cleaned.match(/\[[\s\S]*\]/)
    if (!match) return []

    const parsed = JSON.parse(match[0])
    if (!Array.isArray(parsed)) return []

    const seen = new Set<string>()

    return parsed
      .filter((item): item is { domain: string; tone: unknown } =>
        typeof item === 'object' && item !== null && typeof item.domain === 'string'
      )
      .map((item) => {
        const domain = item.domain.toLowerCase().trim()
        const rawTones = Array.isArray(item.tone) ? item.tone : []
        const tone = rawTones
          .filter((t): t is string => typeof t === 'string' && VALID_TONES.has(t))
        return { domain, tone }
      })
      .filter(({ domain }) =>
        domain.includes('.') && domain.length >= 4 && domain.length <= 63
      )
      .filter(({ domain }) => {
        if (seen.has(domain)) return false
        seen.add(domain)
        return true
      })
      .slice(0, 100)
  } catch {
    return []
  }
}
