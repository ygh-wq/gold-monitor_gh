import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '黄金价格智能监控',
  description: '免费、全自动的黄金价格监控 + 邮件推送系统',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  )
}
