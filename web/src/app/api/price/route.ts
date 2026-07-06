import { NextResponse } from 'next/server'
import { getGoldPrice } from '../../lib/gold-price'

let cachedPrice: { data: Awaited<ReturnType<typeof getGoldPrice>>; timestamp: number } | null = null
const CACHE_TTL_MS = 60 * 1000 // 缓存 60 秒，避免频繁请求外部 API

export async function GET() {
  try {
    const now = Date.now()

    if (cachedPrice && now - cachedPrice.timestamp < CACHE_TTL_MS && cachedPrice.data) {
      return NextResponse.json({
        ...cachedPrice.data,
        cached: true,
        updated_at: new Date(cachedPrice.timestamp).toISOString(),
      })
    }

    const prices = await getGoldPrice()
    if (!prices) {
      return NextResponse.json({ error: '金价数据获取失败' }, { status: 502 })
    }

    cachedPrice = { data: prices, timestamp: now }

    return NextResponse.json({
      ...prices,
      cached: false,
      updated_at: new Date(now).toISOString(),
    })
  } catch (error) {
    console.error('Price API error:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
