'use client'

import { useState, useRef, useEffect } from 'react'

interface SearchInputProps {
  onSearch: (input: string) => void
  isLoading: boolean
  defaultValue?: string
  compact?: boolean // for results nav
}

const SUGGESTIONS = [
  'SaaS Startup',
  'Eco-friendly Fashion',
  'AI Creative Agency',
]

const SURPRISE_PROMPTS = [
  'A mindfulness app for busy professionals',
  'Blockchain-powered art marketplace',
  'AI personal finance coach',
  'Sustainable food delivery service',
  'Virtual reality fitness platform',
  'No-code website builder for creators',
]

export default function SearchInput({ onSearch, isLoading, defaultValue = '', compact = false }: SearchInputProps) {
  const [value, setValue] = useState(defaultValue)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed || isLoading) return
    onSearch(trimmed)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
  }

  const handleSurpriseMe = () => {
    const random = SURPRISE_PROMPTS[Math.floor(Math.random() * SURPRISE_PROMPTS.length)]
    setValue(random)
    onSearch(random)
  }

  if (compact) {
    // Results nav inline search
    return (
      <div className="relative group w-full">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-outline text-lg">search</span>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-primary/5 rounded-xl py-2.5 pl-11 pr-4 font-body font-semibold text-primary transition-all duration-300 outline-none"
          placeholder="Describe your idea..."
          disabled={isLoading}
        />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto relative group">
      <div className="bg-surface-container-lowest p-2 rounded-[2rem] premium-shadow ghost-border flex flex-col md:flex-row items-center gap-2 focus-within:ring-4 focus-within:ring-tertiary-fixed/30 transition-all duration-300">
        <div className="flex-1 flex items-center px-6 w-full">
          <span className="material-symbols-outlined text-outline-variant mr-4">search</span>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full py-4 bg-transparent border-none focus:ring-0 text-lg font-medium placeholder:text-outline-variant outline-none text-on-surface"
            placeholder="Describe your idea or enter a domain name..."
            disabled={isLoading}
          />
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || !value.trim()}
          className="w-full md:w-auto bg-primary text-on-primary px-8 py-5 rounded-xl font-bold text-lg tracking-tight hover:bg-primary-container transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              Generate Domains
              <span className="material-symbols-outlined">arrow_forward</span>
            </>
          )}
        </button>
      </div>

      {/* Quick Suggestion Chips */}
      <div className="flex flex-wrap justify-center gap-3 mt-6">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => { setValue(s); onSearch(s) }}
            disabled={isLoading}
            className="px-4 py-2 rounded-full bg-surface-container text-on-surface-variant text-sm font-semibold hover:bg-surface-container-highest cursor-pointer transition-colors disabled:opacity-50"
          >
            {s}
          </button>
        ))}
        <button
          type="button"
          onClick={handleSurpriseMe}
          disabled={isLoading}
          className="px-4 py-2 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-sm font-bold flex items-center gap-1 cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-xs">bolt</span>
          Surprise Me
        </button>
      </div>
    </div>
  )
}
