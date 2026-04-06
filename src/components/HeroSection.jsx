import { TrendingUp, Users, BookOpen, Clock, ArrowRight, Zap } from 'lucide-react'

const stats = [
  { icon: TrendingUp, value: '370', label: '2026刑法学院线', color: 'text-red-400' },
  { icon: Users, value: '64', label: '专职教师', color: 'text-blue-400' },
  { icon: BookOpen, value: '2', label: '国家重点学科', color: 'text-amber-400' },
  { icon: Clock, value: '24h', label: '全网实时监控', color: 'text-emerald-400' },
]

export default function HeroSection({ onNavigate }) {
  return (
    <section id="home" className="relative overflow-hidden">
      {/* Background — premium dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f1a] via-[#1a1028] to-[#0d1117]"></div>
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
        backgroundSize: '40px 40px',
      }}></div>
      {/* Gradient orbs */}
      <div className="absolute top-20 -left-32 w-96 h-96 bg-cupl-red/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-10 -right-32 w-96 h-96 bg-cupl-gold/15 rounded-full blur-[120px]"></div>

      <div className="relative max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/[0.06] backdrop-blur-md rounded-full px-5 py-2 mb-8 border border-white/[0.08] animate-fade-in-up">
            <Zap className="w-4 h-4 text-cupl-gold" />
            <span className="text-sm text-white/80 tracking-wide">全网最全 · 实时更新 · 8大平台全覆盖</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-3 tracking-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            中国政法大学
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold mb-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cupl-gold to-amber-300">刑事司法学院</span>
            <span className="text-white/90"> 硕士研究生</span>
          </h2>
          <p className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tight animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            综合信息平台
          </p>

          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            2027考研（2026年12月）备考必备
            <br />
            <span className="text-white/50 text-sm">汇聚招生数据 · 导师信息 · 备考资源 · 上岸经验 · 全网实时资讯</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <button
              onClick={() => onNavigate('admission')}
              className="px-8 py-3.5 bg-gradient-to-r from-cupl-gold to-amber-500 text-white font-bold rounded-2xl hover:shadow-[0_8px_32px_rgba(212,168,83,0.4)] transition-all shadow-lg flex items-center gap-2"
            >
              查看招生信息 <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('news')}
              className="px-8 py-3.5 bg-white/[0.06] backdrop-blur-md text-white font-bold rounded-2xl hover:bg-white/[0.12] transition-all border border-white/[0.1] flex items-center gap-2"
            >
              浏览实时资讯 <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white/[0.04] backdrop-blur-md rounded-2xl p-5 border border-white/[0.06] animate-fade-in-up"
                style={{ animationDelay: `${0.6 + i * 0.1}s` }}
              >
                <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
                <div className="text-2xl font-bold text-white tracking-tight">{stat.value}</div>
                <div className="text-xs text-white/50 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f5f5f7"/>
        </svg>
      </div>
    </section>
  )
}
