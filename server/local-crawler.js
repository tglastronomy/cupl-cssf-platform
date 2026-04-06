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
  '法大考研 刑法', '中国政法大学 考研 上岸', '法大 刑事诉讼法',
  '法大 研究生 日常', '法大 校园', '法大 复试 面试',
  '法大 参考书', '法大 导师', '法大 昌平校区', '法大 真题',
  '法大 读研', '法大 宿舍 食堂', '法大 就业', '法大 奖学金',
  '法大 备考', '法大 刑法学 笔记', '法大 708', '法大 808',
  '法大 罗翔', '法大 曲新久', '法大 分数线', '法大 调剂',
  '中国政法大学 研究生', '法大 校友', '法大 毕业', '法大 证据法',
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

function makeArticle(title, snippet, url) {
  return {
    platform: 'xiaohongshu',
    title: title.substring(0, 100),
    summary: snippet.substring(0, 300),
    full_content: snippet,
    images: [],
    author: '小红书用户',
    url: url || '#',
    tags: ['小红书', '法大考研'],
    likes: 0, comments: 0,
    category: categorize(title + ' ' + snippet),
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

  console.log(`\nTotal: ${all.length} -> deduplicated: ${unique.length}\n`)

  if (unique.length === 0) {
    console.log('No results found.')
    return
  }

  // 上传
  let added = 0
  for (let i = 0; i < unique.length; i += 50) {
    const batch = unique.slice(i, i + 50)
    const r = await upload(batch)
    if (r) { added += r.added; console.log(`  uploaded ${batch.length}, new: ${r.added}`) }
  }

  console.log(`\nDone! ${added} new articles uploaded.\n`)
}

main().catch(e => console.error(e.message))
