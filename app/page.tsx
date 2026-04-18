'use client'

import { useState, useCallback, useMemo } from 'react'
import { type DomainResult } from '@/lib/types'
import SearchInput from '@/components/SearchInput'
import DomainCard from '@/components/DomainCard'
import DomainGrid from '@/components/DomainGrid'
import Filters, { type ToneFilter, type ExtensionFilter } from '@/components/Filters'

// ─── Nav ─────────────────────────────────────────────────────────────────────

function TopNav({
  showSearch,
  currentQuery,
  isLoading,
  onSearch,
}: {
  showSearch: boolean
  currentQuery: string
  isLoading: boolean
  onSearch: (q: string) => void
}) {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-black/[0.05]">
      <div className="flex justify-between items-center px-8 py-4 max-w-screen-2xl mx-auto">
        {/* Logo */}
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="text-2xl font-black text-black tracking-tighter font-headline"
        >
          Atelier
        </button>

        {/* Inline search for results view */}
        {showSearch && (
          <div className="flex-1 max-w-xl px-12">
            <SearchInput
              onSearch={onSearch}
              isLoading={isLoading}
              defaultValue={currentQuery}
              compact
            />
          </div>
        )}

        <div className="flex items-center gap-6" />
      </div>
    </nav>
  )
}

// ─── Landing Page ─────────────────────────────────────────────────────────────

function LandingView({ onSearch, isLoading }: { onSearch: (q: string) => void; isLoading: boolean }) {
  return (
    <main className="pt-32 pb-24">
      {/* Hero */}
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

        <SearchInput onSearch={onSearch} isLoading={isLoading} />
      </section>

      {/* Bento Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Social Proof */}
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

          {/* Smart Context */}
          <div className="md:col-span-4 bg-tertiary-container text-on-tertiary p-10 rounded-[2.5rem] flex flex-col justify-between group">
            <div className="bg-on-tertiary-container w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform duration-300">
              <span className="material-symbols-outlined text-tertiary-fixed text-3xl">psychology</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-2xl mb-3">Smart Context</h3>
              <p className="text-on-tertiary-container font-medium leading-relaxed">Our AI understands the semantic soul of your brand, not just keywords.</p>
            </div>
          </div>

          {/* Instant Results */}
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

          {/* Affiliate */}
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

      {/* Domain Preview */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="font-headline font-bold text-3xl text-primary tracking-tight">AI-Generated Spotlight</h2>
        </div>
        <div className="space-y-3">
          {/* Available */}
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
          {/* Taken */}
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
          {/* AI Recommended */}
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

      {/* Footer */}
      <footer className="w-full py-12 border-t border-black/[0.03] bg-white mt-8">
        <div className="flex flex-col items-center gap-6 px-8">
          <div className="text-lg font-black text-slate-900 font-headline tracking-tighter">Atelier</div>
          <div className="flex gap-8">
            {['Terms', 'Privacy', 'Status', 'Twitter'].map((link) => (
              <a key={link} href="#" className="text-slate-400 font-body text-xs uppercase tracking-widest hover:text-purple-500 transition-colors opacity-80 hover:opacity-100">
                {link}
              </a>
            ))}
          </div>
          <div className="text-slate-400 font-body text-[10px] uppercase tracking-[0.2em] mt-4">
            © 2024 Atelier Domains. Crafted by AI.
          </div>
        </div>
      </footer>
    </main>
  )
}

// ─── Results Page ─────────────────────────────────────────────────────────────

function ResultsView({
  domains,
  isLoading,
  isCheckingAvailability,
  error,
  query,
  activeTones,
  activeExtensions,
  countryTlds,
  onTonesChange,
  onExtensionsChange,
  onApplyFilters,
  onRefine,
}: {
  domains: DomainResult[]
  isLoading: boolean
  isCheckingAvailability: boolean
  error: string | null
  query: string
  activeTones: ToneFilter[]
  activeExtensions: ExtensionFilter[]
  countryTlds: { code: string; tlds: string[] } | null
  onTonesChange: (t: ToneFilter[]) => void
  onExtensionsChange: (e: ExtensionFilter[]) => void
  onApplyFilters: () => void
  onRefine: (hint: string) => void
}) {
  const filteredDomains = useMemo(() => {
    return domains.filter((d) => {
      if (activeExtensions.length > 0 && !activeExtensions.some((ext) => d.domain.endsWith(ext))) return false
      return true
    })
  }, [domains, activeExtensions])

  return (
    <div className="flex pt-[72px] h-screen overflow-hidden">
      {/* Sidebar */}
      <Filters
        activeTones={activeTones}
        activeExtensions={activeExtensions}
        onTonesChange={onTonesChange}
        onExtensionsChange={onExtensionsChange}
        onApply={onApplyFilters}
        countryTlds={countryTlds ?? undefined}
      />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-surface p-8 lg:p-12">
        <div className="max-w-6xl mx-auto mb-10">
          {/* Error */}
          {error && !isLoading && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 rounded-2xl px-5 py-4 mb-8">
              <span className="material-symbols-outlined flex-shrink-0">error</span>
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* AI Insight bar */}
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

        {/* Domain Grid */}
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

        {/* Footer */}
        <footer className="mt-20 w-full py-12 border-t border-black/[0.03] flex flex-col items-center gap-6 px-8">
          <div className="text-lg font-black font-headline text-slate-900 tracking-tighter">Atelier</div>
          <div className="flex gap-8 text-slate-400 font-body text-xs uppercase tracking-widest">
            {['Terms', 'Privacy', 'Status', 'Twitter'].map((link) => (
              <a key={link} href="#" className="hover:text-purple-500 transition-colors opacity-80 hover:opacity-100">{link}</a>
            ))}
          </div>
          <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em]">© 2024 Atelier Domains. Crafted by AI.</p>
        </footer>
      </main>

      {/* Mobile: sticky bottom refine button */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button
          type="button"
          className="glass-panel px-8 py-4 rounded-full font-bold text-on-surface shadow-lg border border-black/[0.05] flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">tune</span>
          Refine Identity
        </button>
      </div>
    </div>
  )
}

// ─── Root Page ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [provider] = useState<'openai' | 'claude'>('openai')
  const [domains, setDomains] = useState<DomainResult[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [currentQuery, setCurrentQuery] = useState('')
  const [activeTones, setActiveTones] = useState<ToneFilter[]>(['Premium'])
  const [activeExtensions, setActiveExtensions] = useState<ExtensionFilter[]>([])
  const [countryTlds, setCountryTlds] = useState<{ code: string; tlds: string[] } | null>(null)

  const handleSearch = useCallback(
    async (input: string) => {
      setIsGenerating(true)
      setError(null)
      setDomains([])
      setHasSearched(true)
      setCurrentQuery(input)

      try {
        const generateRes = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input, provider }),
        })

        const generateData = await generateRes.json()

        if (!generateRes.ok) {
          setError(generateData.error ?? 'Failed to generate domains.')
          setIsGenerating(false)
          return
        }

        // Persist geo TLDs so the Filters sidebar can show the country section
        if (generateData.countryCode && Array.isArray(generateData.countryTlds) && generateData.countryTlds.length > 0) {
          setCountryTlds({ code: generateData.countryCode, tlds: generateData.countryTlds })
        }

        const generatedDomains: string[] = generateData.domains
        const initialDomains: DomainResult[] = generatedDomains.map((d) => {
          const dotIndex = d.indexOf('.')
          return {
            domain: d,
            name: dotIndex === -1 ? d : d.slice(0, dotIndex),
            tld: dotIndex === -1 ? '' : d.slice(dotIndex),
            available: null,
          }
        })
        setDomains(initialDomains)
        setIsGenerating(false)

        setIsCheckingAvailability(true)
        try {
          const availRes = await fetch('/api/availability', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ domains: generatedDomains }),
          })

          if (!availRes.ok || !availRes.body) {
            setIsCheckingAvailability(false)
            return
          }

          const reader = availRes.body.getReader()
          const decoder = new TextDecoder()
          let buffer = ''

          // Build a lookup map so we can merge batches into state
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
                // Merge into current domain list preserving order
                setDomains((prev) =>
                  prev.map((d) => resolvedMap.get(d.domain) ?? d)
                )
              } catch {
                // malformed line — skip
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
    },
    [provider]
  )

  const handleRefine = useCallback(
    (hint: string) => {
      if (!currentQuery) return
      handleSearch(`${currentQuery} — make them ${hint.toLowerCase().replace('more ', '')}`)
    },
    [currentQuery, handleSearch]
  )

  return (
    <>
      <TopNav
        showSearch={hasSearched}
        currentQuery={currentQuery}
        isLoading={isGenerating}
        onSearch={handleSearch}
      />

      {!hasSearched ? (
        <LandingView onSearch={handleSearch} isLoading={isGenerating} />
      ) : (
        <ResultsView
          domains={domains}
          isLoading={isGenerating}
          isCheckingAvailability={isCheckingAvailability}
          error={error}
          query={currentQuery}
          activeTones={activeTones}
          activeExtensions={activeExtensions}
          countryTlds={countryTlds}
          onTonesChange={setActiveTones}
          onExtensionsChange={setActiveExtensions}
          onApplyFilters={() => { /* filters already reactive */ }}
          onRefine={handleRefine}
        />
      )}
    </>
  )
}
