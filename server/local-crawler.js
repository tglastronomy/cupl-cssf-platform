#!/usr/bin/env node
/**
 * 本地爬虫 — 在你的电脑（国内网络）上运行
 * 从百度/搜狗搜索小红书相关内容，上传到 Render 后端
 *
 * 用法: cd server && node local-crawler.js
 */
import axios from 'axios'
import * as cheerio from 'cheerio'

const BACKEND = 'https://cupl-cssf-api.onrender.com'

const SEARCH_TERMS = [
  '小红书 法大考研 刑法 经验',
  '小红书 中国政法大学 考研 上岸',
  '小红书 法大 刑事诉讼法 备考',
  '小红书 法大 研究生 日常',
  '小红书 法大 校园生活',
  '小红书 法大 复试 面试',
  '小红书 法大 参考书',
  '小红书 法大 导师',
  '小红书 法大 昌平校区',
  '小红书 法大 考研 真题',
  '小红书 法大 读研 体验',
  '小红书 法大 宿舍 食堂',
  '小红书 法大 就业',
  '小红书 法大 奖学金',
  '小红书 法大 法学 备考',
  '小红书 法大 刑法学 笔记',
  '小红书 法大 708',
  '小红书 法大 808',
  '小红书 法大 811',
  '小红书 法大 罗翔',
  '小红书 法大 曲新久',
  '小红书 法大考研 分数线',
  '小红书 法大 调剂',
  '小红书 中国政法大学 研究生',
  '小红书 法大 校友',
  '小红书 法大 毕业去向',
  '小红书 法大考研 政治 英语',
  '小红书 法大 在读 感受',
  '小红书 法大 刑法 总论 分论',
  '小红书 法大 证据法',
]

async function searchBaidu(keyword) {
  // axios and cheerio imported at top
  const results = []
  try {
    const res = await axios.get('https://www.baidu.com/s', {
      params: { wd: keyword, rn: 50 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'zh-CN,zh;q=0.9',
      },
      timeout: 15000,
    })
    const $ = cheerio.load(res.data)
    $('div.result, div.c-container').each((_, el) => {
      const title = $(el).find('h3 a').text().trim()
      const href = $(el).find('h3 a').attr('href')
      const snippet = $(el).find('.c-abstract, .content-right_2s-H4, .c-span-last').text().trim()
      if (title && title.length > 5 && (title.includes('小红书') || snippet.includes('小红书') || keyword.includes('小红书'))) {
        results.push({
          platform: 'xiaohongshu',
          title: title.replace(/[-_].*小红书.*$/, '').replace(/小红书$/, '').trim() || title,
          summary: snippet.substring(0, 300),
          full_content: snippet,
          images: [],
          author: '小红书用户',
          url: href || '#',
          tags: ['小红书', '法大考研'],
          likes: 0,
          comments: 0,
          category: categorize(title + ' ' + snippet),
        })
      }
    })
  } catch (e) {
    console.log(`  ✗ 搜索失败: ${keyword} (${e.message})`)
  }
  return results
}

async function searchSogou(keyword) {
  const results = []
  try {
    const res = await axios.get('https://www.sogou.com/web', {
      params: { query: keyword, num: 50 },
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'Accept-Language': 'zh-CN' },
      timeout: 15000,
    })
    const $ = cheerio.load(res.data)
    $('div.vrwrap, div.rb, div.results .result').each((_, el) => {
      const title = $(el).find('h3 a, a.title').text().trim()
      const href = $(el).find('h3 a, a.title').attr('href')
      const snippet = $(el).find('.str_info, .ft, .space-txt').text().trim()
      if (title && title.length > 5 && (title.includes('小红书') || snippet.includes('小红书'))) {
        results.push({
          platform: 'xiaohongshu',
          title: title.replace(/[-_].*小红书.*$/, '').trim() || title,
          summary: snippet.substring(0, 300),
          full_content: snippet,
          images: [], author: '小红书用户',
          url: href || '#',
          tags: ['小红书', '法大考研'],
          likes: 0, comments: 0,
          category: categorize(title + ' ' + snippet),
        })
      }
    })
  } catch (e) { /* silent */ }
  return results
}

function categorize(text) {
  if (['经验', '上岸', '备考', '心得', '一战'].some(k => text.includes(k))) return 'experience'
  if (['招生', '简章', '政策', '通知', '公告'].some(k => text.includes(k))) return 'policy'
  if (['参考书', '教材', '真题', '知识点', '背诵'].some(k => text.includes(k))) return 'review'
  if (['复试', '面试', '调剂', '录取'].some(k => text.includes(k))) return 'retest'
  if (['校园', '宿舍', '食堂', '奖学金', '日常', '就业'].some(k => text.includes(k))) return 'life'
  if (['导师', '教授', '研究方向'].some(k => text.includes(k))) return 'advisor'
  return 'general'
}

async function uploadToBackend(articles) {
  // axios imported at top
  try {
    const res = await axios.post(`${BACKEND}/api/upload-articles`, { articles }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
    })
    return res.data
  } catch (e) {
    console.log(`  ✗ 上传失败: ${e.message}`)
    return null
  }
}

async function main() {
  console.log('')
  console.log('  ===== 法大刑司考研 · 小红书本地爬虫 =====')
  console.log('  百度+搜狗双引擎并发 → 上传到云端后端')
  console.log('  ==========================================')
  console.log('')

  let allArticles = []

  // 百度+搜狗双引擎并发，每5个词一批
  for (let i = 0; i < SEARCH_TERMS.length; i += 5) {
    const chunk = SEARCH_TERMS.slice(i, i + 5)
    console.log(`[${Math.floor(i/5)+1}/${Math.ceil(SEARCH_TERMS.length/5)}] 搜索: ${chunk[0].substring(4)}...`)

    // 百度和搜狗同时搜索
    const results = await Promise.all([
      ...chunk.map(term => searchBaidu(term)),
      ...chunk.map(term => searchSogou(term)),
    ])
    const batch = results.flat()
    allArticles.push(...batch)
    console.log(`  ✓ 本批找到 ${batch.length} 条内容`)

    // 每批之间间隔500ms
    await new Promise(r => setTimeout(r, 500))
  }

  // 去重（按标题）
  const seen = new Set()
  const unique = allArticles.filter(a => {
    if (seen.has(a.title)) return false
    seen.add(a.title)
    return true
  })

  console.log(`\n📊 总计: ${allArticles.length} 条 → 去重后: ${unique.length} 条\n`)

  if (unique.length === 0) {
    console.log('❌ 未搜索到任何内容，请检查网络连接')
    return
  }

  // 分批上传（每批50条）
  console.log('📤 正在上传到后端...')
  let totalAdded = 0
  for (let i = 0; i < unique.length; i += 50) {
    const batch = unique.slice(i, i + 50)
    const result = await uploadToBackend(batch)
    if (result) {
      totalAdded += result.added
      console.log(`  ✓ 上传 ${batch.length} 条，新增 ${result.added} 条`)
    }
  }

  console.log(`\n✅ 完成！共上传 ${unique.length} 条，新增 ${totalAdded} 条到后端数据库`)
  console.log('📱 刷新手机页面即可看到最新小红书内容\n')
}

main().catch(e => console.error('Error:', e.message))
