import axios from 'axios'
import * as cheerio from 'cheerio'

// ============================================================
// 关键词体系
// ============================================================
const CORE_KW = ['中国政法大学', '法大', 'CUPL', '刑事司法学院', '法大考研', '法大刑法', '法大刑诉', '法大研究生']
const PEOPLE_KW = ['曲新久', '罗翔', '汪海燕', '张保生', '赵天红', '郭金霞', '于冲', '陈光中', '陈兴良', '舒国滢', '焦洪昌', '李永军']
const CAMPUS_KW = ['昌平校区', '法大校园', '法大生活', '法大宿舍', '法大食堂', '军都山', '法大图书馆']

function isRelevant(text) {
  if (CORE_KW.some(k => text.includes(k))) return true
  if (PEOPLE_KW.some(k => text.includes(k))) return true
  if (CAMPUS_KW.some(k => text.includes(k))) return true
  if (text.includes('政法') && ['考研', '刑法', '刑诉', '研究生', '法学'].some(k => text.includes(k))) return true
  return false
}

const CATS = {
  experience: ['经验', '上岸', '备考', '心得', '一战', '二战', '跨考', '高分'],
  policy: ['招生', '简章', '目录', '政策', '通知', '公告', '报名'],
  review: ['参考书', '教材', '笔记', '真题', '知识点', '框架', '背诵'],
  retest: ['复试', '面试', '调剂', '拟录取', '录取'],
  life: ['校园', '宿舍', '食堂', '奖学金', '日常', '就业', '毕业', 'vlog'],
  advisor: ['导师', '教授', '研究方向', '选导师', '组会'],
}

function categorize(text) {
  for (const [cat, kws] of Object.entries(CATS)) {
    if (kws.some(k => text.includes(k))) return cat
  }
  return 'general'
}

function insertArticle(db, a) {
  try {
    db.run(
      `INSERT OR IGNORE INTO articles
       (platform, title, summary, full_content, images, author, author_avatar, url, tags, likes, comments, published_at, category)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [a.platform, a.title, a.summary || '', a.full_content || '', JSON.stringify(a.images || []),
       a.author || '匿名', a.author_avatar || '', a.url,
       JSON.stringify(a.tags || []), a.likes || 0, a.comments || 0,
       a.published_at || new Date().toISOString(), categorize(`${a.title} ${a.summary} ${a.full_content}`)]
    )
    return db.getRowsModified() > 0
  } catch (e) { return false }
}

function logCrawl(db, platform, status, count, msg) {
  db.run('INSERT INTO crawl_logs (platform, status, count, message) VALUES (?,?,?,?)', [platform, status, count, msg || ''])
}

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
const MOBILE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15'
const delay = ms => new Promise(r => setTimeout(r, ms))

// ============================================================
// 深度抓取工具：访问具体页面提取全文+图片
// ============================================================

async function deepScrapeUrl(url) {
  try {
    const res = await axios.get(url, {
      headers: { 'User-Agent': UA, 'Accept': 'text/html,application/xhtml+xml' },
      timeout: 15000,
      maxRedirects: 3,
    })
    const $ = cheerio.load(res.data)
    // 提取所有正文文字
    $('script, style, nav, header, footer, .sidebar').remove()
    const text = $('article, .content, .post-content, main, .detail, #content, .note-content, .article-content, body')
      .first().text().replace(/\s+/g, ' ').trim().substring(0, 5000)
    // 提取所有图片
    const images = []
    $('img').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-original')
      if (src && !src.includes('avatar') && !src.includes('icon') && !src.includes('logo')
          && !src.includes('emoji') && (src.startsWith('http') || src.startsWith('//'))) {
        const fullSrc = src.startsWith('//') ? `https:${src}` : src
        if (!images.includes(fullSrc)) images.push(fullSrc)
      }
    })
    return { text: text || '', images: images.slice(0, 9) }
  } catch (e) {
    return { text: '', images: [] }
  }
}

// ============================================================
// 知乎：API搜索 + 深度抓取回答全文
// ============================================================
async function crawlZhihu(db) {
  let n = 0
  const terms = [
    '中国政法大学刑法考研', '法大刑事诉讼法考研', '法大刑事司法学院',
    '中国政法大学考研经验', '法大研究生生活', '法大考研难度',
    '法大刑法学导师', '法大昌平校区', '法大复试', '法大考研参考书',
    '罗翔 法大', '中国政法大学就业', '法大读研体验', '法大奖学金',
  ]
  for (const term of terms) {
    try {
      const res = await axios.get('https://www.zhihu.com/api/v4/search_v3', {
        params: { t: 'general', q: term, correction: 1, offset: 0, limit: 50 },
        headers: { 'User-Agent': UA, 'Accept': 'application/json' },
        timeout: 10000,
      })
      if (res.data?.data) {
        for (const item of res.data.data) {
          if (!item.object) continue
          const obj = item.object
          const title = (obj.title || obj.question?.title || '').replace(/<[^>]+>/g, '')
          if (title.length < 5) continue
          const excerpt = (obj.excerpt || obj.content || '').replace(/<[^>]+>/g, '').substring(0, 500)
          const postUrl = obj.url || `https://www.zhihu.com/question/${obj.question?.id}`

          // 深度抓取：获取回答全文
          let fullContent = excerpt
          let images = []
          if (postUrl.includes('zhihu.com')) {
            const deep = await deepScrapeUrl(postUrl)
            if (deep.text.length > fullContent.length) fullContent = deep.text
            images = deep.images
          }

          const added = insertArticle(db, {
            platform: 'zhihu', title, summary: excerpt.substring(0, 200),
            full_content: fullContent, images,
            author: obj.author?.name || '匿名', author_avatar: obj.author?.avatar_url || '',
            url: postUrl, tags: ['知乎'],
            likes: obj.voteup_count || 0, comments: obj.comment_count || 0,
            published_at: obj.created_time ? new Date(obj.created_time * 1000).toISOString() : null,
          })
          if (added) n++
        }
      }
    } catch (e) { /* silent */ }
    await delay(600)
  }
  logCrawl(db, 'zhihu', 'success', n, `Deep crawl: ${n} articles with full content`)
  return n
}

// ============================================================
// B站：API + 视频详情页抓取简介全文
// ============================================================
async function crawlBilibili(db) {
  let n = 0
  const terms = [
    '法大考研', '中国政法大学考研', '法大刑法', '罗翔刑法',
    '法大研究生', '法大校园vlog', '法大考研经验', '法大复试',
    '中国政法大学生活', '法大刑事诉讼法', '刑法学考研', '法大导师',
    '法大昌平校区', '法大食堂', '法大法学',
  ]
  for (const term of terms) {
    // 翻页抓取，每个词抓2页
    for (let page = 1; page <= 2; page++) {
    try {
      const res = await axios.get('https://api.bilibili.com/x/web-interface/search/type', {
        params: { search_type: 'video', keyword: term, page, page_size: 50 },
        headers: { 'User-Agent': UA, 'Referer': 'https://www.bilibili.com' },
        timeout: 10000,
      })
      if (res.data?.data?.result) {
        for (const v of res.data.data.result) {
          const title = (v.title || '').replace(/<[^>]+>/g, '')
          if (title.length < 5) continue
          const desc = v.description || ''
          const bvid = v.bvid
          const videoUrl = `https://www.bilibili.com/video/${bvid}`
          // B站封面图作为图片
          const cover = v.pic?.startsWith('//') ? `https:${v.pic}` : v.pic
          const added = insertArticle(db, {
            platform: 'bilibili', title, summary: desc.substring(0, 200),
            full_content: desc,
            images: cover ? [cover] : [],
            author: v.author || 'UP主', url: videoUrl,
            tags: v.tag?.split(',').slice(0, 5) || ['B站'],
            likes: v.like || 0, comments: v.review || 0,
            published_at: v.pubdate ? new Date(v.pubdate * 1000).toISOString() : null,
          })
          if (added) n++
        }
      }
    } catch (e) { /* silent */ }
    await delay(400)
    } // end page loop
  }
  logCrawl(db, 'bilibili', 'success', n, `${n} videos with covers`)
  return n
}

// ============================================================
// 小红书：通过API直接获取真实笔记ID
// ============================================================

// 获取小红书 web cookie（访问首页自动获取）
async function getXhsCookie() {
  try {
    const res = await axios.get('https://www.xiaohongshu.com/explore', {
      headers: { 'User-Agent': UA, 'Accept': 'text/html' },
      timeout: 10000,
      maxRedirects: 3,
    })
    const cookies = res.headers['set-cookie']
    if (cookies) return cookies.map(c => c.split(';')[0]).join('; ')
  } catch (e) { /* silent */ }
  return ''
}

// 调用小红书搜索API获取真实笔记
async function searchXhsNotes(keyword, cookie) {
  const results = []
  try {
    const searchId = Math.random().toString(36).substring(2, 20)
    const res = await axios.post('https://edith.xiaohongshu.com/api/sns/web/v1/search/notes', {
      keyword,
      page: 1,
      page_size: 20,
      search_id: searchId,
      sort: 'general',
      note_type: 0,
    }, {
      headers: {
        'User-Agent': UA,
        'Content-Type': 'application/json',
        'Origin': 'https://www.xiaohongshu.com',
        'Referer': 'https://www.xiaohongshu.com/',
        'Cookie': cookie,
      },
      timeout: 10000,
    })
    if (res.data?.data?.items) {
      for (const item of res.data.data.items) {
        const note = item.note_card || item
        if (note.note_id || note.id) {
          results.push({
            noteId: note.note_id || note.id,
            title: note.display_title || note.title || '',
            desc: note.desc || '',
            author: note.user?.nickname || note.user?.nick_name || '小红书用户',
            likes: note.interact_info?.liked_count || note.liked_count || 0,
            images: (note.image_list || note.images_list || []).map(img => img.url_default || img.url || '').filter(Boolean).slice(0, 9),
          })
        }
      }
    }
  } catch (e) {
    // API可能需要签名，尝试失败时静默
    console.log(`  XHS API search "${keyword}": ${e.response?.status || e.message}`)
  }
  return results
}

async function crawlXiaohongshu(db) {
  let n = 0
  const terms = [
    '法大考研', '中国政法大学考研', '法大刑法', '法大刑事诉讼法',
    '法大考研经验', '法大上岸', '法大复试', '法大研究生',
    '法大校园', '法大生活', '法大备考', '法大导师',
    '法大真题', '法大参考书', '法大就业', '法大昌平',
    '法大宿舍', '法大食堂', '法大奖学金', '法大读研',
    '中国政法大学 刑法', '法大考研 复试真题', '法大 研究生 就业',
    '法大 708 法学综合', '法大 808 刑法', '法大 811 刑诉',
    '法大 曲新久', '法大 罗翔', '法大考研 分数线',
    '中国政法大学 校园', '法大 在读 感受',
  ]

  // 通道0 (最优先): 小红书API直接搜索，获取真实笔记ID
  console.log('  [xiaohongshu] 尝试API直接搜索...')
  const cookie = await getXhsCookie()
  for (const term of terms.slice(0, 15)) {
    const notes = await searchXhsNotes(term, cookie)
    for (const note of notes) {
      const added = insertArticle(db, {
        platform: 'xiaohongshu',
        title: note.title || term,
        summary: note.desc?.substring(0, 200) || '',
        full_content: note.desc || '',
        images: note.images,
        author: note.author,
        // 真实的笔记链接！手机上会直接唤起小红书App
        url: `https://www.xiaohongshu.com/explore/${note.noteId}`,
        tags: ['小红书', '考研'],
        likes: note.likes, comments: 0,
      })
      if (added) n++
    }
    if (notes.length > 0) console.log(`    "${term}": ${notes.length} notes`)
    await delay(600)
  }

  // 如果API获取到了足够多的内容，跳过搜索引擎通道
  if (n >= 30) {
    logCrawl(db, 'xiaohongshu', 'success', n, `API direct: ${n} notes with real URLs`)
    return n
  }

  // 通道1: Google 搜索（对小红书索引最好）（API不够时补充）
  for (const term of terms) {
    try {
      const res = await axios.get('https://www.google.com/search', {
        params: { q: `site:xiaohongshu.com ${term}`, num: 50 },
        headers: { 'User-Agent': UA, 'Accept-Language': 'zh-CN,zh;q=0.9' },
        timeout: 12000,
      })
      const $ = cheerio.load(res.data)
      $('div.g, div[data-hveid]').each((_, el) => {
        const a = $(el).find('a[href*="xiaohongshu.com"]').first()
        const href = a.attr('href')
        const title = $(el).find('h3').text().trim() || a.text().trim()
        const snippet = $(el).find('.VwiC3b, .IsZvec, span.aCOpRe').text().trim()
        if (title && href?.includes('xiaohongshu.com')) {
          // 保留真实的小红书帖子URL（含/explore/或/discovery/item/的是真实帖子链接）
          insertArticle(db, {
            platform: 'xiaohongshu', title,
            summary: snippet.substring(0, 300),
            full_content: snippet,
            images: [], author: '小红书用户',
            url: href,
            tags: ['小红书', '考研'], likes: 0, comments: 0,
          })
          n++
        }
      })
    } catch (e) { /* silent */ }
    await delay(500)
  }

  // 通道2: Bing 搜索
  for (const term of terms) {
    try {
      const res = await axios.get('https://www.bing.com/search', {
        params: { q: `site:xiaohongshu.com ${term}`, count: 50 },
        headers: { 'User-Agent': UA },
        timeout: 12000,
      })
      const $ = cheerio.load(res.data)
      $('li.b_algo').each((_, el) => {
        const title = $(el).find('h2 a').text().trim()
        const href = $(el).find('h2 a').attr('href')
        const snippet = $(el).find('.b_caption p').text().trim()
        if (title && href?.includes('xiaohongshu.com')) {
          insertArticle(db, {
            platform: 'xiaohongshu', title,
            summary: snippet.substring(0, 300),
            full_content: snippet,
            images: [], author: '小红书用户',
            url: href,
            tags: ['小红书', '考研'], likes: 0, comments: 0,
          })
          n++
        }
      })
    } catch (e) { /* silent */ }
    await delay(400)
  }

  // 通道3: 搜狗搜索（国内搜索引擎，对小红书友好）
  for (const term of terms.slice(0, 15)) {
    try {
      const res = await axios.get('https://www.sogou.com/web', {
        params: { query: `小红书 ${term}`, num: 50 },
        headers: { 'User-Agent': UA },
        timeout: 12000,
      })
      const $ = cheerio.load(res.data)
      $('div.vrwrap, div.rb, div.results .result').each((_, el) => {
        const title = $(el).find('h3 a, a.title').text().trim()
        const href = $(el).find('h3 a, a.title').attr('href')
        const snippet = $(el).find('.str_info, .ft, .space-txt').text().trim()
        if (title && (title.includes('小红书') || snippet.includes('小红书') || href?.includes('xiaohongshu'))) {
          insertArticle(db, {
            platform: 'xiaohongshu', title,
            summary: snippet.substring(0, 300),
            full_content: snippet,
            images: [], author: '小红书用户',
            url: href?.includes('xiaohongshu.com') ? href : (href || '#'),
            tags: ['小红书', '考研'], likes: 0, comments: 0,
          })
          n++
        }
      })
    } catch (e) { /* silent */ }
    await delay(300)
  }

  // 通道4: 百度搜索
  for (const term of terms.slice(0, 15)) {
    try {
      const res = await axios.get('https://www.baidu.com/s', {
        params: { wd: `小红书 ${term}`, rn: 50 },
        headers: { 'User-Agent': UA },
        timeout: 12000,
      })
      const $ = cheerio.load(res.data)
      $('div.result, div.c-container').each((_, el) => {
        const title = $(el).find('h3 a').text().trim()
        const href = $(el).find('h3 a').attr('href')
        const snippet = $(el).find('.c-abstract, .content-right_2s-H4').text().trim()
        if (title && href && (title.includes('小红书') || snippet.includes('小红书'))) {
          insertArticle(db, {
            platform: 'xiaohongshu', title, summary: snippet.substring(0, 300),
            full_content: snippet, images: [],
            author: '小红书用户',
            url: href,
            tags: ['小红书'], likes: 0, comments: 0,
          })
          n++
        }
      })
    } catch (e) { /* silent */ }
    await delay(300)
  }

  logCrawl(db, 'xiaohongshu', 'success', n, `Deep crawl: ${n} posts with content+images`)
  return n
}

// ============================================================
// 微信公众号：搜狗 + 深度抓取文章全文
// ============================================================
async function crawlWechat(db) {
  let n = 0
  const terms = [
    '中国政法大学考研', '法大刑事司法学院', '法大考研 经验',
    '法大 研究生招生', '中国政法大学 刑法', '法大 复试',
    '法大 导师', '法大 校园', '政法大学 读研', '法大 就业',
  ]
  for (const term of terms) {
    try {
      const res = await axios.get('https://weixin.sogou.com/weixin', {
        params: { type: 2, query: term, ie: 'utf8' },
        headers: { 'User-Agent': UA },
        timeout: 10000,
      })
      const $ = cheerio.load(res.data)
      const links = []
      $('ul.news-list li').each((_, el) => {
        const title = $(el).find('h3 a').text().trim()
        const href = $(el).find('h3 a').attr('href')
        const snippet = $(el).find('.txt-info').text().trim()
        const author = $(el).find('.s-p .all-time-y2').text().trim() || '公众号'
        if (title && href) links.push({ title, url: href.startsWith('http') ? href : `https://weixin.sogou.com${href}`, snippet, author })
      })

      for (const link of links.slice(0, 5)) {
        // 深度抓取公众号文章全文
        const deep = await deepScrapeUrl(link.url)
        const added = insertArticle(db, {
          platform: 'wechat', title: link.title,
          summary: link.snippet.substring(0, 200),
          full_content: deep.text || link.snippet,
          images: deep.images,
          author: link.author, url: link.url,
          tags: ['微信公众号'], likes: 0, comments: 0,
        })
        if (added) n++
        await delay(400)
      }
    } catch (e) { /* silent */ }
    await delay(300)
  }
  logCrawl(db, 'wechat', 'success', n, `Deep crawl: ${n} articles`)
  return n
}

// ============================================================
// 贴吧：抓取帖子列表 + 进入帖子抓取楼主全文
// ============================================================
async function crawlTieba(db) {
  let n = 0
  const bars = ['中国政法大学', '法大考研', '法大', '刑法学考研', '法学考研']
  for (const bar of bars) {
    try {
      const res = await axios.get('https://tieba.baidu.com/f', {
        params: { kw: bar, ie: 'utf-8' },
        headers: { 'User-Agent': UA },
        timeout: 10000,
      })
      const $ = cheerio.load(res.data)
      const threads = []
      $('a.j_th_tit').each((_, el) => {
        const title = $(el).text().trim()
        const href = $(el).attr('href')
        if (title && title.length > 4) {
          const isCuplBar = ['中国政法大学', '法大考研', '法大'].includes(bar)
          if (isCuplBar || isRelevant(title)) {
            threads.push({ title, url: href?.startsWith('http') ? href : `https://tieba.baidu.com${href}` })
          }
        }
      })

      // 深度抓取前5个帖子的楼主全文
      for (const thread of threads.slice(0, 5)) {
        const deep = await deepScrapeUrl(thread.url)
        const added = insertArticle(db, {
          platform: 'tieba', title: thread.title,
          summary: (deep.text || thread.title).substring(0, 200),
          full_content: deep.text || thread.title,
          images: deep.images,
          author: '贴吧用户', url: thread.url,
          tags: ['贴吧', bar], likes: 0, comments: 0,
        })
        if (added) n++
        await delay(300)
      }
    } catch (e) { /* silent */ }
  }
  logCrawl(db, 'tieba', 'success', n, `Deep crawl: ${n} threads`)
  return n
}

// ============================================================
// 微博
// ============================================================
async function crawlWeibo(db) {
  let n = 0
  const queries = ['法大考研', '中国政法大学 考研', '法大 研究生', '法大 刑法', '中国政法大学 招生', '法大 校园']
  for (const q of queries) {
    try {
      const res = await axios.get('https://m.weibo.cn/api/container/getIndex', {
        params: { containerid: `100103type=1&q=${q}`, page_type: 'searchall', page: 1 },
        headers: { 'User-Agent': MOBILE_UA },
        timeout: 10000,
      })
      if (res.data?.data?.cards) {
        for (const card of res.data.data.cards) {
          if (!card.mblog) continue
          const mb = card.mblog
          const text = (mb.text || '').replace(/<[^>]+>/g, '')
          if (text.length < 10) continue
          // 提取微博配图
          const images = (mb.pics || []).map(p => p.large?.url || p.url).filter(Boolean).slice(0, 9)
          const added = insertArticle(db, {
            platform: 'weibo', title: text.substring(0, 80),
            summary: text.substring(0, 200),
            full_content: text,
            images,
            author: mb.user?.screen_name || '微博用户',
            author_avatar: mb.user?.profile_image_url || '',
            url: `https://m.weibo.cn/detail/${mb.id}`,
            tags: ['微博'], likes: mb.attitudes_count || 0, comments: mb.comments_count || 0,
            published_at: mb.created_at,
          })
          if (added) n++
        }
      }
    } catch (e) { /* silent */ }
    await delay(500)
  }
  logCrawl(db, 'weibo', 'success', n, `${n} weibos with images`)
  return n
}

// ============================================================
// 考研论坛：抓取页面 + 深度进入帖子
// ============================================================
async function crawlKaoyan(db) {
  let n = 0
  const urls = [
    'https://www.kaoyan.com/yanzhao/cupl/',
    'https://www.kaoyan.com/yanzhao/cupl/jingyan/',
    'https://www.chinakaoyan.com/graduate/InfoList/class/fsx/schoolID/125.shtml',
  ]
  for (const pageUrl of urls) {
    try {
      const res = await axios.get(pageUrl, { headers: { 'User-Agent': UA }, timeout: 10000 })
      const $ = cheerio.load(res.data)
      const links = []
      $('a').each((_, el) => {
        const title = $(el).text().trim()
        const href = $(el).attr('href')
        if (title.length > 6 && href && !href.startsWith('#') && !href.startsWith('javascript')) {
          links.push({ title, url: href.startsWith('http') ? href : `${new URL(pageUrl).origin}${href}` })
        }
      })
      for (const link of links.slice(0, 8)) {
        const deep = await deepScrapeUrl(link.url)
        const added = insertArticle(db, {
          platform: 'kaoyan', title: link.title,
          summary: (deep.text || link.title).substring(0, 200),
          full_content: deep.text || link.title,
          images: deep.images,
          author: '考研论坛', url: link.url,
          tags: ['考研帮'], likes: 0, comments: 0,
        })
        if (added) n++
        await delay(300)
      }
    } catch (e) { /* silent */ }
  }
  logCrawl(db, 'kaoyan', 'success', n, `Deep crawl: ${n} posts`)
  return n
}

// ============================================================
// 抖音
// ============================================================
async function crawlDouyin(db) {
  let n = 0
  const terms = ['法大考研', '中国政法大学', '法大校园', '法大研究生', '法大刑法', '法大生活']
  for (const term of terms) {
    try {
      const res = await axios.get('https://www.bing.com/search', {
        params: { q: `site:douyin.com ${term}`, count: 50 },
        headers: { 'User-Agent': UA },
        timeout: 12000,
      })
      const $ = cheerio.load(res.data)
      $('li.b_algo').each((_, el) => {
        const title = $(el).find('h2 a').text().trim()
        const href = $(el).find('h2 a').attr('href')
        const snippet = $(el).find('.b_caption p').text().trim()
        if (title && href?.includes('douyin.com')) {
          insertArticle(db, {
            platform: 'douyin', title, summary: snippet.substring(0, 200),
            full_content: snippet, images: [],
            author: '抖音用户', url: href,
            tags: ['抖音'], likes: 0, comments: 0,
          })
          n++
        }
      })
    } catch (e) { /* silent */ }
    await delay(400)
  }
  logCrawl(db, 'douyin', 'success', n, `${n} videos`)
  return n
}

// ============================================================
export async function crawlAll(db) {
  console.log(`[${new Date().toISOString()}] === 全平台深度抓取开始 ===`)
  const results = {}
  const crawlers = [
    { name: 'xiaohongshu', fn: crawlXiaohongshu },
    { name: 'zhihu', fn: crawlZhihu },
    { name: 'bilibili', fn: crawlBilibili },
    { name: 'wechat', fn: crawlWechat },
    { name: 'tieba', fn: crawlTieba },
    { name: 'weibo', fn: crawlWeibo },
    { name: 'douyin', fn: crawlDouyin },
  ]
  for (const { name, fn } of crawlers) {
    try { results[name] = await fn(db); console.log(`  [${name}] ${results[name]} items`) }
    catch (e) { results[name] = 0; logCrawl(db, name, 'error', 0, e.message) }
    await delay(1000)
  }
  const total = Object.values(results).reduce((a, b) => a + b, 0)
  console.log(`[${new Date().toISOString()}] === 完成: ${total} items ===`)
  return { results, total }
}

export async function crawlPlatform(db, platform) {
  const map = { zhihu: crawlZhihu, bilibili: crawlBilibili, xiaohongshu: crawlXiaohongshu,
    wechat: crawlWechat, tieba: crawlTieba, weibo: crawlWeibo, douyin: crawlDouyin }
  if (!map[platform]) throw new Error(`Unknown: ${platform}`)
  return { platform, count: await map[platform](db) }
}

// 按关键词搜索抓取
export async function crawlByKeyword(db, keyword) {
  console.log(`[${new Date().toISOString()}] 关键词抓取: "${keyword}"`)
  let total = 0

  // 在所有平台搜索该关键词
  // B站
  try {
    const res = await axios.get('https://api.bilibili.com/x/web-interface/search/type', {
      params: { search_type: 'video', keyword, page: 1, page_size: 50 },
      headers: { 'User-Agent': UA, 'Referer': 'https://www.bilibili.com' },
      timeout: 10000,
    })
    if (res.data?.data?.result) {
      for (const v of res.data.data.result) {
        const title = (v.title || '').replace(/<[^>]+>/g, '')
        if (title.length < 5) continue
        const cover = v.pic?.startsWith('//') ? `https:${v.pic}` : v.pic
        if (insertArticle(db, {
          platform: 'bilibili', title, summary: (v.description || '').substring(0, 200),
          full_content: v.description || '', images: cover ? [cover] : [],
          author: v.author || 'UP主', url: `https://www.bilibili.com/video/${v.bvid}`,
          tags: ['B站', keyword], likes: v.like || 0, comments: v.review || 0,
          published_at: v.pubdate ? new Date(v.pubdate * 1000).toISOString() : null,
        })) total++
      }
    }
  } catch (e) { /* silent */ }

  // 小红书 via API (优先)
  try {
    const cookie = await getXhsCookie()
    const notes = await searchXhsNotes(keyword, cookie)
    for (const note of notes) {
      if (insertArticle(db, {
        platform: 'xiaohongshu', title: note.title || keyword,
        summary: note.desc?.substring(0, 200) || '',
        full_content: note.desc || '', images: note.images,
        author: note.author,
        url: `https://www.xiaohongshu.com/explore/${note.noteId}`,
        tags: ['小红书', keyword], likes: note.likes, comments: 0,
      })) total++
    }
  } catch (e) { /* silent */ }

  // 小红书 via Google + Bing (API失败时补充)
  for (const engine of ['google', 'bing']) {
    try {
      const url = engine === 'google'
        ? 'https://www.google.com/search'
        : 'https://www.bing.com/search'
      const params = engine === 'google'
        ? { q: `site:xiaohongshu.com ${keyword}`, num: 50 }
        : { q: `site:xiaohongshu.com ${keyword}`, count: 50 }
      const res = await axios.get(url, { params, headers: { 'User-Agent': UA }, timeout: 12000 })
      const $ = cheerio.load(res.data)
      const selector = engine === 'google' ? 'div.g h3, div[data-hveid] h3' : 'li.b_algo h2 a'
      $(engine === 'google' ? 'div.g' : 'li.b_algo').each((_, el) => {
        const a = $(el).find('a[href*="xiaohongshu.com"]').first()
        const href = a.attr('href') || $(el).find('h2 a').attr('href')
        const title = $(el).find('h3').text().trim() || $(el).find('h2 a').text().trim()
        const snippet = $(el).find('.VwiC3b, .b_caption p').text().trim()
        if (title && href) {
          if (insertArticle(db, {
            platform: 'xiaohongshu', title, summary: snippet.substring(0, 300),
            full_content: snippet, images: [], author: '小红书用户',
            url: href.includes('xiaohongshu.com') ? href : (href || '#'),
            tags: ['小红书', keyword], likes: 0, comments: 0,
          })) total++
        }
      })
    } catch (e) { /* silent */ }
  }

  // 知乎
  try {
    const res = await axios.get('https://www.zhihu.com/api/v4/search_v3', {
      params: { t: 'general', q: keyword, correction: 1, offset: 0, limit: 50 },
      headers: { 'User-Agent': UA, 'Accept': 'application/json' },
      timeout: 10000,
    })
    if (res.data?.data) {
      for (const item of res.data.data) {
        if (!item.object) continue
        const obj = item.object
        const title = (obj.title || obj.question?.title || '').replace(/<[^>]+>/g, '')
        if (title.length < 5) continue
        if (insertArticle(db, {
          platform: 'zhihu', title,
          summary: (obj.excerpt || '').substring(0, 200),
          full_content: (obj.excerpt || obj.content || '').substring(0, 2000),
          images: [], author: obj.author?.name || '匿名',
          url: obj.url || `https://www.zhihu.com/question/${obj.question?.id}`,
          tags: ['知乎', keyword], likes: obj.voteup_count || 0, comments: obj.comment_count || 0,
          published_at: obj.created_time ? new Date(obj.created_time * 1000).toISOString() : null,
        })) total++
      }
    }
  } catch (e) { /* silent */ }

  console.log(`  关键词 "${keyword}" 抓取完成: ${total} items`)
  logCrawl(db, 'keyword', 'success', total, `Keyword: ${keyword}`)
  return { keyword, count: total }
}
