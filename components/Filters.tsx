'use client'

import { useState } from 'react'

export type ToneFilter = 'Premium' | 'Techy' | 'Playful' | 'Bold' | 'Minimal'
// ExtensionFilter is now any valid TLD string
export type ExtensionFilter = string

// ─── TLD catalogue (mirrors lib/ai.ts categories) ────────────────────────────

export const TLD_GROUPS: { label: string; tlds: string[] }[] = [
  {
    label: 'Core Traditional',
    tlds: ['.com', '.net', '.org', '.info', '.biz'],
  },
  {
    label: 'Startup / Tech',
    tlds: ['.io', '.ai', '.co', '.dev', '.app', '.tech', '.cloud', '.software', '.systems', '.digital', '.network', '.tools', '.build', '.run', '.stack'],
  },
  {
    label: 'Creative',
    tlds: ['.design', '.studio', '.art', '.media', '.ink', '.gallery', '.show', '.style', '.works'],
  },
  {
    label: 'Business / Brand',
    tlds: ['.agency', '.consulting', '.ventures', '.capital', '.group', '.partners', '.solutions', '.services', '.pro'],
  },
  {
    label: 'Consumer / Retail',
    tlds: ['.shop', '.store', '.market', '.deals', '.buy', '.products', '.online', '.site'],
  },
  {
    label: 'Lifestyle',
    tlds: ['.life', '.live', '.zone', '.space', '.world', '.social', '.community', '.club'],
  },
  {
    label: 'Emerging / Hot',
    tlds: ['.xyz', '.gg', '.so', '.to', '.sh', '.wtf', '.lol', '.fun', '.cool', '.vip', '.pro', '.plus', '.one'],
  },
  {
    label: 'New gTLD',
    tlds: ['.page', '.web', '.link', '.blog', '.wiki', '.today', '.news'],
  },
]

interface FiltersProps {
  activeTones: ToneFilter[]
  activeExtensions: ExtensionFilter[]
  onTonesChange: (tones: ToneFilter[]) => void
  onExtensionsChange: (exts: ExtensionFilter[]) => void
  onApply: () => void
  countryTlds?: { code: string; tlds: string[] }
}

type FilterTab = 'Tone' | 'Extension' | 'Length' | 'Industry'

const TONES: ToneFilter[] = ['Premium', 'Techy', 'Playful', 'Bold', 'Minimal']

const TAB_ICONS: Record<FilterTab, string> = {
  Tone: 'tune',
  Extension: 'language',
  Length: 'straighten',
  Industry: 'category',
}

const COUNTRY_NAMES: Record<string, string> = {
  PH: 'Philippines', JP: 'Japan', KR: 'South Korea', CN: 'China', IN: 'India',
  AU: 'Australia', NZ: 'New Zealand', SG: 'Singapore', MY: 'Malaysia', ID: 'Indonesia',
  TH: 'Thailand', VN: 'Vietnam', HK: 'Hong Kong', TW: 'Taiwan', BD: 'Bangladesh',
  PK: 'Pakistan', LK: 'Sri Lanka', GB: 'United Kingdom', DE: 'Germany', FR: 'France',
  ES: 'Spain', IT: 'Italy', NL: 'Netherlands', BE: 'Belgium', CH: 'Switzerland',
  AT: 'Austria', PL: 'Poland', SE: 'Sweden', NO: 'Norway', DK: 'Denmark',
  FI: 'Finland', PT: 'Portugal', CZ: 'Czech Republic', HU: 'Hungary', RO: 'Romania',
  UA: 'Ukraine', RU: 'Russia', TR: 'Turkey', GR: 'Greece', US: 'United States',
  CA: 'Canada', MX: 'Mexico', BR: 'Brazil', AR: 'Argentina', CL: 'Chile',
  CO: 'Colombia', PE: 'Peru', VE: 'Venezuela', ZA: 'South Africa', NG: 'Nigeria',
  KE: 'Kenya', EG: 'Egypt', IL: 'Israel', SA: 'Saudi Arabia', AE: 'UAE',
}

export default function Filters({
  activeTones,
  activeExtensions,
  onTonesChange,
  onExtensionsChange,
  onApply,
  countryTlds,
}: FiltersProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>('Extension')

  // empty activeExtensions === "show all" (no filter applied)
  const isShowingAll = activeExtensions.length === 0

  const allTlds = [
    ...(countryTlds?.tlds ?? []),
    ...TLD_GROUPS.flatMap((g) => g.tlds),
  ]
  const allTldsUnique = [...new Set(allTlds)]

  const toggleTone = (tone: ToneFilter) => {
    onTonesChange(
      activeTones.includes(tone)
        ? activeTones.filter((t) => t !== tone)
        : [...activeTones, tone]
    )
  }

  const toggleExtension = (ext: ExtensionFilter) => {
    if (isShowingAll) {
      // First explicit selection: switch from "all" to "everything except this one"
      onExtensionsChange(allTldsUnique.filter((e) => e !== ext))
    } else {
      onExtensionsChange(
        activeExtensions.includes(ext)
          ? activeExtensions.filter((e) => e !== ext)
          : [...activeExtensions, ext]
      )
    }
  }

  // "Show All" = empty array = no filter
  const showAll = () => onExtensionsChange([])

  const tabs: FilterTab[] = ['Tone', 'Extension', 'Length', 'Industry']

  return (
    <aside className="hidden lg:flex flex-col h-full w-64 bg-slate-50 border-r border-black/[0.05] font-body text-sm shrink-0">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 shrink-0">
        <h2 className="text-lg font-black text-black font-headline">Refine Identity</h2>
        <p className="text-slate-400 text-xs">AI Customization</p>
      </div>

      {/* Tab nav */}
      <div className="px-3 space-y-0.5 shrink-0">
        <p className="px-3 pb-1 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
          Filter Categories
        </p>
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ease-out group ${
              activeTab === tab
                ? 'bg-white text-black shadow-sm'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-lg">{TAB_ICONS[tab]}</span>
            <span className={activeTab === tab ? 'font-semibold' : ''}>{tab}</span>
            <span className="ml-auto material-symbols-outlined text-sm opacity-30 group-hover:opacity-80 transition-opacity">
              chevron_right
            </span>
          </button>
        ))}
      </div>

      {/* Filter content — scrollable */}
      <div className="flex-1 overflow-y-auto no-scrollbar mt-4 border-t border-black/[0.04]">
        {activeTab === 'Tone' && (
          <div className="px-6 py-4 space-y-3">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-3">
              Active Tone
            </p>
            <div className="flex flex-wrap gap-2">
              {TONES.map((tone) => (
                <button
                  key={tone}
                  type="button"
                  onClick={() => toggleTone(tone)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    activeTones.includes(tone)
                      ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                      : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Extension' && (
          <div className="px-4 py-4">
            {/* All / filtered status row */}
            <div className="flex items-center justify-between mb-4 px-2">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                Preferred Extensions
              </p>
              <button
                type="button"
                onClick={showAll}
                className={`text-[10px] font-bold transition-colors ${
                  isShowingAll
                    ? 'text-on-tertiary-fixed-variant underline'
                    : 'text-slate-400 hover:text-on-tertiary-fixed-variant hover:underline'
                }`}
              >
                {isShowingAll ? 'All (default)' : `${activeExtensions.length} selected`}
              </button>
            </div>

            <div className="space-y-5">
              {/* Country-specific section at the top if geo detected */}
              {countryTlds && countryTlds.tlds.length > 0 && (
                <div>
                  <p className="px-2 mb-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-on-tertiary-fixed-variant flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                      location_on
                    </span>
                    {COUNTRY_NAMES[countryTlds.code] ?? countryTlds.code}
                  </p>
                  <div className="space-y-0.5">
                    {countryTlds.tlds.map((ext) => (
                      <TldCheckbox
                        key={ext}
                        ext={ext}
                        checked={isShowingAll || activeExtensions.includes(ext)}
                        onChange={toggleExtension}
                        highlight
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* All grouped TLDs */}
              {TLD_GROUPS.map((group) => (
                <div key={group.label}>
                  <p className="px-2 mb-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">
                    {group.label}
                  </p>
                  <div className="space-y-0.5">
                    {group.tlds.map((ext) => (
                      <TldCheckbox
                        key={ext}
                        ext={ext}
                        checked={isShowingAll || activeExtensions.includes(ext)}
                        onChange={toggleExtension}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'Length' || activeTab === 'Industry') && (
          <div className="px-6 py-4">
            <p className="text-xs text-on-surface-variant">Coming soon</p>
          </div>
        )}
      </div>

      {/* Apply button */}
      <div className="px-6 py-4 border-t border-black/[0.04] shrink-0">
        <button
          type="button"
          onClick={onApply}
          className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold font-headline tracking-tight hover:opacity-90 transition-opacity"
        >
          Apply Filters
        </button>
      </div>
    </aside>
  )
}

// ─── TLD checkbox row ─────────────────────────────────────────────────────────

function TldCheckbox({
  ext,
  checked,
  onChange,
  highlight = false,
}: {
  ext: string
  checked: boolean
  onChange: (ext: string) => void
  highlight?: boolean
}) {
  return (
    <label
      className={`flex items-center gap-3 px-2 py-1.5 rounded-lg cursor-pointer transition-colors text-xs font-medium select-none ${
        checked
          ? highlight
            ? 'bg-tertiary-fixed/40 text-on-tertiary-fixed-variant'
            : 'bg-surface-container text-on-surface'
          : 'text-slate-500 hover:bg-slate-100'
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onChange(ext)}
        className="rounded border-outline-variant text-primary focus:ring-primary accent-black"
      />
      <span className={highlight && checked ? 'font-bold' : ''}>{ext}</span>
    </label>
  )
}
