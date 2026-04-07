#!/usr/bin/env node
/**
 * 小红书爬虫 — 可在本地或 GitHub Actions 运行
 * 多引擎搜索(Google/Bing/Baidu/DuckDuckGo)小红书内容 → 上传到 Render 后端
 *
 * 用法: cd server && node local-crawler.js
 */
import axios from 'axios'
import * as cheerio from 'cheerio'

const BACKEND = 'https://cupl-cssf-api.onrender.com'
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

const TERMS = [
  // 核心考研
  '法大考研 刑法 经验', '法大考研 上岸 经验贴', '法大考研 刑事诉讼法 备考',
  '法大考研 一战上岸', '法大考研 二战 经验', '法大考研 跨考 非法本',
  '法大考研 初试 高分', '法大考研 复试 面试 真题', '法大考研 调剂',
  '法大考研 分数线 2025', '法大考研 分数线 2026', '法大考研 报录比',
  '法大考研 真题 回忆', '法大考研 参考书 推荐', '法大考研 复习规划',
  '法大考研 政治 英语', '法大考研 背诵 方法', '法大考研 时间安排',
  // 专业课
  '法大 708 法理学 宪法', '法大 808 刑法 民法', '法大 811 刑事诉讼法',
  '法大 刑法学 曲新久', '法大 刑法学 笔记 框架', '法大 刑法总论 分论',
  '法大 刑诉法 陈光中', '法大 证据法 张保生', '法大 法理学 舒国滢',
  '法大 宪法学 焦洪昌', '法大 民法学 李永军',
  // 导师
  '法大 导师 推荐 刑法', '法大 导师 选择 刑诉', '法大 罗翔 考研',
  '法大 曲新久 刑法', '法大 汪海燕 刑诉', '法大 张保生 证据法',
  // 校园生活
  '法大 研究生 日常 生活', '法大 读研 体验 感受', '法大 昌平校区 校园',
  '法大 宿舍 食堂 条件', '法大 奖学金 助学金', '法大 研究生 就业 去向',
  '法大 刑事司法学院 毕业', '法大 法学 硕士 就业率',
  // 招生政策
  '中国政法大学 2027 考研 招生', '法大 招生简章 2026', '法大 推免 保研',
  '法大 刑事司法学院 招生', '中国政法大学 考研 难度 分析',
  '中国政法大学 刑法学 考研', '中国政法大学 刑事诉讼法 考研',
  '中国政法大学 法硕 非法学', '中国政法大学 法学 学硕',
  // 经验细分
  '法大 刑法 名词解释 简答', '法大 刑法 论述题 案例', '法大 刑诉 辩护制度',
  '法大 刑诉 强制措施 证据', '法大 考研 英语一 备考', '法大 考研 肖四肖八',
  // 对比
  '法大 vs 人大 法学 考研', '法大 vs 北大 刑法', '五院四系 考研 刑法',
]

function categorize(text) {
  if (['经验', '上岸', '备考', '心得', '一战'].some(k => text.includes(k))) return 'experience'
  if (['招生', '简章', '政策', '通知'].some(k => text.includes(k))) return 'policy'
  if (['参考书', '教材', '真题', '知识点'].some(k => text.includes(k))) return 'review'
  if (['复试', '面试', '调剂', '录取'].some(k => text.includes(k))) return 'retest'
  if (['校园', '宿舍', '食堂', '日常', '就业'].some(k => text.includes(k))) return 'life'
  if (['导师', '教授', '研究方向'].some(k => text.includes(k))) return 'advisor'
  return 'general'
}

function makeArticle(title, snippet, url, fullContent, images) {
  return {
    platform: 'xiaohongshu',
    title: title.substring(0, 100),
    summary: snippet.substring(0, 300),
    full_content: fullContent || snippet,
    images: images || [],
    author: '小红书用户',
    url: url || '#',
    tags: ['小红书', '法大考研'],
    likes: 0, comments: 0,
    category: categorize(title + ' ' + snippet),
  }
}

// ===== 深度抓取页面全文+图片 =====
async function deepScrape(url) {
  if (!url || url === '#' || url.length < 10) return { text: '', images: [] }
  try {
    const res = await axios.get(url, {
      headers: { 'User-Agent': UA, 'Accept': 'text/html' },
      timeout: 8000,
      maxRedirects: 3,
    })
    const $ = cheerio.load(res.data)
    $('script, style, nav, header, footer').remove()
    const text = $('article, .content, main, .detail, .note-content, body')
      .first().text().replace(/\s+/g, ' ').trim().substring(0, 5000)
    const images = []
    $('img').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-original')
      if (src && !src.includes('avatar') && !src.includes('icon') && !src.includes('logo')
          && !src.includes('emoji') && src.length > 20) {
        const full = src.startsWith('//') ? `https:${src}` : src
        if (full.startsWith('http') && !images.includes(full)) images.push(full)
      }
    })
    return { text, images: images.slice(0, 9) }
  } catch (e) {
    return { text: '', images: [] }
  }
}

// ===== 搜索引擎 =====

async function searchGoogle(keyword) {
  const results = []
  try {
    const res = await axios.get('https://www.google.com/search', {
      params: { q: `小红书 ${keyword}`, num: 30 },
      headers: { 'User-Agent': UA, 'Accept-Language': 'zh-CN,zh;q=0.9' },
      timeout: 10000,
    })
    const $ = cheerio.load(res.data)
    $('div.g, div[data-hveid]').each((_, el) => {
      const title = $(el).find('h3').text().trim()
      const snippet = $(el).find('.VwiC3b, .IsZvec').text().trim()
      const href = $(el).find('a').first().attr('href')
      if (title && title.length > 5) results.push(makeArticle(title, snippet, href))
    })
  } catch (e) { /* silent */ }
  return results
}

async function searchBing(keyword) {
  const results = []
  try {
    const res = await axios.get('https://www.bing.com/search', {
      params: { q: `小红书 ${keyword}`, count: 30 },
      headers: { 'User-Agent': UA },
      timeout: 10000,
    })
    const $ = cheerio.load(res.data)
    $('li.b_algo').each((_, el) => {
      const title = $(el).find('h2 a').text().trim()
      const snippet = $(el).find('.b_caption p').text().trim()
      const href = $(el).find('h2 a').attr('href')
      if (title && title.length > 5) results.push(makeArticle(title, snippet, href))
    })
  } catch (e) { /* silent */ }
  return results
}

async function searchDuckDuckGo(keyword) {
  const results = []
  try {
    const res = await axios.get('https://html.duckduckgo.com/html/', {
      params: { q: `小红书 ${keyword}` },
      headers: { 'User-Agent': UA },
      timeout: 10000,
    })
    const $ = cheerio.load(res.data)
    $('div.result, div.web-result').each((_, el) => {
      const title = $(el).find('a.result__a, h2 a').text().trim()
      const snippet = $(el).find('a.result__snippet, .result__body').text().trim()
      const href = $(el).find('a.result__a, h2 a').attr('href')
      if (title && title.length > 5) results.push(makeArticle(title, snippet, href))
    })
  } catch (e) { /* silent */ }
  return results
}

async function searchBaidu(keyword) {
  const results = []
  try {
    const res = await axios.get('https://www.baidu.com/s', {
      params: { wd: `小红书 ${keyword}`, rn: 50 },
      headers: { 'User-Agent': UA, 'Accept-Language': 'zh-CN' },
      timeout: 10000,
    })
    const $ = cheerio.load(res.data)
    $('div.result, div.c-container').each((_, el) => {
      const title = $(el).find('h3 a').text().trim()
      const snippet = $(el).find('.c-abstract, .content-right_2s-H4').text().trim()
      const href = $(el).find('h3 a').attr('href')
      if (title && title.length > 5) results.push(makeArticle(title, snippet, href))
    })
  } catch (e) { /* silent */ }
  return results
}

async function searchSogou(keyword) {
  const results = []
  try {
    const res = await axios.get('https://www.sogou.com/web', {
      params: { query: `小红书 ${keyword}`, num: 30 },
      headers: { 'User-Agent': UA },
      timeout: 10000,
    })
    const $ = cheerio.load(res.data)
    $('div.vrwrap, div.rb').each((_, el) => {
      const title = $(el).find('h3 a').text().trim()
      const snippet = $(el).find('.str_info, .ft').text().trim()
      const href = $(el).find('h3 a').attr('href')
      if (title && title.length > 5) results.push(makeArticle(title, snippet, href))
    })
  } catch (e) { /* silent */ }
  return results
}

// ===== 上传 =====

async function upload(articles) {
  try {
    const res = await axios.post(`${BACKEND}/api/upload-articles`, { articles }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
    })
    return res.data
  } catch (e) {
    console.log(`  x upload failed: ${e.message}`)
    return null
  }
}

// ===== 主函数 =====

async function main() {
  console.log('\n  ===== XHS Crawler (5 engines) =====\n')

  let all = []

  for (let i = 0; i < TERMS.length; i += 5) {
    const chunk = TERMS.slice(i, i + 5)
    console.log(`[${Math.floor(i/5)+1}/${Math.ceil(TERMS.length/5)}] ${chunk[0]}...`)

    // 5个搜索引擎全并发
    const jobs = chunk.flatMap(term => [
      searchGoogle(term),
      searchBing(term),
      searchDuckDuckGo(term),
      searchBaidu(term),
      searchSogou(term),
    ])
    const results = await Promise.all(jobs)
    const batch = results.flat()
    all.push(...batch)
    console.log(`  found ${batch.length}`)
    await new Promise(r => setTimeout(r, 300))
  }

  // 去重
  const seen = new Set()
  const unique = all.filter(a => {
    const key = a.title.substring(0, 30)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  console.log(`\nTotal: ${all.length} -> deduplicated: ${unique.length}`)

  if (unique.length === 0) {
    console.log('No results found.')
    return
  }

  // 深度抓取每个URL获取全文+图片（10个并发）
  console.log(`\nDeep scraping ${unique.length} pages for full content + images...`)
  for (let i = 0; i < unique.length; i += 10) {
    const batch = unique.slice(i, i + 10)
    const scraped = await Promise.all(batch.map(a => deepScrape(a.url)))
    scraped.forEach((s, j) => {
      if (s.text && s.text.length > batch[j].full_content.length) {
        batch[j].full_content = s.text
        batch[j].summary = s.text.substring(0, 300)
      }
      if (s.images.length > 0) batch[j].images = s.images
    })
    const withContent = batch.filter(a => a.full_content.length > 100).length
    const withImages = batch.filter(a => a.images.length > 0).length
    console.log(`  [${Math.min(i+10, unique.length)}/${unique.length}] content: ${withContent}, images: ${withImages}`)
  }

  // === 严格过滤 ===
  // 1) 必须有实质内容（full_content > 50字符）
  // 2) 必须和法大考研相关（标题或内容包含关键词）
  const RELEVANT_KW = ['法大', '政法大学', 'CUPL', '刑法', '刑诉', '考研', '法学', '法硕',
    '复试', '初试', '分数线', '报录比', '参考书', '导师', '上岸', '备考',
    '曲新久', '罗翔', '汪海燕', '张保生', '708', '808', '811']

  const qualified = unique.filter(a => {
    // 有实质内容
    if (a.full_content.length < 50 && a.summary.length < 50) return false
    // 和考研相关
    const text = a.title + ' ' + a.full_content
    return RELEVANT_KW.some(k => text.includes(k))
  })

  // 过滤掉无效图片URL（太短或明显不是图片的）
  qualified.forEach(a => {
    a.images = (a.images || []).filter(url =>
      url.startsWith('http') && url.length > 30 &&
      (url.includes('.jpg') || url.includes('.png') || url.includes('.jpeg') ||
       url.includes('.webp') || url.includes('image') || url.includes('pic') ||
       url.includes('img') || url.includes('photo') || url.includes('cdn'))
    )
  })

  const richCount = qualified.filter(a => a.full_content.length > 200).length
  const imgCount = qualified.filter(a => a.images.length > 0).length
  console.log(`\nAfter filter: ${qualified.length} relevant (${richCount} rich, ${imgCount} with images)\n`)
  console.log(`Removed: ${unique.length - qualified.length} irrelevant or empty\n`)

  if (qualified.length === 0) {
    console.log('No qualified articles to upload.')
    return
  }

  // 上传
  let added = 0
  for (let i = 0; i < qualified.length; i += 50) {
    const batch = qualified.slice(i, i + 50)
    const r = await upload(batch)
    if (r) { added += r.added; console.log(`  uploaded ${batch.length}, new: ${r.added}`) }
  }

  console.log(`\nDone! ${added} new articles uploaded.\n`)
}

main().catch(e => console.error(e.message))
