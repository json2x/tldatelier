'use client'

import { useState, useCallback } from 'react'

export type ToneFilter = 'Premium' | 'Techy' | 'Playful' | 'Bold' | 'Minimal'
export type ExtensionFilter = string

export type IndustryFilter = string

export interface LengthFilter {
  min: number
  max: number
}

export interface SpecialCharsFilter {
  allowHyphen: boolean
  allowNumbers: boolean
}

export const LENGTH_ABS_MIN = 1
export const LENGTH_ABS_MAX = 63
export const LENGTH_DEFAULT: LengthFilter = { min: 3, max: 15 }

export const INDUSTRIES: { emoji: string; label: string }[] = [
  { emoji: '💻', label: 'Technology & Software' },
  { emoji: '🏥', label: 'Healthcare & Medical' },
  { emoji: '💰', label: 'Finance & Banking' },
  { emoji: '🎓', label: 'Education & E-Learning' },
  { emoji: '🛍️', label: 'Retail & E-Commerce' },
  { emoji: '🏗️', label: 'Real Estate & Construction' },
  { emoji: '🍽️', label: 'Food & Hospitality' },
  { emoji: '⚖️', label: 'Legal & Compliance' },
  { emoji: '📣', label: 'Marketing & Advertising' },
  { emoji: '🎨', label: 'Design & Creative' },
  { emoji: '🚚', label: 'Logistics & Supply Chain' },
  { emoji: '🏭', label: 'Manufacturing & Engineering' },
  { emoji: '🌱', label: 'Agriculture & Environment' },
  { emoji: '🎮', label: 'Gaming & Entertainment' },
  { emoji: '📡', label: 'Media & Publishing' },
  { emoji: '✈️', label: 'Travel & Tourism' },
  { emoji: '🔋', label: 'Energy & Utilities' },
  { emoji: '💼', label: 'Consulting & Management' },
  { emoji: '🧬', label: 'Biotech & Life Sciences' },
  { emoji: '🔒', label: 'Cybersecurity' },
  { emoji: '🤖', label: 'AI & Machine Learning' },
  { emoji: '🛰️', label: 'Aerospace & Defense' },
  { emoji: '🧘', label: 'Wellness & Fitness' },
  { emoji: '🏦', label: 'Insurance & Risk' },
  { emoji: '🤝', label: 'Non-profit & Social Impact' },
]

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
  activeIndustries: IndustryFilter[]
  lengthFilter: LengthFilter
  specialChars: SpecialCharsFilter
  onTonesChange: (tones: ToneFilter[]) => void
  onExtensionsChange: (exts: ExtensionFilter[]) => void
  onIndustriesChange: (industries: IndustryFilter[]) => void
  onLengthChange: (length: LengthFilter) => void
  onSpecialCharsChange: (sc: SpecialCharsFilter) => void
  onRegenerate: () => void
  countryTlds?: { code: string; tlds: string[] }
  variant?: 'sidebar' | 'drawer'
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

function getLengthLabel(n: number): string {
  if (n <= 5) return 'Very short'
  if (n <= 8) return 'Short'
  if (n <= 12) return 'Medium'
  if (n <= 20) return 'Long'
  return 'Very long'
}

export default function Filters({
  activeTones,
  activeExtensions,
  activeIndustries,
  lengthFilter,
  specialChars,
  onTonesChange,
  onExtensionsChange,
  onIndustriesChange,
  onLengthChange,
  onSpecialCharsChange,
  onRegenerate,
  countryTlds,
  variant = 'sidebar',
}: FiltersProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>('Extension')

  const isSidebar = variant === 'sidebar'

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
      onExtensionsChange(allTldsUnique.filter((e) => e !== ext))
    } else {
      onExtensionsChange(
        activeExtensions.includes(ext)
          ? activeExtensions.filter((e) => e !== ext)
          : [...activeExtensions, ext]
      )
    }
  }

  const toggleIndustry = (industry: IndustryFilter) => {
    onIndustriesChange(
      activeIndustries.includes(industry)
        ? activeIndustries.filter((i) => i !== industry)
        : [...activeIndustries, industry]
    )
  }

  const toggleGroup = (tlds: string[]) => {
    if (isShowingAll) {
      onExtensionsChange(allTldsUnique.filter((e) => !tlds.includes(e)))
    } else {
      const allSelected = tlds.every((e) => activeExtensions.includes(e))
      if (allSelected) {
        onExtensionsChange(activeExtensions.filter((e) => !tlds.includes(e)))
      } else {
        onExtensionsChange([...new Set([...activeExtensions, ...tlds])])
      }
    }
  }

  const isGroupAllSelected = (tlds: string[]) =>
    isShowingAll || tlds.every((e) => activeExtensions.includes(e))

  const isGroupPartialSelected = (tlds: string[]) =>
    !isShowingAll && !isGroupAllSelected(tlds) && tlds.some((e) => activeExtensions.includes(e))

  const showAll = () => onExtensionsChange([])

  const handleMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Math.min(Number(e.target.value), lengthFilter.max - 1)
      onLengthChange({ ...lengthFilter, min: val })
    },
    [lengthFilter, onLengthChange]
  )

  const handleMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Math.max(Number(e.target.value), lengthFilter.min + 1)
      onLengthChange({ ...lengthFilter, max: val })
    },
    [lengthFilter, onLengthChange]
  )

  const tabs: FilterTab[] = ['Tone', 'Extension', 'Length', 'Industry']

  const industryCount = activeIndustries.length
  const hasLengthCustom =
    lengthFilter.min !== LENGTH_DEFAULT.min ||
    lengthFilter.max !== LENGTH_DEFAULT.max ||
    !specialChars.allowHyphen ||
    specialChars.allowNumbers

  return (
    <aside className={`${isSidebar ? 'hidden lg:flex w-64 border-r border-black/[0.05]' : 'flex w-full'} flex-col h-full bg-slate-50 font-body text-sm shrink-0`}>
      {isSidebar && (
        <div className="px-6 pt-6 pb-4 shrink-0">
          <h2 className="text-lg font-black text-black font-headline">Refine Identity</h2>
          <p className="text-slate-400 text-xs">AI Customization</p>
        </div>
      )}

      <div className="px-3 space-y-0.5 shrink-0">
        <p className="px-3 pb-1 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
          Filter Categories
        </p>
        {tabs.map((tab) => {
          const badge =
            tab === 'Industry' && industryCount > 0
              ? industryCount
              : tab === 'Length' && hasLengthCustom
              ? '!'
              : null
          return (
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
              {badge !== null && (
                <span className="ml-auto inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-on-primary text-[9px] font-black">
                  {badge}
                </span>
              )}
              {badge === null && (
                <span className="ml-auto material-symbols-outlined text-sm opacity-30 group-hover:opacity-80 transition-opacity">
                  chevron_right
                </span>
              )}
            </button>
          )
        })}
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
              {countryTlds && countryTlds.tlds.length > 0 && (
                <div>
                  <div className="px-2 mb-1.5 flex items-center justify-between">
                    <p className="text-[9px] font-black uppercase tracking-[0.15em] text-on-tertiary-fixed-variant flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                        location_on
                      </span>
                      {COUNTRY_NAMES[countryTlds.code] ?? countryTlds.code}
                    </p>
                    <GroupToggle
                      allSelected={isGroupAllSelected(countryTlds.tlds)}
                      partial={isGroupPartialSelected(countryTlds.tlds)}
                      onToggle={() => toggleGroup(countryTlds.tlds)}
                    />
                  </div>
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

              {TLD_GROUPS.map((group) => (
                <div key={group.label}>
                  <div className="px-2 mb-1.5 flex items-center justify-between">
                    <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">
                      {group.label}
                    </p>
                    <GroupToggle
                      allSelected={isGroupAllSelected(group.tlds)}
                      partial={isGroupPartialSelected(group.tlds)}
                      onToggle={() => toggleGroup(group.tlds)}
                    />
                  </div>
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

        {activeTab === 'Length' && (
          <div className="px-6 py-4 space-y-6">

            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  Name Length
                </p>
                <button
                  type="button"
                  onClick={() => onLengthChange(LENGTH_DEFAULT)}
                  className="text-[9px] font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest"
                >
                  Reset
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mb-4">Characters in domain name (excluding TLD)</p>

              <div className="flex items-center justify-between mb-2">
                <div className="text-center">
                  <div className="text-xl font-black text-primary font-headline">{lengthFilter.min}</div>
                  <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">{getLengthLabel(lengthFilter.min)}</div>
                </div>
                <div className="flex-1 mx-3 h-px bg-slate-200 relative">
                  <div
                    className="absolute h-px bg-primary"
                    style={{
                      left: `${((lengthFilter.min - LENGTH_ABS_MIN) / (LENGTH_ABS_MAX - LENGTH_ABS_MIN)) * 100}%`,
                      right: `${100 - ((lengthFilter.max - LENGTH_ABS_MIN) / (LENGTH_ABS_MAX - LENGTH_ABS_MIN)) * 100}%`,
                    }}
                  />
                </div>
                <div className="text-center">
                  <div className="text-xl font-black text-primary font-headline">{lengthFilter.max}</div>
                  <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">{getLengthLabel(lengthFilter.max)}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-400 w-5 text-right font-mono">{lengthFilter.min}</span>
                  <input
                    type="range"
                    min={LENGTH_ABS_MIN}
                    max={LENGTH_ABS_MAX}
                    value={lengthFilter.min}
                    onChange={handleMinChange}
                    className="flex-1 h-1.5 rounded-full accent-black cursor-pointer"
                    aria-label="Minimum domain name length"
                  />
                  <span className="text-[10px] text-slate-300 w-5 font-mono">min</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-400 w-5 text-right font-mono">{lengthFilter.max}</span>
                  <input
                    type="range"
                    min={LENGTH_ABS_MIN}
                    max={LENGTH_ABS_MAX}
                    value={lengthFilter.max}
                    onChange={handleMaxChange}
                    className="flex-1 h-1.5 rounded-full accent-black cursor-pointer"
                    aria-label="Maximum domain name length"
                  />
                  <span className="text-[10px] text-slate-300 w-5 font-mono">max</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-tertiary-fixed/20 rounded-xl border border-tertiary-fixed/30">
                <p className="text-[10px] font-bold text-on-tertiary-fixed-variant mb-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
                  Best Practice
                </p>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  <strong>6–14 chars</strong> is the sweet spot — memorable, typable, and brandable. Under 5 chars are rare; over 20 hurt recall.
                </p>
              </div>
            </div>

            <div className="border-t border-black/[0.05]" />

            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-3">
                Allowed Characters
              </p>
              <p className="text-[10px] text-slate-400 mb-4">Toggle which special characters AI may include in generated names</p>

              <div className="space-y-2">
                <ToggleRow
                  icon="remove"
                  label="Hyphens"
                  description="e.g. my-brand.com"
                  checked={specialChars.allowHyphen}
                  onChange={(v) => onSpecialCharsChange({ ...specialChars, allowHyphen: v })}
                  defaultOn
                />
                <ToggleRow
                  icon="tag"
                  label="Numbers"
                  description="e.g. brand42.io"
                  checked={specialChars.allowNumbers}
                  onChange={(v) => onSpecialCharsChange({ ...specialChars, allowNumbers: v })}
                />
              </div>

              <div className="mt-4 p-3 bg-surface-container rounded-xl">
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  <strong>Hyphens</strong> were common in early SEO but reduce memorability. <strong>Numbers</strong> can work in tech brands (web3, studio42) but may feel dated.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Industry' && (
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-1 px-2">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                Industry
              </p>
              {industryCount > 0 && (
                <button
                  type="button"
                  onClick={() => onIndustriesChange([])}
                  className="text-[9px] font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest"
                >
                  Clear ({industryCount})
                </button>
              )}
            </div>
            <p className="text-[10px] text-slate-400 mb-4 px-2">
              AI will tailor name suggestions to your sector
            </p>

            <div className="space-y-0.5">
              {INDUSTRIES.map(({ emoji, label }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => toggleIndustry(label)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-colors text-left ${
                    activeIndustries.includes(label)
                      ? 'bg-tertiary-fixed/40 text-on-tertiary-fixed-variant font-semibold'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-base leading-none">{emoji}</span>
                  <span className="flex-1 leading-tight">{label}</span>
                  {activeIndustries.includes(label) && (
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                  )}
                </button>
              ))}
            </div>

            {industryCount > 0 && (
              <div className="mt-4 mx-2 p-3 bg-tertiary-fixed/20 rounded-xl border border-tertiary-fixed/30">
                <p className="text-[10px] text-on-tertiary-fixed-variant font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  {industryCount} industr{industryCount === 1 ? 'y' : 'ies'} selected
                </p>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">AI will focus domain suggestions on your chosen sectors.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="px-6 py-4 border-t border-black/[0.04] shrink-0">
        <button
          type="button"
          onClick={onRegenerate}
          className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold font-headline tracking-tight hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">autorenew</span>
          Regenerate
        </button>
      </div>
    </aside>
  )
}

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

function ToggleRow({
  icon,
  label,
  description,
  checked,
  onChange,
  defaultOn = false,
}: {
  icon: string
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
  defaultOn?: boolean
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left ${
        checked
          ? 'bg-surface-container text-on-surface'
          : 'bg-slate-100/50 text-slate-400'
      }`}
    >
      <span className={`material-symbols-outlined text-base ${checked ? 'text-primary' : 'text-slate-400'}`}>
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-semibold leading-none mb-0.5 ${checked ? 'text-on-surface' : 'text-slate-400'}`}>
          {label}
          {defaultOn && !checked && (
            <span className="ml-1.5 text-[9px] font-bold text-slate-300 uppercase tracking-wide">off</span>
          )}
        </p>
        <p className="text-[10px] text-slate-400 leading-none">{description}</p>
      </div>
      <div
        className={`relative w-8 h-4 rounded-full transition-colors shrink-0 ${
          checked ? 'bg-primary' : 'bg-slate-200'
        }`}
      >
        <div
          className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </div>
    </button>
  )
}

function GroupToggle({
  allSelected,
  partial,
  onToggle,
}: {
  allSelected: boolean
  partial: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title={allSelected ? 'Deselect all' : 'Select all'}
      className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide transition-colors text-slate-400 hover:text-primary"
    >
      <span
        className={`w-3 h-3 rounded border flex items-center justify-center transition-colors ${
          allSelected
            ? 'bg-primary border-primary'
            : partial
            ? 'bg-primary/30 border-primary/50'
            : 'border-slate-300 bg-white'
        }`}
      >
        {allSelected && (
          <span className="material-symbols-outlined text-white leading-none" style={{ fontSize: '9px' }}>check</span>
        )}
        {partial && !allSelected && (
          <span className="block w-1.5 h-0.5 bg-primary rounded-full" />
        )}
      </span>
      {allSelected ? 'All' : 'All'}
    </button>
  )
}
