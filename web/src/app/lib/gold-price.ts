export interface GoldPrices {
  price_cny_gram: number
  price_usd_oz: number
  usd_cny_rate: number
  source: string
}

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 GoldMonitor/1.0' },
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function getGoldPrice(): Promise<GoldPrices | null> {
  let priceUsdOz: number | null = null
  let source = ''

  // Swissquote (FINMA监管瑞士银行，秒级实时，国内可访问)
  try {
    const data = (await fetchJson(
      'https://forex-data-feed.swissquote.com/public-quotes/bboquotes/instrument/XAU/USD'
    )) as Array<{
      spreadProfilePrices: Array<{ bid: number; ask: number }>
    }>
    if (data?.[0]?.spreadProfilePrices?.[0]) {
      const { bid, ask } = data[0].spreadProfilePrices[0]
      priceUsdOz = (bid + ask) / 2
      source = 'Swissquote'
    }
  } catch { /* fallback */ }

  // metals.live
  if (!priceUsdOz) {
    try {
      const data = (await fetchJson('https://api.metals.live/v1/spot/gold')) as Array<{ price: string }>
      if (data.length > 0) {
        priceUsdOz = parseFloat(data[0].price)
        source = 'metals.live'
      }
    } catch { /* fallback */ }
  }

  // goldprice.org
  if (!priceUsdOz) {
    try {
      const data = (await fetchJson('https://data-asg.goldprice.org/dbXRates/USD')) as {
        items?: Array<{ xauPrice?: number }>
      }
      if (data.items?.[0]?.xauPrice) {
        priceUsdOz = data.items[0].xauPrice
        source = 'goldprice.org'
      }
    } catch { /* fallback */ }
  }

  if (!priceUsdOz) return null

  // USD → CNY (多数据源)
  let usdCnyRate = 7.25
  try {
    const data = (await fetchJson('https://api.exchangerate-api.com/v4/latest/USD')) as {
      rates: { CNY: number }
    }
    usdCnyRate = data.rates.CNY
  } catch {
    try {
      const data = (await fetchJson('https://api.frankfurter.app/latest?from=USD&to=CNY')) as {
        rates: { CNY: number }
      }
      usdCnyRate = data.rates.CNY
    } catch { /* use fallback */ }
  }

  return {
    price_cny_gram: Math.round((priceUsdOz * usdCnyRate) / 31.1035 * 100) / 100,
    price_usd_oz: Math.round(priceUsdOz * 100) / 100,
    usd_cny_rate: Math.round(usdCnyRate * 10000) / 10000,
    source,
  }
}
