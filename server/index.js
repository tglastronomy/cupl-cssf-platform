import express from 'express'
import cors from 'cors'
import initSqlJs from 'sql.js'
import fs from 'fs'
import cron from 'node-cron'
import { crawlAll, crawlPlatform } from './crawlers/index.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = 3001
const DB_PATH = path.join(__dirname, 'data.db')

const SQL = await initSqlJs()
// 每次启动清空旧数据库，确保schema最新
const db = new SQL.Database()

// 升级后的 schema：增加 full_content 和 images 字段
db.run(`
  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform TEXT NOT NULL,
    title TEXT NOT NULL,
    summary TEXT,
    full_content TEXT,
    images TEXT,
    author TEXT,
    author_avatar TEXT,
    url TEXT UNIQUE,
    tags TEXT,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    published_at TEXT,
    crawled_at TEXT DEFAULT (datetime('now')),
    category TEXT DEFAULT 'general'
  )
`)
db.run(`
  CREATE TABLE IF NOT EXISTS crawl_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform TEXT NOT NULL,
    status TEXT NOT NULL,
    count INTEGER DEFAULT 0,
    message TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )
`)
db.run('CREATE INDEX IF NOT EXISTS idx_platform ON articles(platform)')
db.run('CREATE INDEX IF NOT EXISTS idx_crawled ON articles(crawled_at DESC)')
db.run('CREATE INDEX IF NOT EXISTS idx_category ON articles(category)')
saveDb()

function saveDb() {
  fs.writeFileSync(DB_PATH, Buffer.from(db.export()))
}

function queryAll(sql, params = []) {
  const stmt = db.prepare(sql)
  stmt.bind(params)
  const rows = []
  while (stmt.step()) rows.push(stmt.getAsObject())
  stmt.free()
  return rows
}

function queryOne(sql, params = []) {
  return queryAll(sql, params)[0] || null
}

setInterval(saveDb, 30000)

app.use(cors())
app.use(express.json())

// API: 文章列表（含完整内容）
app.get('/api/articles', (req, res) => {
  const { platform, category, page = 1, limit = 100, search } = req.query
  const offset = (page - 1) * limit
  let where = '1=1'
  const params = []

  if (platform && platform !== 'all') { where += ' AND platform = ?'; params.push(platform) }
  if (category && category !== 'all') { where += ' AND category = ?'; params.push(category) }
  if (search) {
    where += ' AND (title LIKE ? OR summary LIKE ? OR full_content LIKE ?)'
    params.push(`%${search}%`, `%${search}%`, `%${search}%`)
  }

  const total = queryOne(`SELECT COUNT(*) as total FROM articles WHERE ${where}`, params)?.total || 0
  const articles = queryAll(
    `SELECT * FROM articles WHERE ${where} ORDER BY crawled_at DESC LIMIT ? OFFSET ?`,
    [...params, Number(limit), Number(offset)]
  )

  res.json({
    articles: articles.map(a => ({
      ...a,
      tags: a.tags ? JSON.parse(a.tags) : [],
      images: a.images ? JSON.parse(a.images) : [],
    })),
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit)
  })
})

// API: 单篇文章详情
app.get('/api/articles/:id', (req, res) => {
  const article = queryOne('SELECT * FROM articles WHERE id = ?', [Number(req.params.id)])
  if (!article) return res.status(404).json({ error: 'Not found' })
  res.json({
    ...article,
    tags: article.tags ? JSON.parse(article.tags) : [],
    images: article.images ? JSON.parse(article.images) : [],
  })
})

// API: 平台统计
app.get('/api/stats', (req, res) => {
  res.json({
    platforms: queryAll('SELECT platform, COUNT(*) as count FROM articles GROUP BY platform'),
    total: queryOne('SELECT COUNT(*) as count FROM articles')?.count || 0,
    lastCrawl: queryOne('SELECT created_at FROM crawl_logs ORDER BY created_at DESC LIMIT 1')?.created_at || null,
    status: 'running'
  })
})

// API: 触发抓取
app.post('/api/crawl', async (req, res) => {
  const { platform } = req.body
  try {
    const result = platform ? await crawlPlatform(db, platform) : await crawlAll(db)
    saveDb()
    res.json({ success: true, ...result })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// 定时任务
cron.schedule('*/30 * * * *', async () => {
  console.log(`[${new Date().toISOString()}] Full crawl...`)
  try { await crawlAll(db); saveDb() } catch (e) { console.error(e.message) }
})
cron.schedule('*/5 * * * *', async () => {
  console.log(`[${new Date().toISOString()}] Hot crawl...`)
  try {
    await crawlPlatform(db, 'xiaohongshu')
    await crawlPlatform(db, 'zhihu')
    saveDb()
  } catch (e) { console.error(e.message) }
})

app.listen(PORT, async () => {
  console.log(`\n  ===== 法大刑司考研谍报系统 =====`)
  console.log(`  http://localhost:${PORT}`)
  console.log(`  深度抓取 · 全文收录 · 图片提取`)
  console.log(`  ================================\n`)

  // 启动时立即执行一次全平台爬取
  const articleCount = queryOne('SELECT COUNT(*) as c FROM articles')?.c || 0
  if (articleCount === 0) {
    console.log('  数据库为空，启动首次全量抓取...')
    try {
      await crawlAll(db)
      saveDb()
      const newCount = queryOne('SELECT COUNT(*) as c FROM articles')?.c || 0
      console.log(`  首次抓取完成，共收录 ${newCount} 条内容`)
    } catch (e) {
      console.error('  首次抓取失败:', e.message)
    }
  } else {
    console.log(`  数据库已有 ${articleCount} 条内容`)
  }
})
