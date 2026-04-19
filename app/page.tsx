'use client'

import { useState, useCallback, useMemo } from 'react'
import { type DomainResult } from '@/lib/types'
import SearchInput from '@/components/SearchInput'
import DomainGrid from '@/components/DomainGrid'
import Filters, {
  type ToneFilter,
  type ExtensionFilter,
  type IndustryFilter,
  type LengthFilter,
  type SpecialCharsFilter,
  LENGTH_DEFAULT,
  INDUSTRIES,
} from '@/components/Filters'

const TONES: ToneFilter[] = ['Premium', 'Techy', 'Playful', 'Bold', 'Minimal']

const SURPRISE_PROMPTS = [
  'A mindfulness app for busy professionals',
  'Blockchain-powered art marketplace',
  'AI personal finance coach',
  'Sustainable food delivery service',
  'Virtual reality fitness platform',
  'No-code website builder for creators',
]

interface SearchContext {
  tones: ToneFilter[]
  industries: IndustryFilter[]
  length: LengthFilter
  specialChars: SpecialCharsFilter
}

function TopNav({
  showSearch,
  displayQuery,
  isLoading,
  onSearch,
}: {
  showSearch: boolean
  displayQuery: string
  isLoading: boolean
  onSearch: (q: string) => void
}) {
  return (
    <nav aria-label="Main navigation" className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-black/[0.05]">
      <div className="flex justify-between items-center px-8 py-4 max-w-screen-2xl mx-auto">
        <button
          type="button"
          onClick={() => window.location.reload()}
          aria-label="Atelier — Return to homepage"
          className="text-2xl font-black text-black tracking-tighter font-headline"
        >
          Atelier
        </button>

        {showSearch && (
          <div className="flex-1 max-w-xl px-12" role="search">
            <SearchInput
              onSearch={onSearch}
              isLoading={isLoading}
              defaultValue={displayQuery}
              compact
            />
          </div>
        )}

        <div className="flex items-center gap-6" />
      </div>
    </nav>
  )
}

function buildContextHints(
  tones: ToneFilter[],
  industries: IndustryFilter[],
  length: LengthFilter,
  specialChars: SpecialCharsFilter,
): string {
  const parts: string[] = []
  if (tones.length > 0) parts.push(`tone: ${tones.join(', ')}`)
  if (industries.length > 0) parts.push(`industry: ${industries.join(', ')}`)
  if (length.min !== LENGTH_DEFAULT.min || length.max !== LENGTH_DEFAULT.max) {
    parts.push(`name length: ${length.min}–${length.max} characters`)
  }
  const charNotes: string[] = []
  if (!specialChars.allowHyphen) charNotes.push('no hyphens')
  if (specialChars.allowNumbers) charNotes.push('numbers allowed')
  if (charNotes.length > 0) parts.push(charNotes.join(', '))
  return parts.length > 0 ? ` [${parts.join(' | ')}]` : ''
}

function OptionalContext({
  tones,
  industries,
  length,
  specialChars,
  isLoading,
  onTonesChange,
  onIndustriesChange,
  onLengthChange,
  onSpecialCharsChange,
  onSurpriseMe,
}: {
  tones: ToneFilter[]
  industries: IndustryFilter[]
  length: LengthFilter
  specialChars: SpecialCharsFilter
  isLoading: boolean
  onTonesChange: (t: ToneFilter[]) => void
  onIndustriesChange: (i: IndustryFilter[]) => void
  onLengthChange: (l: LengthFilter) => void
  onSpecialCharsChange: (sc: SpecialCharsFilter) => void
  onSurpriseMe: () => void
}) {
  const [open, setOpen] = useState(false)

  const activeCount =
    tones.filter((t) => t !== 'Premium').length +
    industries.length +
    (length.min !== LENGTH_DEFAULT.min || length.max !== LENGTH_DEFAULT.max ? 1 : 0) +
    (!specialChars.allowHyphen ? 1 : 0) +
    (specialChars.allowNumbers ? 1 : 0)

  const toggleTone = (t: ToneFilter) =>
    onTonesChange(tones.includes(t) ? tones.filter((x) => x !== t) : [...tones, t])

  const toggleIndustry = (i: IndustryFilter) =>
    onIndustriesChange(industries.includes(i) ? industries.filter((x) => x !== i) : [...industries, i])

  return (
    <div className="mt-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          disabled={isLoading}
          className="flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors disabled:opacity-40"
        >
          <span className="material-symbols-outlined text-base">
            {open ? 'expand_less' : 'tune'}
          </span>
          Optional context
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary text-on-primary text-[9px] font-black">
              {activeCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={onSurpriseMe}
          disabled={isLoading}
          className="flex items-center gap-1.5 text-sm font-bold text-on-tertiary-fixed-variant hover:opacity-80 transition-opacity disabled:opacity-40"
        >
          <span className="material-symbols-outlined text-base">bolt</span>
          Surprise Me
        </button>
      </div>

      {open && (
        <div className="mt-3 bg-surface-container-lowest rounded-2xl ghost-border overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-black/[0.05]">

            <div className="p-5 space-y-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2.5">Tone</p>
                <div className="flex flex-wrap gap-1.5">
                  {TONES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTone(t)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                        tones.includes(t)
                          ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                          : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-black/[0.05] pt-4">
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Name Length</p>
                  {(length.min !== LENGTH_DEFAULT.min || length.max !== LENGTH_DEFAULT.max) && (
                    <button
                      type="button"
                      onClick={() => onLengthChange(LENGTH_DEFAULT)}
                      className="text-[9px] font-bold text-slate-400 hover:text-primary uppercase tracking-wide"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-black text-primary w-6 text-center">{length.min}</span>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="range"
                      min={1} max={63}
                      value={length.min}
                      onChange={(e) => {
                        const v = Math.min(Number(e.target.value), length.max - 1)
                        onLengthChange({ ...length, min: v })
                      }}
                      className="w-full h-1.5 rounded-full accent-black cursor-pointer"
                      aria-label="Minimum name length"
                    />
                    <input
                      type="range"
                      min={1} max={63}
                      value={length.max}
                      onChange={(e) => {
                        const v = Math.max(Number(e.target.value), length.min + 1)
                        onLengthChange({ ...length, max: v })
                      }}
                      className="w-full h-1.5 rounded-full accent-black cursor-pointer"
                      aria-label="Maximum name length"
                    />
                  </div>
                  <span className="text-xs font-black text-primary w-6 text-center">{length.max}</span>
                </div>
                <p className="text-[10px] text-slate-400">Best: 6–14 chars for memorability</p>
              </div>

              <div className="border-t border-black/[0.05] pt-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2.5">Characters</p>
                <div className="space-y-1.5">
                  {([
                    { key: 'allowHyphen', label: 'Allow hyphens', eg: 'my-brand' },
                    { key: 'allowNumbers', label: 'Allow numbers', eg: 'brand42' },
                  ] as const).map(({ key, label, eg }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => onSpecialCharsChange({ ...specialChars, [key]: !specialChars[key] })}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                        specialChars[key]
                          ? 'bg-surface-container text-on-surface'
                          : 'bg-slate-100/60 text-slate-400'
                      }`}
                    >
                      <span className="font-semibold">{label} <span className="font-normal opacity-60">({eg})</span></span>
                      <div className={`relative w-7 h-3.5 rounded-full transition-colors ${specialChars[key] ? 'bg-primary' : 'bg-slate-200'}`}>
                        <div className={`absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white shadow-sm transition-transform ${specialChars[key] ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Industry</p>
                {industries.length > 0 && (
                  <button
                    type="button"
                    onClick={() => onIndustriesChange([])}
                    className="text-[9px] font-bold text-slate-400 hover:text-primary uppercase tracking-wide"
                  >
                    Clear ({industries.length})
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto no-scrollbar space-y-0.5 pr-1">
                {INDUSTRIES.map(({ emoji, label }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => toggleIndustry(label)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
                      industries.includes(label)
                        ? 'bg-tertiary-fixed/40 text-on-tertiary-fixed-variant font-semibold'
                        : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <span>{emoji}</span>
                    <span className="flex-1">{label}</span>
                    {industries.includes(label) && (
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

function LandingView({
  onSearch,
  isLoading,
}: {
  onSearch: (q: string, context: SearchContext) => void
  isLoading: boolean
}) {
  const [tones, setTones] = useState<ToneFilter[]>(['Premium'])
  const [industries, setIndustries] = useState<IndustryFilter[]>([])
  const [length, setLength] = useState<LengthFilter>(LENGTH_DEFAULT)
  const [specialChars, setSpecialChars] = useState<SpecialCharsFilter>({ allowHyphen: true, allowNumbers: false })

  const handleSearch = useCallback(
    (input: string) => {
      const hints = buildContextHints(tones, industries, length, specialChars)
      onSearch(hints ? `${input}${hints}` : input, { tones, industries, length, specialChars })
    },
    [tones, industries, length, specialChars, onSearch],
  )

  const handleSurpriseMe = useCallback(() => {
    const random = SURPRISE_PROMPTS[Math.floor(Math.random() * SURPRISE_PROMPTS.length)]
    handleSearch(random)
  }, [handleSearch])

  return (
    <main className="pt-32 pb-24">
      <section className="max-w-6xl mx-auto px-6 text-center mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-xs font-bold uppercase tracking-widest mb-8">
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          The future of naming
        </div>

        <h1 className="font-headline font-extrabold text-5xl md:text-7xl lg:text-8xl text-primary tracking-tighter mb-8 leading-[0.9]">
          Find the perfect <br />domain with AI
        </h1>

        <p className="max-w-2xl mx-auto text-on-surface-variant text-lg md:text-xl font-medium leading-relaxed mb-12">
          Generate creative, brandable domain names instantly. Move beyond the search box with an intelligent workspace designed for creators.
        </p>

        <SearchInput onSearch={handleSearch} isLoading={isLoading} />

        <OptionalContext
          tones={tones}
          industries={industries}
          length={length}
          specialChars={specialChars}
          isLoading={isLoading}
          onTonesChange={setTones}
          onIndustriesChange={setIndustries}
          onLengthChange={setLength}
          onSpecialCharsChange={setSpecialChars}
          onSurpriseMe={handleSurpriseMe}
        />
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 bg-white p-12 rounded-[2.5rem] ghost-border flex flex-col justify-between overflow-hidden relative">
            <div className="relative z-10">
              <div className="text-secondary font-bold flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                Trusted by 10k+ founders
              </div>
              <h2 className="font-headline font-bold text-4xl text-primary tracking-tight mb-6">
                Built for the next generation of industry leaders.
              </h2>
              <div className="flex -space-x-4 mb-8">
                {['?text=A', '?text=B', '?text=C'].map((q, i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-surface-container-high flex items-center justify-center text-sm font-bold text-on-surface-variant">
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
                <div className="w-12 h-12 rounded-full border-4 border-white bg-surface-container-highest flex items-center justify-center text-xs font-bold text-on-surface-variant">+9k</div>
              </div>
            </div>
            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-secondary-container/20 rounded-full blur-3xl" />
          </div>

          <div className="md:col-span-4 bg-tertiary-container text-on-tertiary p-10 rounded-[2.5rem] flex flex-col justify-between group">
            <div className="bg-on-tertiary-container w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform duration-300">
              <span className="material-symbols-outlined text-tertiary-fixed text-3xl">psychology</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-2xl mb-3">Smart Context</h3>
              <p className="text-on-tertiary-container font-medium leading-relaxed">Our AI understands the semantic soul of your brand, not just keywords.</p>
            </div>
          </div>

          <div className="md:col-span-4 bg-surface-container-lowest p-10 rounded-[2.5rem] ghost-border flex flex-col justify-between">
            <div className="flex items-center justify-between mb-8">
              <div className="w-12 h-12 rounded-full bg-secondary-container text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined font-bold">bolt</span>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-outline">Performance</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-2xl mb-3 text-primary">Instant Results</h3>
              <p className="text-on-surface-variant font-medium leading-relaxed">Latency is the enemy. Get 100+ domain variations in under 1.2 seconds.</p>
            </div>
          </div>

          <div className="md:col-span-8 bg-surface-container-low p-10 rounded-[2.5rem] flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1">
              <div className="inline-block px-3 py-1 rounded-lg bg-white text-xs font-bold text-primary mb-4 shadow-sm">Affiliate Integrated</div>
              <h3 className="font-headline font-bold text-3xl text-primary mb-4 tracking-tight">One-click registration.</h3>
              <p className="text-on-surface-variant font-medium leading-relaxed mb-6">Seamlessly connected with Namecheap for the best pricing.</p>
              <button type="button" className="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold tracking-tight hover:opacity-90 transition-opacity">Browse Partners</button>
            </div>
            <div className="w-full md:w-1/2 h-48 bg-white rounded-2xl p-6 relative overflow-hidden ghost-border flex items-center justify-center">
              <div className="flex gap-6 items-center">
                <span className="font-black text-xl text-on-surface-variant opacity-50">namecheap</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="font-headline font-bold text-3xl text-primary tracking-tight">AI-Generated Spotlight</h2>
        </div>
        <div className="space-y-3">
          <div className="bg-white p-6 rounded-2xl flex items-center justify-between ghost-border hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-4">
              <div className="text-xl font-bold text-primary font-headline">atelier.design</div>
              <span className="px-3 py-1 rounded-lg bg-secondary-container text-secondary text-[10px] font-black uppercase tracking-wider">Available</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-on-surface-variant font-bold">$12.99/yr</span>
              <button type="button" className="bg-primary text-on-primary px-5 py-2 rounded-lg font-bold text-sm">Buy</button>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl flex items-center justify-between ghost-border opacity-60">
            <div className="flex items-center gap-4">
              <div className="text-xl font-bold text-primary font-headline">atelier.ai</div>
              <span className="px-3 py-1 rounded-lg bg-surface-container text-outline text-[10px] font-black uppercase tracking-wider">Taken</span>
            </div>
            <div className="flex items-center gap-4">
              <button type="button" className="text-sm font-bold text-primary hover:underline">Whois</button>
              <button type="button" className="bg-surface-container-high text-on-surface-variant px-5 py-2 rounded-lg font-bold text-sm">Make Offer</button>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl flex items-center justify-between ghost-border hover:shadow-lg transition-shadow duration-300 border-l-4 border-tertiary">
            <div className="flex items-center gap-4">
              <div className="text-xl font-bold text-primary font-headline">myatelier.app</div>
              <span className="px-3 py-1 rounded-lg bg-secondary-container text-secondary text-[10px] font-black uppercase tracking-wider">Available</span>
              <div className="text-[10px] font-bold text-on-tertiary-fixed-variant bg-tertiary-fixed px-2 py-0.5 rounded uppercase">AI Recommended</div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-on-surface-variant font-bold">$9.00/yr</span>
              <button type="button" className="bg-primary text-on-primary px-5 py-2 rounded-lg font-bold text-sm">Buy</button>
            </div>
          </div>
        </div>
      </section>

      <footer className="w-full py-12 border-t border-black/[0.03] bg-white mt-8" role="contentinfo">
        <div className="flex flex-col items-center gap-6 px-8">
          <div className="text-lg font-black text-slate-900 font-headline tracking-tighter">Atelier</div>
          <nav aria-label="Footer navigation" className="flex gap-8">
            {['Terms', 'Privacy', 'Status', 'Twitter'].map((link) => (
              <a key={link} href={`/${link.toLowerCase()}`} className="text-slate-400 font-body text-xs uppercase tracking-widest hover:text-purple-500 transition-colors opacity-80 hover:opacity-100">
                {link}
              </a>
            ))}
          </nav>
          <div className="text-slate-400 font-body text-[10px] uppercase tracking-[0.2em] mt-4">
            © {new Date().getFullYear()} Atelier Domains. Crafted by AI.
          </div>
        </div>
      </footer>
    </main>
  )
}

function ResultsView({
  domains,
  isLoading,
  isCheckingAvailability,
  error,
  query,
  activeTones,
  activeExtensions,
  activeIndustries,
  lengthFilter,
  specialChars,
  countryTlds,
  onTonesChange,
  onExtensionsChange,
  onIndustriesChange,
  onLengthChange,
  onSpecialCharsChange,
  onRegenerate,
  onRefine,
}: {
  domains: DomainResult[]
  isLoading: boolean
  isCheckingAvailability: boolean
  error: string | null
  query: string
  activeTones: ToneFilter[]
  activeExtensions: ExtensionFilter[]
  activeIndustries: IndustryFilter[]
  lengthFilter: LengthFilter
  specialChars: SpecialCharsFilter
  countryTlds: { code: string; tlds: string[] } | null
  onTonesChange: (t: ToneFilter[]) => void
  onExtensionsChange: (e: ExtensionFilter[]) => void
  onIndustriesChange: (i: IndustryFilter[]) => void
  onLengthChange: (l: LengthFilter) => void
  onSpecialCharsChange: (sc: SpecialCharsFilter) => void
  onRegenerate: () => void
  onRefine: (hint: string) => void
}) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const filteredDomains = useMemo(() => {
    return domains.filter((d) => {
      if (activeExtensions.length > 0 && !activeExtensions.some((ext) => d.domain.endsWith(ext))) return false
      if (d.name.length < lengthFilter.min || d.name.length > lengthFilter.max) return false
      if (!specialChars.allowHyphen && d.name.includes('-')) return false
      if (!specialChars.allowNumbers && /\d/.test(d.name)) return false
      if (activeTones.length > 0 && !d.tone.some((t) => activeTones.includes(t as ToneFilter))) return false
      return true
    })
  }, [domains, activeExtensions, lengthFilter, specialChars, activeTones])

  return (
    <div className="flex pt-[72px] h-screen overflow-hidden">
      <Filters
        activeTones={activeTones}
        activeExtensions={activeExtensions}
        activeIndustries={activeIndustries}
        lengthFilter={lengthFilter}
        specialChars={specialChars}
        onTonesChange={onTonesChange}
        onExtensionsChange={onExtensionsChange}
        onIndustriesChange={onIndustriesChange}
        onLengthChange={onLengthChange}
        onSpecialCharsChange={onSpecialCharsChange}
        onRegenerate={onRegenerate}
        countryTlds={countryTlds ?? undefined}
      />

      <main className="flex-1 overflow-y-auto bg-surface p-8 lg:p-12">
        <div className="max-w-6xl mx-auto mb-10">
          {error && !isLoading && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 rounded-2xl px-5 py-4 mb-8">
              <span className="material-symbols-outlined flex-shrink-0">error</span>
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {!error && (
            <div className="p-6 bg-tertiary-fixed/30 backdrop-blur-sm rounded-xl border border-tertiary-fixed/50 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-tertiary-fixed rounded-xl flex items-center justify-center text-on-tertiary-fixed-variant">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                </div>
                <div>
                  <p className="text-primary font-headline font-bold">AI Insight</p>
                  <p className="text-on-surface-variant text-sm">
                    {isLoading
                      ? 'Generating brandable domain ideas…'
                      : `Here are some brandable and modern domain ideas based on "${query}".`}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {['Shorter', 'More premium', 'More creative'].map((hint) => (
                  <button
                    key={hint}
                    type="button"
                    onClick={() => onRefine(hint)}
                    className="px-4 py-2 bg-white rounded-full text-xs font-bold shadow-sm hover:shadow-md transition-shadow border border-transparent hover:border-primary/5"
                  >
                    {hint}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="max-w-6xl mx-auto">
          <DomainGrid
            domains={filteredDomains}
            isLoading={isLoading}
            isCheckingAvailability={isCheckingAvailability}
          />

          {!isLoading && domains.length > 0 && filteredDomains.length === 0 && (
            <div className="text-center py-16">
              <p className="text-on-surface-variant text-base">No domains match the current filters.</p>
              <button
                type="button"
                onClick={() => onExtensionsChange([])}
                className="mt-3 text-sm text-on-tertiary-fixed-variant hover:underline font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        <footer role="contentinfo" className="mt-20 w-full py-12 border-t border-black/[0.03] flex flex-col items-center gap-6 px-8">
          <div className="text-lg font-black font-headline text-slate-900 tracking-tighter">Atelier</div>
          <nav aria-label="Footer navigation" className="flex gap-8 text-slate-400 font-body text-xs uppercase tracking-widest">
            {['Terms', 'Privacy', 'Status', 'Twitter'].map((link) => (
              <a key={link} href={`/${link.toLowerCase()}`} className="hover:text-purple-500 transition-colors opacity-80 hover:opacity-100">{link}</a>
            ))}
          </nav>
          <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em]">© {new Date().getFullYear()} Atelier Domains. Crafted by AI.</p>
        </footer>
      </main>

      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="glass-panel px-8 py-4 rounded-full font-bold text-on-surface shadow-lg border border-black/[0.05] flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">tune</span>
          Refine Identity
        </button>
      </div>

      {drawerOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-50 rounded-t-3xl shadow-2xl flex flex-col max-h-[85dvh] animate-slide-up-drawer">
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-black/[0.05] shrink-0">
              <div>
                <h2 className="text-lg font-black text-black font-headline">Refine Identity</h2>
                <p className="text-slate-400 text-xs">AI Customization</p>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors"
                aria-label="Close filters"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Filters
                activeTones={activeTones}
                activeExtensions={activeExtensions}
                activeIndustries={activeIndustries}
                lengthFilter={lengthFilter}
                specialChars={specialChars}
                onTonesChange={onTonesChange}
                onExtensionsChange={onExtensionsChange}
                onIndustriesChange={onIndustriesChange}
                onLengthChange={onLengthChange}
                onSpecialCharsChange={onSpecialCharsChange}
                onRegenerate={() => { onRegenerate(); setDrawerOpen(false) }}
                countryTlds={countryTlds ?? undefined}
                variant="drawer"
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default function HomePage() {
  const [provider] = useState<'openai' | 'claude'>('openai')
  const [domains, setDomains] = useState<DomainResult[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [currentQuery, setCurrentQuery] = useState('')
  const [displayQuery, setDisplayQuery] = useState('')
  const [activeTones, setActiveTones] = useState<ToneFilter[]>(['Premium'])
  const [activeExtensions, setActiveExtensions] = useState<ExtensionFilter[]>([])
  const [activeIndustries, setActiveIndustries] = useState<IndustryFilter[]>([])
  const [lengthFilter, setLengthFilter] = useState<LengthFilter>(LENGTH_DEFAULT)
  const [specialChars, setSpecialChars] = useState<SpecialCharsFilter>({ allowHyphen: true, allowNumbers: false })
  const [countryTlds, setCountryTlds] = useState<{ code: string; tlds: string[] } | null>(null)

  const runGenerate = useCallback(async (fullPrompt: string) => {
    setIsGenerating(true)
    setError(null)
    setDomains([])
    setHasSearched(true)
    setCurrentQuery(fullPrompt)

    try {
      const generateRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: fullPrompt, provider }),
      })

      const generateData = await generateRes.json()

      if (!generateRes.ok) {
        setError(generateData.error ?? 'Failed to generate domains.')
        setIsGenerating(false)
        return
      }

      if (generateData.countryCode && Array.isArray(generateData.countryTlds) && generateData.countryTlds.length > 0) {
        setCountryTlds({ code: generateData.countryCode, tlds: generateData.countryTlds })
      }

      const generatedDomains: Array<{ domain: string; tone: string[] }> = generateData.domains
      const initialDomains: DomainResult[] = generatedDomains.map((d) => {
        const dotIndex = d.domain.indexOf('.')
        return {
          domain: d.domain,
          name: dotIndex === -1 ? d.domain : d.domain.slice(0, dotIndex),
          tld: dotIndex === -1 ? '' : d.domain.slice(dotIndex),
          available: null,
          tone: d.tone ?? [],
        }
      })
      setDomains(initialDomains)
      setIsGenerating(false)

      setIsCheckingAvailability(true)
      try {
        const availRes = await fetch('/api/availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domains: generatedDomains.map((d) => d.domain) }),
        })

        if (!availRes.ok || !availRes.body) {
          setIsCheckingAvailability(false)
          return
        }

        const reader = availRes.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        const resolvedMap = new Map<string, import('@/lib/types').DomainResult>()

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (!line.trim()) continue
            try {
              const batch: import('@/lib/types').DomainResult[] = JSON.parse(line)
              for (const d of batch) resolvedMap.set(d.domain, d)
              setDomains((prev) => prev.map((d) => {
                const resolved = resolvedMap.get(d.domain)
                if (!resolved) return d
                return { ...d, available: resolved.available }
              }))
            } catch {
            }
          }
        }
      } finally {
        setIsCheckingAvailability(false)
      }
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
      setIsGenerating(false)
    }
  }, [provider])

  const handleSearch = useCallback(
    (fullPrompt: string, context?: SearchContext) => {
      const rawQuery = fullPrompt.replace(/ \[.*?\]$/, '')
      setDisplayQuery(rawQuery)
      if (context) {
        setActiveTones(context.tones)
        setActiveIndustries(context.industries)
        setLengthFilter(context.length)
        setSpecialChars(context.specialChars)
      }
      runGenerate(fullPrompt)
    },
    [runGenerate],
  )

  const handleTopNavSearch = useCallback(
    (rawInput: string) => {
      setDisplayQuery(rawInput)
      const hints = buildContextHints(activeTones, activeIndustries, lengthFilter, specialChars)
      runGenerate(hints ? `${rawInput}${hints}` : rawInput)
    },
    [activeTones, activeIndustries, lengthFilter, specialChars, runGenerate],
  )

  const handleRegenerate = useCallback(() => {
    if (!displayQuery) return
    const hints = buildContextHints(activeTones, activeIndustries, lengthFilter, specialChars)
    runGenerate(hints ? `${displayQuery}${hints}` : displayQuery)
  }, [displayQuery, activeTones, activeIndustries, lengthFilter, specialChars, runGenerate])

  const handleRefine = useCallback(
    (hint: string) => {
      if (!displayQuery) return
      const base = `${displayQuery} — make them ${hint.toLowerCase().replace('more ', '')}`
      const hints = buildContextHints(activeTones, activeIndustries, lengthFilter, specialChars)
      runGenerate(hints ? `${base}${hints}` : base)
    },
    [displayQuery, activeTones, activeIndustries, lengthFilter, specialChars, runGenerate],
  )

  return (
    <>
      <TopNav
        showSearch={hasSearched}
        displayQuery={displayQuery}
        isLoading={isGenerating}
        onSearch={handleTopNavSearch}
      />

      {!hasSearched ? (
        <LandingView onSearch={handleSearch} isLoading={isGenerating} />
      ) : (
        <ResultsView
          domains={domains}
          isLoading={isGenerating}
          isCheckingAvailability={isCheckingAvailability}
          error={error}
          query={displayQuery}
          activeTones={activeTones}
          activeExtensions={activeExtensions}
          activeIndustries={activeIndustries}
          lengthFilter={lengthFilter}
          specialChars={specialChars}
          countryTlds={countryTlds}
          onTonesChange={setActiveTones}
          onExtensionsChange={setActiveExtensions}
          onIndustriesChange={setActiveIndustries}
          onLengthChange={setLengthFilter}
          onSpecialCharsChange={setSpecialChars}
          onRegenerate={handleRegenerate}
          onRefine={handleRefine}
        />
      )}
    </>
  )
}
