/**
 * Maps ISO 3166-1 alpha-2 country codes to their most-used local TLDs.
 * Includes both the ccTLD and common second-level variants (e.g. .co.uk, .com.ph).
 */
const COUNTRY_TLDS: Record<string, string[]> = {
  // Asia-Pacific
  PH: ['.ph', '.com.ph', '.net.ph', '.org.ph'],
  JP: ['.jp', '.co.jp', '.ne.jp'],
  KR: ['.kr', '.co.kr'],
  CN: ['.cn', '.com.cn'],
  IN: ['.in', '.co.in'],
  AU: ['.au', '.com.au', '.net.au', '.org.au'],
  NZ: ['.nz', '.co.nz'],
  SG: ['.sg', '.com.sg'],
  MY: ['.my', '.com.my'],
  ID: ['.id', '.co.id'],
  TH: ['.th', '.co.th'],
  VN: ['.vn', '.com.vn'],
  HK: ['.hk', '.com.hk'],
  TW: ['.tw', '.com.tw'],
  BD: ['.bd', '.com.bd'],
  PK: ['.pk', '.com.pk'],
  LK: ['.lk', '.com.lk'],
  // Europe
  GB: ['.uk', '.co.uk', '.me.uk', '.org.uk'],
  DE: ['.de'],
  FR: ['.fr'],
  ES: ['.es'],
  IT: ['.it'],
  NL: ['.nl'],
  BE: ['.be'],
  CH: ['.ch'],
  AT: ['.at'],
  PL: ['.pl'],
  SE: ['.se'],
  NO: ['.no'],
  DK: ['.dk'],
  FI: ['.fi'],
  PT: ['.pt'],
  CZ: ['.cz'],
  HU: ['.hu'],
  RO: ['.ro'],
  UA: ['.ua'],
  RU: ['.ru'],
  TR: ['.tr', '.com.tr'],
  GR: ['.gr'],
  // Americas
  US: ['.us'],
  CA: ['.ca'],
  MX: ['.mx', '.com.mx'],
  BR: ['.br', '.com.br'],
  AR: ['.ar', '.com.ar'],
  CL: ['.cl'],
  CO: ['.co'], // also a popular startup TLD
  PE: ['.pe', '.com.pe'],
  VE: ['.ve'],
  // Middle East / Africa
  ZA: ['.za', '.co.za'],
  NG: ['.ng', '.com.ng'],
  KE: ['.ke', '.co.ke'],
  EG: ['.eg', '.com.eg'],
  IL: ['.il', '.co.il'],
  SA: ['.sa', '.com.sa'],
  AE: ['.ae', '.com.ae'],
}

export interface GeoResult {
  countryCode: string | null
  countryTlds: string[]
}

/**
 * Resolves country TLDs for a given IP using the free ip-api.com service.
 * Returns empty arrays on failure so the app degrades gracefully.
 */
export async function getGeoTlds(ip: string): Promise<GeoResult> {
  // Skip lookup for local/private IPs
  if (
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip.startsWith('192.168.') ||
    ip.startsWith('10.') ||
    ip.startsWith('172.')
  ) {
    return { countryCode: null, countryTlds: [] }
  }

  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,countryCode`, {
      signal: AbortSignal.timeout(2000), // 2s max — never block the main request
    })
    if (!res.ok) return { countryCode: null, countryTlds: [] }

    const data = await res.json() as { status: string; countryCode?: string }
    if (data.status !== 'success' || !data.countryCode) return { countryCode: null, countryTlds: [] }

    const code = data.countryCode.toUpperCase()
    return {
      countryCode: code,
      countryTlds: COUNTRY_TLDS[code] ?? [],
    }
  } catch {
    return { countryCode: null, countryTlds: [] }
  }
}
