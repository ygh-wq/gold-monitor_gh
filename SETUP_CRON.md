# 外部定时服务配置指南

解决 GitHub Actions cron 延迟问题，使用 cron-job.org 精确触发 workflow_dispatch。

## 第一步：创建 GitHub Personal Access Token (PAT)

1. 打开 https://github.com/settings/tokens?type=beta （Fine-grained tokens）
2. 点击 **Generate new token**
3. 配置：
   - Token name: `gold-monitor-cron`
   - Expiration: 选择 1 年（到期需续签）
   - Repository access: **Only select repositories** → 选择 `gold-monitor_gh`
   - Permissions → Repository permissions:
     - **Actions**: Read and Write
     - **Contents**: Read （用于触发 workflow）
4. 点击 **Generate token**
5. **立即复制保存 token**（只显示一次）

## 第二步：注册 cron-job.org

1. 打开 https://cron-job.org/en/signup/
2. 注册免费账号并验证邮箱

## 第三步：创建 3 个定时任务

在 cron-job.org 中创建以下 3 个 Cron Job：

### 任务 1：早报 (北京时间 07:30)

| 设置项 | 值 |
|--------|-----|
| Title | Gold Monitor 07:30 |
| URL | `https://api.github.com/repos/ygh-wq/gold-monitor_gh/actions/workflows/gold_alert.yml/dispatches` |
| Schedule | Custom: **Minute=30, Hour=7, Day=\*, Month=\*, Weekday=\*** |
| Timezone | Asia/Shanghai |
| Request Method | POST |
| Request Headers | 见下方 |
| Request Body | 见下方 |

### 任务 2：午报 (北京时间 13:00)

| 设置项 | 值 |
|--------|-----|
| Title | Gold Monitor 13:00 |
| URL | `https://api.github.com/repos/ygh-wq/gold-monitor_gh/actions/workflows/gold_alert.yml/dispatches` |
| Schedule | Custom: **Minute=0, Hour=13, Day=\*, Month=\*, Weekday=\*** |
| Timezone | Asia/Shanghai |
| Request Method | POST |
| Request Headers | 见下方 |
| Request Body | 见下方 |

### 任务 3：晚报 (北京时间 18:00)

| 设置项 | 值 |
|--------|-----|
| Title | Gold Monitor 18:00 |
| URL | `https://api.github.com/repos/ygh-wq/gold-monitor_gh/actions/workflows/gold_alert.yml/dispatches` |
| Schedule | Custom: **Minute=0, Hour=18, Day=\*, Month=\*, Weekday=\*** |
| Timezone | Asia/Shanghai |
| Request Method | POST |
| Request Headers | 见下方 |
| Request Body | 见下方 |

### 通用 Headers（3 个任务相同）

```
Authorization: Bearer ghp_你的TOKEN放这里
Accept: application/vnd.github+json
Content-Type: application/json
X-GitHub-Api-Version: 2022-11-28
```

### 通用 Request Body（3 个任务相同）

```json
{"ref": "main"}
```

## 第四步：测试

1. 在 cron-job.org 任意一个任务点击 **Run Now** / **Test Run**
2. 如果返回 HTTP **204 No Content** → 配置成功
3. 前往 https://github.com/ygh-wq/gold-monitor_gh/actions 确认有新的 workflow run

## 验证成功的标志

- cron-job.org 显示 Response Code: **204**
- GitHub Actions 页面出现新的运行记录，触发方式显示为 `workflow_dispatch`

## 注意事项

- PAT 到期需要重新生成并更新到 cron-job.org
- cron-job.org 免费版完全够用（每天只触发 3 次）
- 原有的 GitHub Actions schedule 保留作为备份，万一外部服务宕机也不会完全停止
- 如果成功运行外部触发，可考虑未来移除 schedule 触发器以节省 Actions 分钟数
