import { useState, useEffect, useCallback } from 'react'
import { platforms, mockNewsItems, newsCategories } from '../data/newsData'
import { Heart, MessageCircle, Clock, ExternalLink, RefreshCw, Rss, X, User, Share2, Bookmark, Image, Loader2, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react'

const API_BASE = 'https://cupl-cssf-api.onrender.com'

function PlatformBadge({ platform, size = 'sm' }) {
  const p = platforms.find(pl => pl.id === platform)
  if (!p) return null
  const cls = size === 'lg'
    ? `badge-${platform} px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1.5`
    : `badge-${platform} px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1`
  return <span className={cls}>{p.icon} {p.name}</span>
}

function formatNumber(n) {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}w`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n
}

function getPlatformName(id) {
  const map = { xiaohongshu: '小红书', bilibili: 'B站', zhihu: '知乎', wechat: '微信公众号', tieba: '百度贴吧', weibo: '微博', kaoyan: '考研论坛', douyin: '抖音' }
  return map[id] || id
}

// ==================== 图片画廊 ====================
function ImageGallery({ images }) {
  const [viewIdx, setViewIdx] = useState(null)
  if (!images || images.length === 0) return null

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
          <Image className="w-4 h-4" />
          <span>配图 ({images.length})</span>
        </div>
        <div className={`grid gap-2 ${images.length === 1 ? 'grid-cols-1' : images.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {images.slice(0, 9).map((src, i) => (
            <div
              key={i}
              className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition"
              onClick={() => setViewIdx(i)}
            >
              <img
                src={src}
                alt={`配图${i + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={e => { e.target.style.display = 'none' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 图片大图查看器 */}
      {viewIdx !== null && (
        <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center" onClick={() => setViewIdx(null)}>
          <button onClick={(e) => { e.stopPropagation(); setViewIdx(Math.max(0, viewIdx - 1)) }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <img src={images[viewIdx]} alt="" className="max-w-[90vw] max-h-[90vh] object-contain" onClick={e => e.stopPropagation()} />
          <button onClick={(e) => { e.stopPropagation(); setViewIdx(Math.min(images.length - 1, viewIdx + 1)) }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30">
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
          <button onClick={() => setViewIdx(null)} className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30">
            <X className="w-6 h-6 text-white" />
          </button>
          <span className="absolute bottom-6 text-white/70 text-sm">{viewIdx + 1} / {images.length}</span>
        </div>
      )}
    </>
  )
}

// ==================== 完整文章阅读器 ====================
function ArticleReader({ item, onClose }) {
  if (!item) return null

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', handler); document.body.style.overflow = '' }
  }, [onClose])

  const platformInfo = platforms.find(p => p.id === item.platform)
  const content = item.full_content || item.fullContent || item.summary || ''
  const images = item.images || []
  const hasRealContent = content.length > 50

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-fade-in-up" onClick={e => e.stopPropagation()}>
        {/* 平台色条 */}
        <div className="h-1.5" style={{ background: platformInfo?.color || '#8B0000' }}></div>
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition z-10">
          <X className="w-4 h-4 text-gray-600" />
        </button>

        <div className="overflow-y-auto max-h-[calc(90vh-1.5rem)]">
          <div className="p-6 sm:p-8">
            {/* 平台 + 时间 */}
            <div className="flex items-center justify-between mb-4">
              <PlatformBadge platform={item.platform} size="lg" />
              <span className="text-sm text-gray-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />{item.time || new Date(item.published_at || item.crawled_at).toLocaleString('zh-CN')}
              </span>
            </div>

            {/* 标题 */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug mb-4">{item.title}</h2>

            {/* 作者 */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              {item.author_avatar ? (
                <img src={item.author_avatar} alt="" className="w-10 h-10 rounded-full object-cover" onError={e => { e.target.style.display = 'none' }} />
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${platformInfo?.color}20` }}>
                  <User className="w-5 h-5" style={{ color: platformInfo?.color }} />
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900">{item.author}</p>
                <p className="text-xs text-gray-400">来自{getPlatformName(item.platform)}</p>
              </div>
            </div>

            {/* ===== 核心：完整正文 ===== */}
            {hasRealContent ? (
              <div className="mb-6 prose prose-sm max-w-none">
                <div className="text-gray-800 leading-relaxed whitespace-pre-line text-[15px]">
                  {content}
                </div>
              </div>
            ) : (
              <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-amber-800 font-medium">原文内容较长，以下为摘要</p>
                  <p className="text-sm text-amber-700 mt-1">{item.summary}</p>
                </div>
              </div>
            )}

            {/* ===== 图片画廊 ===== */}
            <ImageGallery images={images} />

            {/* 标签 */}
            {item.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {(typeof item.tags[0] === 'string' ? item.tags : []).map((tag, i) => (
                  <span key={i} className="text-sm px-3 py-1 bg-gray-100 text-gray-600 rounded-full">#{tag}</span>
                ))}
              </div>
            )}

            {/* 互动数据 */}
            <div className="flex items-center gap-6 py-4 border-t border-b border-gray-100 mb-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Heart className="w-5 h-5 text-red-400" />
                <span className="font-medium">{formatNumber(item.likes)}</span>
                <span className="text-sm text-gray-400">赞</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MessageCircle className="w-5 h-5 text-blue-400" />
                <span className="font-medium">{formatNumber(item.comments)}</span>
                <span className="text-sm text-gray-400">评论</span>
              </div>
              {images.length > 0 && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Image className="w-5 h-5 text-green-400" />
                  <span className="font-medium">{images.length}</span>
                  <span className="text-sm text-gray-400">图片</span>
                </div>
              )}
            </div>

            {/* 操作按钮 */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a href={item.url} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-cupl-red text-white font-medium rounded-xl hover:bg-red-800 transition"
                style={item.url && item.url !== '#' ? {} : { pointerEvents: 'none', opacity: 0.5 }}>
                <ExternalLink className="w-4 h-4" />
                前往{getPlatformName(item.platform)}查看原帖
              </a>
              <button className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition">
                <Bookmark className="w-4 h-4" />收藏
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ==================== 新闻卡片 ====================
function NewsCard({ item, onClick }) {
  const images = item.images || []
  const hasContent = (item.full_content || item.fullContent || '').length > 50

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm card-hover cursor-pointer" onClick={() => onClick(item)}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <PlatformBadge platform={item.platform} />
        <span className="text-xs text-gray-400 flex items-center gap-1 shrink-0">
          <Clock className="w-3 h-3" />{item.time || new Date(item.published_at || item.crawled_at).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 hover:text-cupl-red transition">{item.title}</h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.summary}</p>

      {/* 缩略图预览 */}
      {images.length > 0 && (
        <div className="flex gap-1.5 mb-3 overflow-hidden rounded-lg">
          {images.slice(0, 3).map((src, i) => (
            <div key={i} className="w-20 h-20 bg-gray-100 rounded overflow-hidden shrink-0">
              <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" onError={e => { e.target.parentElement.style.display = 'none' }} />
            </div>
          ))}
          {images.length > 3 && (
            <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center shrink-0">
              <span className="text-xs text-gray-400">+{images.length - 3}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 mb-3">
        {(typeof item.tags?.[0] === 'string' ? item.tags : []).slice(0, 3).map((tag, i) => (
          <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">#{tag}</span>
        ))}
        {hasContent && (
          <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">全文已收录</span>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span className="font-medium">{item.author}</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" />{formatNumber(item.likes)}</span>
          <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" />{item.comments}</span>
          {images.length > 0 && <span className="flex items-center gap-1"><Image className="w-3.5 h-3.5" />{images.length}</span>}
        </div>
      </div>
    </div>
  )
}

// ==================== 主组件 ====================
export default function NewsFeedSection() {
  const [activePlatform, setActivePlatform] = useState('all')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [newsItems, setNewsItems] = useState(mockNewsItems)
  const [selectedItem, setSelectedItem] = useState(null)
  const [backendOnline, setBackendOnline] = useState(false)
  const [crawling, setCrawling] = useState(false)

  const filtered = activePlatform === 'all'
    ? newsItems
    : newsItems.filter(item => item.platform === activePlatform)

  // 尝试从后端加载数据
  const fetchFromBackend = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/articles?limit=100&platform=${activePlatform}`)
      if (res.ok) {
        const data = await res.json()
        if (data.articles?.length > 0) {
          setNewsItems(data.articles)
          setBackendOnline(true)
          setLastUpdate(new Date())
          return true
        }
      }
    } catch (e) { /* backend offline, use mock data */ }
    setBackendOnline(false)
    return false
  }, [activePlatform])

  // 启动时尝试连接后端
  useEffect(() => { fetchFromBackend() }, [fetchFromBackend])

  // 手动刷新：触发后端爬取 + 拉取数据
  const handleRefresh = async () => {
    setIsRefreshing(true)
    setCrawling(true)
    try {
      // 触发后端爬取
      await fetch(`${API_BASE}/api/crawl`, { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activePlatform !== 'all' ? { platform: activePlatform } : {})
      })
      // 拉取最新数据
      await fetchFromBackend()
    } catch (e) {
      // 后端不在线，刷新 mock 数据时间
      setLastUpdate(new Date())
    }
    setCrawling(false)
    setIsRefreshing(false)
  }

  // 定时从后端拉取
  useEffect(() => {
    const interval = setInterval(() => { fetchFromBackend() }, 60000)
    return () => clearInterval(interval)
  }, [fetchFromBackend])

  return (
    <section id="news" className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-red-50 text-cupl-red text-sm font-medium rounded-full mb-4">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1 animate-live-dot"></span>
            实时资讯
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            全网深度 <span className="text-cupl-red">内容聚合</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            深度抓取全文内容 + 图片，在平台内直接阅读完整帖子，无需跳转
          </p>
        </div>

        {/* 状态栏 */}
        <div className="bg-white rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-green-500 animate-live-dot' : 'bg-amber-500'}`}></span>
              <span className="text-sm font-medium text-gray-700">
                {backendOnline ? '深度抓取引擎运行中' : '展示模式（启动后端开启实时抓取）'}
              </span>
            </div>
            <span className="text-xs text-gray-400">更新: {lastUpdate.toLocaleTimeString('zh-CN')}</span>
            <span className="text-xs text-gray-400">已收录 {newsItems.length} 条</span>
          </div>
          <button onClick={handleRefresh} disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-cupl-red text-white rounded-lg text-sm font-medium hover:bg-red-800 transition disabled:opacity-50">
            {isRefreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {crawling ? '正在深度抓取...' : isRefreshing ? '刷新中...' : '立即抓取最新内容'}
          </button>
        </div>

        {/* 平台筛选 */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {platforms.map(p => (
            <button key={p.id} onClick={() => setActivePlatform(p.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                activePlatform === p.id ? 'bg-cupl-red text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}>
              <span>{p.icon}</span>{p.name}
              {activePlatform === p.id && (
                <span className="bg-white/20 px-1.5 rounded-full text-xs">
                  {p.id === 'all' ? newsItems.length : newsItems.filter(n => n.platform === p.id).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* 内容网格 */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, i) => (
            <NewsCard key={item.id || i} item={item} onClick={setSelectedItem} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Rss className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>该平台暂无相关内容，点击"立即抓取"获取最新内容</p>
          </div>
        )}

        {/* 平台说明 */}
        <div className="mt-12 bg-gray-50 rounded-2xl p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Rss className="w-5 h-5 text-cupl-red" /> 深度抓取能力
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: '小红书', desc: '深度抓取帖子全文 + 配图，无需跳转', status: '全文+图片', color: '#FE2C55' },
              { name: 'B站', desc: '视频简介全文 + 封面图，一键播放', status: '全文+封面', color: '#00A1D6' },
              { name: '知乎', desc: '回答全文深度提取，含高赞回答', status: '全文+图片', color: '#0066FF' },
              { name: '百度贴吧', desc: '楼主全文 + 配图，深入帖子内页', status: '全文+图片', color: '#4E6EF2' },
              { name: '微信公众号', desc: '文章全文提取，含文内图片', status: '全文+图片', color: '#07C160' },
              { name: '微博', desc: '博文全文 + 九宫格图片提取', status: '全文+图片', color: '#FF8200' },
              { name: '考研论坛', desc: '帖子全文提取，经验帖深度收录', status: '全文+图片', color: '#E74C3C' },
              { name: '抖音', desc: '视频描述 + 标签信息', status: '描述', color: '#000000' },
            ].map((p, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm" style={{ color: p.color }}>{p.name}</span>
                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">{p.status}</span>
                </div>
                <p className="text-xs text-gray-500">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 文章阅读器 */}
      {selectedItem && <ArticleReader item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </section>
  )
}
