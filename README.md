# 🥇 黄金价格智能监控系统

> 免费、全自动的黄金价格监控 + 邮件推送系统，运行在 GitHub Actions 上，零成本 24/7 运行。

---

## ✨ 功能特性

| 功能 | 说明 |
|------|------|
| 📊 实时金价 | 多数据源自动切换（Swissquote 瑞讯银行 → metals.live → Yahoo Finance → goldprice.org） |
| 💱 自动换算 | 国际金价 USD/oz → 人民币 ¥/克，多汇率源（Frankfurter → ExchangeRate-API → 硬编码降级） |
| ⏰ 定时报告 | 每日 3 次推送（默认 07:30、13:00、18:00 北京时间） |
| 🚨 波动预警 | 阶梯式智能预警（日 1.5%→3%→5%→8%，周 3%→5%→8%→12%），同方向跨档才再次通知 |
| 💰 持仓盈亏 | 计算你的黄金市值和浮动盈亏（仅 personal 收件人可见） |
| 📰 市场资讯 | 自动抓取黄金相关中文新闻 |
| 📅 事件日历 | 未来影响金价的重大经济事件提醒 |
| 🌐 在线测试 | 网页端可即时发送测试金价报告到邮箱 |
| 🆓 完全免费 | GitHub Actions 免费额度运行，无需服务器 |

---

## 📊 金价数据源

系统按优先级依次尝试以下数据源（权威性 + 实时性排序）：

| 优先级 | 数据源 | 背景 | 实时性 | 可达性 |
|--------|--------|------|--------|--------|
| 1 | **Swissquote 瑞讯银行** | 瑞士上市银行，FINMA 监管 | 秒级实时 | 国内外均可 |
| 2 | metals.live | 独立贵金属数据平台 | 分钟级 | 海外 |
| 3 | Yahoo Finance | 全球上市金融平台 | 15 分钟延迟 | 海外 |
| 4 | goldprice.org | 商业报价网站 | 分钟级 | 不稳定 |

**汇率数据源**：Frankfurter (欧洲央行) → ExchangeRate-API → 硬编码 7.25 降级

---

## 🚀 快速开始（3 步部署）

### 第 1 步：Fork 仓库

点击右上角 **Fork** 按钮，将仓库复制到你的 GitHub 账号下。

### 第 2 步：配置参数

进入你 Fork 后的仓库：**Settings** → **Secrets and variables** → **Actions**

#### Secrets（敏感信息，加密存储，配置后不可查看）

| 名称 | 说明 | 如何获取 |
|------|------|----------|
| `RESEND_API_KEY` | 邮件发送 API Key（必填） | 在 [resend.com](https://resend.com) 免费注册，进入 API Keys 页面创建 |

#### Repository Variables（普通配置，可查看和修改）

| 名称 | 说明 | 默认值 | 是否必填 |
|------|------|--------|----------|
| `GOLD_GRAMS` | 你持有的黄金克数 | `0` | 推荐填写 |
| `INVESTED_AMOUNT` | 你投入的总金额（元） | `0` | 推荐填写 |
| `DAILY_ALERT_PCT` | 日波动提醒阈值（%） | `1.5` | 可选 |
| `WEEKLY_ALERT_PCT` | 周波动提醒阈值（%） | `3.0` | 可选 |
| `REPORT_SLOTS` | 每日推送时间（北京时间，JSON 数组） | `["07:30","13:00","18:00"]` | 可选 |
| `SENDER_NAME` | 邮件发件人名称 | `黄金智能监控` | 可选 |
| `FROM_EMAIL` | 发件邮箱地址 | `onboarding@resend.dev` | 可选 |

> 💡 所有 Variables 都有默认值，只填你想修改的即可。不设置 `GOLD_GRAMS` 和 `INVESTED_AMOUNT` 则邮件不显示持仓信息。

### 第 3 步：配置收件人

编辑仓库中的 `recipients.json` 文件：

```json
{
  "_说明": "personal: 完整报告(含持仓盈亏); general: 仅行情报告(不含持仓)",
  "personal": ["你的邮箱@qq.com"],
  "general": ["朋友的邮箱@qq.com"]
}
```

- **personal**：收到完整报告（含你的持仓克数、市值、浮动盈亏）
- **general**：只收到行情报告（金价、涨跌分析、新闻、事件日历，不含持仓数据）

> ⚠️ 使用 Resend 免费版时，收件人邮箱需要在 [Resend 后台](https://resend.com) 添加并验证后才能接收邮件。免费版每月 3000 封，每天 100 封。

---

## 📧 邮件报告内容

每封报告邮件包含以下模块：

| 模块 | 说明 | personal | general |
|------|------|----------|---------|
| 📈 实时金价 | 当前人民币克价 + 国际盎司价 + 汇率 | ✅ | ✅ |
| 📊 涨跌对比 | 日涨跌 / 周涨跌（对比前日和上周五收盘） | ✅ | ✅ |
| 💰 持仓盈亏 | 持仓重量、当前市值、浮动盈亏 | ✅ | ❌ |
| 🔍 涨跌分析 | 可能推动金价涨跌的因素 | ✅ | ✅ |
| 📰 市场新闻 | 最新黄金相关中文新闻 5 条 | ✅ | ✅ |
| 📅 事件日历 | 未来 30 天影响金价的重大事件 + 概率评估 | ✅ | ✅ |
| 📋 综合研判 | 未来走势分析总结 | ✅ | ✅ |

---

## 🚨 波动预警机制

当金价波动超过阈值时，系统自动发送即时预警邮件。

### 阶梯式冷却（防止邮件刷屏）

同一方向的波动，只有**跨越更高的阈值档位**才会再次通知：

**日波动阈值档位**：1.5% → 3% → 5% → 8%

```
金价涨 2%  → 跨越 1.5% 档 → 发送预警 ✅
金价涨 2.5% → 仍在 1.5% 档 → 不重复发送 ❌
金价涨 4%  → 跨越 3% 档   → 再次发送 ✅
第二天     → 所有档位重置
```

**周波动阈值档位**：3% → 5% → 8% → 12%

---

## ⏰ 定时推送说明

系统通过 GitHub Actions 自动运行，默认覆盖北京时间 07:07 ~ 23:52，每 15 分钟检测一次。

**推荐方案**：使用外部定时服务（如 [cron-job.org](https://cron-job.org)）精确触发，避免 GitHub Actions 的 cron 延迟问题。

详细配置方法请参考 [SETUP_CRON.md](SETUP_CRON.md)。

---

## 🌐 Web 前端（可选）

项目包含一个 Next.js 网页前端，功能包括：

- **首页**：实时展示当前金价（每分钟自动刷新）
- **订阅页**：填写邮箱订阅金价报告
- **测试报告**：即时发送一封测试金价邮件到你的邮箱
- **部署教程**：交互式分步部署指南

### 本地运行

```bash
cd web
npm install
# 在 web/.env.local 中配置 RESEND_API_KEY（测试报告功能需要）
npm run dev
```

### 部署到 Vercel

1. 在 [Vercel](https://vercel.com) 导入 GitHub 仓库
2. 设置 Root Directory 为 `web`
3. 在 Vercel 项目设置中添加环境变量 `RESEND_API_KEY`

### API 接口

| 路径 | 方法 | 说明 |
|------|------|------|
| `/api/price` | GET | 获取实时金价（带 60 秒缓存） |
| `/api/test-report` | POST | 发送测试金价报告到指定邮箱（有速率限制） |
| `/api/subscribe` | POST | 提交订阅请求（创建 GitHub Issue） |

---

## 🔧 高级配置

### 手动触发报告

在 GitHub 仓库页面：**Actions** → **Gold Price Alert** → **Run workflow** → 勾选 "强制发送报告" → **Run workflow**

### 自定义推送时间

修改 `REPORT_SLOTS` 变量，格式为 JSON 数组：

```json
["08:00", "12:00", "20:00"]
```

### 调整波动阈值

- `DAILY_ALERT_PCT`: 日涨跌幅超过此百分比时触发第一档预警（默认 1.5）
- `WEEKLY_ALERT_PCT`: 周涨跌幅超过此百分比时触发第一档预警（默认 3.0）

### 夜间监控

默认 cron 不覆盖北京时间 23:52~07:07。如需 24 小时监控，可在 `.github/workflows/gold_alert.yml` 中增加 UTC 16~22 的 cron 规则。

---

## 📋 项目结构

```
gold-monitor_gh/
├── gold_monitor.py              # 主程序（金价获取、分析、邮件发送）
├── recipients.json              # 收件人配置（personal/general 分组）
├── state.json                   # 运行状态（自动更新，勿手动修改）
├── SETUP_CRON.md                # 外部定时服务配置指南
├── .github/workflows/
│   └── gold_alert.yml           # GitHub Actions 工作流
└── web/                         # Next.js 前端网站
    ├── src/app/
    │   ├── page.tsx             # 首页（含实时金价展示）
    │   ├── subscribe/page.tsx   # 订阅页
    │   ├── deploy/page.tsx      # 部署教程页
    │   ├── components/
    │   │   └── LivePrice.tsx    # 实时金价组件
    │   ├── lib/
    │   │   └── gold-price.ts   # 金价获取共享模块
    │   └── api/
    │       ├── price/route.ts   # 金价 API
    │       ├── test-report/route.ts  # 测试报告 API
    │       └── subscribe/route.ts    # 订阅 API
    └── .env.local               # 本地环境变量（不提交到 Git）
```

---

## ❓ 常见问题

<details>
<summary><strong>Q: 收不到邮件怎么办？</strong></summary>

1. 确认 `RESEND_API_KEY` 已正确配置到 Secrets
2. 确认收件人邮箱已在 Resend 后台验证（免费版要求）
3. 检查垃圾邮件文件夹
4. 查看 Actions 运行日志是否有错误
5. 尝试在网页端发送测试报告，确认邮件通道是否正常
</details>

<details>
<summary><strong>Q: 金价获取失败怎么办？</strong></summary>

系统有 4 个数据源自动切换。如果所有数据源都失败：
1. 检查 Actions 日志中哪个数据源报错
2. 首选数据源 Swissquote 在国内外均可访问，一般不会失败
3. 如果网络限制导致全部失败，系统会跳过本次发送，下次重试
</details>

<details>
<summary><strong>Q: 不想填持仓信息可以吗？</strong></summary>

可以。不设置 `GOLD_GRAMS` 和 `INVESTED_AMOUNT`（或设为 0），邮件中就不会显示持仓盈亏部分。
</details>

<details>
<summary><strong>Q: 邮件推送时间不准怎么办？</strong></summary>

GitHub Actions 的定时任务有 15-30 分钟延迟，这是平台限制。建议配置外部定时服务精确触发，详见 [SETUP_CRON.md](SETUP_CRON.md)。
</details>

<details>
<summary><strong>Q: 免费额度够用吗？</strong></summary>

- **GitHub Actions**：公共仓库免费无限制，私有仓库每月 2000 分钟。本项目每次运行约 30 秒
- **Resend 邮件**：免费版每月 3000 封，每天 100 封。每日 3 次报告 + 偶尔波动预警完全够用
</details>

<details>
<summary><strong>Q: 波动预警一天会发多少封？</strong></summary>

改进后使用阶梯式冷却机制，同一方向最多发 4 封（对应 4 个阈值档位）。正常情况下一天 0-2 封预警。不会出现反复刷屏的情况。
</details>

<details>
<summary><strong>Q: 如何停止推送？</strong></summary>

进入仓库 Actions 页面，点击工作流右上角 "..." → **Disable workflow** 即可暂停。
</details>

<details>
<summary><strong>Q: personal 和 general 收件人有什么区别？</strong></summary>

- **personal**：收到完整报告，包含你配置的持仓克数、当前市值、浮动盈亏等个人投资数据
- **general**：收到行情报告，只有金价、涨跌分析、新闻、事件日历，不暴露你的持仓信息

适合场景：自己的邮箱放 personal，分享给朋友看行情放 general。
</details>

---

## 📄 License

MIT License - 自由使用、修改、分发。
