import { useState } from 'react'
import { Menu, X, GraduationCap, Bell, Search } from 'lucide-react'

const navItems = [
  { id: 'home', label: '首页' },
  { id: 'overview', label: '院校概况' },
  { id: 'admission', label: '招生信息' },
  { id: 'data', label: '历年数据' },
  { id: 'advisors', label: '导师信息' },
  { id: 'resources', label: '备考资源' },
  { id: 'news', label: '实时资讯' },
  { id: 'faq', label: '常见问题' },
]

export default function Header({ activeSection, onNavigate }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
      {/* Top bar */}
      <div className="bg-cupl-red text-white text-xs py-1">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-live-dot"></span>
            <span>全网实时监控中 | 已接入 8 大平台 | 24小时不间断更新</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <a href="https://yjsy.cupl.edu.cn/" target="_blank" rel="noopener" className="hover:text-cupl-gold transition">研究生院官网</a>
            <a href="https://xssfxy.cupl.edu.cn/" target="_blank" rel="noopener" className="hover:text-cupl-gold transition">学院官网</a>
            <a href="https://yz.chsi.com.cn/" target="_blank" rel="noopener" className="hover:text-cupl-gold transition">研招网</a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-10 h-10 bg-cupl-red rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-cupl-red leading-tight">法大刑司考研</h1>
              <p className="text-xs text-gray-500">全网最全信息平台</p>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeSection === item.id
                    ? 'bg-cupl-red text-white'
                    : 'text-gray-700 hover:bg-red-50 hover:text-cupl-red'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="pb-3 animate-fade-in-up">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索考研资讯、经验帖、参考书目、导师信息..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cupl-red/30 focus:border-cupl-red"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 animate-fade-in-up">
          <nav className="max-w-7xl mx-auto px-4 py-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setMobileOpen(false) }}
                className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  activeSection === item.id
                    ? 'bg-cupl-red text-white'
                    : 'text-gray-700 hover:bg-red-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
