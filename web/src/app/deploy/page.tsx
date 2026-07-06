'use client'

import { useState } from 'react'
import Link from 'next/link'

const REPO_URL = 'https://github.com/keoku/gold-monitor_gh'

interface ConfigForm {
  goldGrams: string
  investedAmount: string
  email: string
  dailyAlertPct: string
  weeklyAlertPct: string
  reportSlots: string
}

export default function DeployPage() {
  const [step, setStep] = useState(1)
  const [config, setConfig] = useState<ConfigForm>({
    goldGrams: '',
    investedAmount: '',
    email: '',
    dailyAlertPct: '1.5',
    weeklyAlertPct: '3.0',
    reportSlots: '07:30, 13:00, 18:00',
  })

  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const generatedSlots = config.reportSlots
    .split(',')
    .map((s) => s.trim())
    .filter((s) => /^\d{2}:\d{2}$/.test(s))

  const variables = [
    { name: 'GOLD_GRAMS', value: config.goldGrams || '0', desc: '持有黄金克数', optional: true },
    { name: 'INVESTED_AMOUNT', value: config.investedAmount || '0', desc: '投入总金额(元)', optional: true },
    { name: 'DAILY_ALERT_PCT', value: config.dailyAlertPct, desc: '日波动阈值(%)', optional: true },
    { name: 'WEEKLY_ALERT_PCT', value: config.weeklyAlertPct, desc: '周波动阈值(%)', optional: true },
    {
      name: 'REPORT_SLOTS',
      value: JSON.stringify(generatedSlots.length > 0 ? generatedSlots : ['07:30', '13:00', '18:00']),
      desc: '推送时间(JSON 数组)',
      optional: true,
    },
    { name: 'SENDER_NAME', value: '黄金智能监控', desc: '邮件发件人名称', optional: true },
    { name: 'FROM_EMAIL', value: 'onboarding@resend.dev', desc: '发件邮箱地址', optional: true },
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm">
            ← 返回首页
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mt-4">
            🚀 自建部署引导
          </h1>
          <p className="text-gray-500 mt-2">
            按照以下步骤操作，5 分钟内拥有你自己的黄金监控系统。
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-10">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= s
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {step > s ? '✓' : s}
              </div>
              {s < 4 && (
                <div
                  className={`w-12 h-0.5 ${
                    step > s ? 'bg-yellow-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Fork */}
        {step === 1 && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              第 1 步：Fork 仓库
            </h2>
            <p className="text-gray-600 mb-6">
              点击下方按钮，将黄金监控仓库复制到你的 GitHub 账号下。
              你需要一个 GitHub 账号（免费注册即可）。
            </p>
            <a
              href={`${REPO_URL}/fork`}
              target="_blank"
              className="inline-block px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors"
            >
              前往 GitHub Fork 仓库 →
            </a>
            <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="text-sm text-blue-700">
                💡 如果你还没有 GitHub 账号，先在{' '}
                <a
                  href="https://github.com/signup"
                  target="_blank"
                  className="underline"
                >
                  github.com
                </a>{' '}
                免费注册一个。
              </p>
            </div>
            <button
              onClick={() => setStep(2)}
              className="mt-6 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold rounded-lg transition-colors"
            >
              我已完成 Fork，下一步 →
            </button>
          </div>
        )}

        {/* Step 2: Config Form */}
        {step === 2 && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              第 2 步：填写你的配置
            </h2>
            <p className="text-gray-600 mb-6">
              填写以下信息，系统会自动生成你需要的配置。所有数据仅在你的浏览器本地处理，不会上传。
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  持有黄金克数
                </label>
                <input
                  type="number"
                  placeholder="例如: 50"
                  value={config.goldGrams}
                  onChange={(e) =>
                    setConfig({ ...config, goldGrams: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  投入总金额（元）
                </label>
                <input
                  type="number"
                  placeholder="例如: 60000"
                  value={config.investedAmount}
                  onChange={(e) =>
                    setConfig({ ...config, investedAmount: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  接收邮箱
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={config.email}
                  onChange={(e) =>
                    setConfig({ ...config, email: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  每日推送时间（北京时间，逗号分隔）
                </label>
                <input
                  type="text"
                  placeholder="07:30, 13:00, 18:00"
                  value={config.reportSlots}
                  onChange={(e) =>
                    setConfig({ ...config, reportSlots: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    日波动提醒阈值 (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={config.dailyAlertPct}
                    onChange={(e) =>
                      setConfig({ ...config, dailyAlertPct: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    周波动提醒阈值 (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={config.weeklyAlertPct}
                    onChange={(e) =>
                      setConfig({ ...config, weeklyAlertPct: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← 上一步
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold rounded-lg transition-colors"
              >
                生成配置 →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Generated Config */}
        {step === 3 && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              第 3 步：配置 GitHub 仓库
            </h2>
            <p className="text-gray-600 mb-6">
              进入你 Fork 的仓库，点击{' '}
              <strong>Settings → Secrets and variables → Actions → Variables</strong>
              ，逐个添加以下变量：
            </p>

            {/* Secrets */}
            <div className="mb-8">
              <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">
                  Secrets
                </span>
                需要在 Secrets 中配置（加密）
              </h3>
              <div className="border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
                  <div>
                    <code className="font-mono text-sm font-bold">RESEND_API_KEY</code>
                    <p className="text-xs text-gray-500 mt-1">
                      邮件 API Key —{' '}
                      <a
                        href="https://resend.com"
                        target="_blank"
                        className="underline text-blue-600"
                      >
                        在 resend.com 免费注册获取
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Variables */}
            <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                Variables
              </span>
              普通配置变量（全部可选，有默认值）
            </h3>
            <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-700">
                ⚠️ 只添加你需要自定义的变量。不需要修改的请不要创建（空值不等于默认值，会导致功能异常）。
              </p>
            </div>
            <div className="border rounded-lg overflow-hidden divide-y">
              {variables.map((v) => (
                <div
                  key={v.name}
                  className="flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <div>
                    <code className="font-mono text-sm font-bold">
                      {v.name}
                    </code>
                    <p className="text-xs text-gray-500 mt-0.5">{v.desc}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {v.value}
                    </code>
                    <button
                      onClick={() => copyToClipboard(v.value, v.name)}
                      className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                    >
                      {copied === v.name ? '✓ 已复制' : '复制'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Recipients */}
            {config.email && (
              <div className="mt-8">
                <h3 className="font-bold text-gray-700 mb-3">
                  📧 收件人配置
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  编辑仓库中的 <code>recipients.json</code> 文件，替换为：
                </p>
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "personal": ["${config.email}"],
  "general": []
}`}
                  </pre>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `{\n  "personal": ["${config.email}"],\n  "general": []\n}`,
                        'recipients'
                      )
                    }
                    className="absolute top-2 right-2 px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 rounded transition-colors"
                  >
                    {copied === 'recipients' ? '✓ 已复制' : '复制'}
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← 上一步
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold rounded-lg transition-colors"
              >
                我已配置完成 →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Done */}
        {step === 4 && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              部署完成！
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              你的黄金监控系统已经配置好了。它会按照设定的时间自动推送金价报告到你的邮箱。
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-left max-w-md mx-auto mb-8">
              <h3 className="font-bold text-green-800 mb-3">接下来会发生什么：</h3>
              <ul className="space-y-2 text-sm text-green-700">
                <li>✅ 系统每天按设定时间自动运行</li>
                <li>✅ 金价报告会发送到你的邮箱</li>
                <li>✅ 如果金价大幅波动会立即预警</li>
              </ul>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                想要更精确的推送时间？参考{' '}
                <a
                  href={`${REPO_URL}/blob/main/SETUP_CRON.md`}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  外部定时服务配置指南
                </a>
              </p>
              <p className="text-sm text-gray-500">
                手动触发测试：进入仓库 Actions 页面 → Gold Price Alert → Run workflow
              </p>
            </div>

            <div className="flex gap-4 mt-8 justify-center">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                重新配置
              </button>
              <a
                href={REPO_URL}
                target="_blank"
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors"
              >
                查看 GitHub 仓库
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
