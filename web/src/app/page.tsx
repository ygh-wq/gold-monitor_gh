import Link from 'next/link'
import LivePrice from './components/LivePrice'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl font-bold mb-6">
            <span className="text-yellow-400">🥇</span> 黄金价格智能监控
          </h1>
          <p className="text-xl text-gray-300 mb-4 max-w-2xl mx-auto">
            免费、全自动的黄金价格监控系统，每日推送金价报告到你的邮箱，
            帮你实时掌握金价变动和持仓盈亏。
          </p>
          <div className="mb-10">
            <LivePrice />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/subscribe"
              className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold rounded-xl text-lg transition-colors"
            >
              📧 免费订阅金价报告
            </Link>
            <Link
              href="/deploy"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 font-bold rounded-xl text-lg transition-colors"
            >
              🚀 自己部署一套
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          功能特性
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: '📊', title: '实时金价', desc: '多数据源自动切换，国际金价实时换算为人民币克价' },
            { icon: '⏰', title: '定时推送', desc: '每日 3 次邮件报告，北京时间 07:30、13:00、18:00' },
            { icon: '🚨', title: '波动预警', desc: '日涨跌超 1.5% 或周涨跌超 3% 立即推送提醒' },
            { icon: '💰', title: '持仓盈亏', desc: '自动计算你的黄金市值和浮动盈亏' },
            { icon: '📰', title: '市场资讯', desc: '自动抓取黄金相关中文新闻' },
            { icon: '🆓', title: '完全免费', desc: '运行在 GitHub Actions 上，零成本 24/7 运行' },
          ].map((f) => (
            <div
              key={f.title}
              className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-yellow-50 border-t border-yellow-100">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            两种使用方式，任你选择
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div className="p-6 bg-white rounded-xl border border-gray-200">
              <div className="text-4xl mb-4">📬</div>
              <h3 className="font-bold text-lg mb-2">订阅模式</h3>
              <p className="text-gray-500 text-sm mb-4">
                填写邮箱即可收到每日金价报告，最简单的方式。
              </p>
              <Link
                href="/subscribe"
                className="inline-block px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold rounded-lg text-sm transition-colors"
              >
                立即订阅
              </Link>
            </div>
            <div className="p-6 bg-white rounded-xl border border-gray-200">
              <div className="text-4xl mb-4">🛠️</div>
              <h3 className="font-bold text-lg mb-2">自建部署</h3>
              <p className="text-gray-500 text-sm mb-4">
                Fork 仓库到你的 GitHub，拥有完全自主控制权。
              </p>
              <Link
                href="/deploy"
                className="inline-block px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg text-sm transition-colors"
              >
                部署教程
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400 text-sm">
        <p>黄金价格智能监控系统 · 开源免费 · MIT License</p>
        <p className="mt-2">
          <a
            href="https://github.com/ygh-wq/gold-monitor_gh"
            className="hover:text-gray-600 underline"
            target="_blank"
          >
            GitHub 源码
          </a>
        </p>
      </footer>
    </main>
  )
}
