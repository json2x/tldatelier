'use client'

import { useState } from 'react'
import { type DomainResult } from '@/lib/types'

interface DomainCardProps {
  domain: DomainResult
  featured?: boolean
  index?: number
}

function getAffiliateLink(domain: string) {
  return `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(domain)}&aff=YOUR_AFFILIATE_CODE`
}

// ─── Status pill ──────────────────────────────────────────────────────────────
// Isolated so it can carry its own animation class without affecting the card.

function StatusPill({ available }: { available: boolean | null }) {
  if (available === null) {
    return (
      <span className="pill-checking inline-flex items-center gap-1.5 px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-full text-[10px] font-black uppercase tracking-widest">
        {/* tiny spinner dot */}
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-on-tertiary-fixed-variant opacity-70 animate-ping" />
        Checking
      </span>
    )
  }

  if (available === true) {
    return (
      <span className="pill-resolved inline-flex items-center gap-1.5 px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-[10px] font-black uppercase tracking-widest">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary" />
        Available
      </span>
    )
  }

  return (
    <span className="pill-resolved inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container text-outline rounded-full text-[10px] font-black uppercase tracking-widest opacity-60">
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-outline" />
      Taken
    </span>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export default function DomainCard({ domain, featured = false, index = 0 }: DomainCardProps) {
  const [copied, setCopied] = useState(false)
  const enterDelay = `${index * 30}ms`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(domain.domain)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  // ── Featured wide card (dark navy, Premium Pick) ──────────────────────────
  if (featured) {
    return (
      <div
        className="md:col-span-2 bg-primary-container p-8 rounded-lg flex flex-col md:flex-row justify-between items-center relative overflow-hidden group domain-card-shadow card-enter"
        style={{ animationDelay: enterDelay }}
      >
        <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
          <h4 className="text-white text-3xl font-black font-headline tracking-tighter mb-3">
            {domain.domain}
          </h4>
          <div className="flex items-center justify-center md:justify-start gap-2">
            <StatusPill available={domain.available} />
          </div>
          <p className="text-on-primary-container font-medium mt-3">
            A premium pick for your brand&apos;s future.
          </p>
        </div>
        <div className="relative z-10 flex flex-col items-center md:items-end gap-3">
          <span className="px-4 py-1.5 bg-secondary-fixed text-on-secondary-fixed rounded-full text-xs font-black uppercase">
            Premium Pick
          </span>
          <a
            href={getAffiliateLink(domain.domain)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-white text-primary rounded-xl font-black font-headline hover:scale-105 transition-transform"
          >
            Buy Domain
          </a>
        </div>
      </div>
    )
  }

  // ── Regular card ──────────────────────────────────────────────────────────
  const isAvailable = domain.available === true
  const isTaken = domain.available === false

  return (
    <div
      className="bg-surface-container-lowest p-6 rounded-lg domain-card-shadow group hover:-translate-y-1 transition-all duration-300 card-enter"
      style={{ animationDelay: enterDelay }}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-black font-headline tracking-tighter text-on-surface">
          {domain.domain}
        </h3>
        <button
          type="button"
          onClick={handleCopy}
          className="p-2 text-slate-300 hover:text-primary transition-colors"
          title="Copy domain"
        >
          <span className="material-symbols-outlined text-xl">
            {copied ? 'check' : 'content_copy'}
          </span>
        </button>
      </div>

      <div className="flex items-center gap-2 flex-wrap mb-8">
        <StatusPill available={domain.available} />
        {domain.tone.map((t) => (
          <span
            key={t}
            className="inline-flex items-center px-2 py-0.5 rounded-md bg-tertiary-fixed/40 text-on-tertiary-fixed-variant text-[9px] font-black uppercase tracking-wider"
          >
            {t}
          </span>
        ))}
      </div>

      {/* CTA */}
      {!isTaken ? (
        <a
          href={getAffiliateLink(domain.domain)}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-3.5 bg-primary text-on-primary text-center rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors"
        >
          Buy Domain
        </a>
      ) : (
        <a
          href={`https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(domain.domain)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-3.5 bg-surface-container-high text-on-surface-variant text-center rounded-xl font-bold text-sm hover:opacity-80 transition-opacity"
        >
          Make Offer
        </a>
      )}
    </div>
  )
}
