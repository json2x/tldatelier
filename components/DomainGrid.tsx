'use client'

import { type DomainResult } from '@/lib/types'
import DomainCard from './DomainCard'

interface DomainGridProps {
  domains: DomainResult[]
  isLoading: boolean
  isCheckingAvailability: boolean
}

function SkeletonCard({ index = 0 }: { index?: number }) {
  // Stagger both the breath animation and the shimmer sweep so cards feel
  // independent rather than all pulsing in lockstep.
  const breathDelay = `${(index * 120) % 1800}ms`
  const shimmerDelay = `${(index * 80) % 1400}ms`

  return (
    <div
      className="skeleton-card bg-white p-6 rounded-lg domain-card-shadow"
      style={{ animationDelay: breathDelay }}
    >
      {/* Domain name bar */}
      <div className="flex justify-between items-start mb-6">
        <div
          className="shimmer h-8 w-44 rounded-md"
          style={{ '--shimmer-delay': shimmerDelay } as React.CSSProperties}
        />
        <div className="shimmer h-8 w-8 rounded-full" />
      </div>

      {/* Status pill + secondary tag */}
      <div className="flex items-center gap-2 mb-8">
        <div className="shimmer h-5 w-24 rounded-full" />
        <div className="shimmer h-4 w-12 rounded-md" />
      </div>

      {/* CTA button */}
      <div className="shimmer h-12 w-full rounded-xl opacity-60" />
    </div>
  )
}

const SKELETON_COUNT = 100

export default function DomainGrid({ domains, isLoading, isCheckingAvailability }: DomainGridProps) {
  // Phase 1 — AI is still generating: show full 100-card skeleton grid
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <SkeletonCard key={i} index={i} />
        ))}
      </div>
    )
  }

  if (domains.length === 0) return null

  // Deduplicate by domain name as a safety net against duplicate AI output
  const seen = new Set<string>()
  const uniqueDomains = domains.filter((d) => {
    if (seen.has(d.domain)) return false
    seen.add(d.domain)
    return true
  })

  // Pick a "featured" domain — first available one, or just the first
  const featuredIndex = uniqueDomains.findIndex((d) => d.available === true)
  const safeFeaturedIndex = featuredIndex === -1 ? 0 : featuredIndex
  const regularDomains = uniqueDomains.filter((_, i) => i !== safeFeaturedIndex)
  const featuredDomain = uniqueDomains[safeFeaturedIndex]

  // Insert featured card after the 5th regular card
  const before = regularDomains.slice(0, 5)
  const after = regularDomains.slice(5)

  // Trailing skeletons while availability is still streaming
  const trailingSkeletons = Math.max(0, SKELETON_COUNT - uniqueDomains.length)

  let cardIndex = 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {before.map((d) => (
        <DomainCard key={d.domain} domain={d} index={cardIndex++} />
      ))}

      {featuredDomain && (
        <DomainCard key={featuredDomain.domain} domain={featuredDomain} featured index={cardIndex++} />
      )}

      {after.map((d) => (
        <DomainCard key={d.domain} domain={d} index={cardIndex++} />
      ))}

      {/* Trailing skeletons while availability is still being streamed in */}
      {isCheckingAvailability &&
        Array.from({ length: trailingSkeletons }).map((_, i) => (
          <SkeletonCard key={`sk-${i}`} index={uniqueDomains.length + i} />
        ))}
    </div>
  )
}
