'use client'

import { useEffect, useState } from 'react'

interface PriceData {
  price_cny_gram: number
  price_usd_oz: number
  usd_cny_rate: number
  source: string
}

export default function LivePrice() {
  const [price, setPrice] = useState<PriceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let mounted = true

    async function fetchPrice() {
      try {
        const res = await fetch('/api/price')
        if (!res.ok) throw new Error()
        const data = await res.json()
        if (mounted) {
          setPrice(data)
          setError(false)
        }
      } catch {
        if (mounted) setError(true)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchPrice()
    const interval = setInterval(fetchPrice, 60000)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  if (loading) {
    return (
      <div className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm">
        <span className="inline-block w-4 h-4 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
        <span className="text-gray-400 text-sm">获取实时金价...</span>
      </div>
    )
  }

  if (error || !price) {
    return null
  }

  return (
    <div className="inline-flex flex-col items-center px-6 py-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
      <div className="text-xs text-gray-400 mb-1">实时金价</div>
      <div className="text-3xl sm:text-4xl font-bold text-yellow-400">
        ¥{price.price_cny_gram.toFixed(2)}
        <span className="text-base font-normal text-gray-400">/克</span>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        ${price.price_usd_oz.toFixed(2)}/oz · {price.source} · 每分钟刷新
      </div>
    </div>
  )
}
