import { TrendingUp, Users, BookOpen, Clock, ArrowRight, Zap } from 'lucide-react'

const stats = [
  { icon: TrendingUp, value: '370+', label: '2024刑法学院线', color: 'text-red-600' },
  { icon: Users, value: '64', label: '专职教师', color: 'text-blue-600' },
  { icon: BookOpen, value: '2', label: '国家重点学科', color: 'text-amber-600' },
  { icon: Clock, value: '24h', label: '全网实时监控', color: 'text-green-600' },
]

export default function HeroSection({ onNavigate }) {
  return (
    <section id="home" className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cupl-red via-cupl-dark to-cupl-navy"></div>
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>

      <div className="relative max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 animate-fade-in-up">
            <Zap className="w-4 h-4 text-cupl-gold" />
            <span className="text-sm text-white/90">全网最全 · 实时更新 · 8大平台全覆盖</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            中国政法大学
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <span className="text-cupl-gold">刑事司法学院</span>
            <span className="text-white"> 硕士研究生</span>
          </h2>
          <p className="text-3xl md:text-5xl font-black text-white mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            综合信息平台
          </p>

          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            汇聚招生数据 · 导师信息 · 备考资源 · 上岸经验 · 全网实时资讯
            <br />
            覆盖小红书、B站、知乎、贴吧、微信公众号等全平台内容
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <button
              onClick={() => onNavigate('admission')}
              className="px-8 py-3.5 bg-cupl-gold text-white font-bold rounded-xl hover:bg-yellow-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              查看招生信息 <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('news')}
              className="px-8 py-3.5 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl hover:bg-white/20 transition-all border border-white/20 flex items-center gap-2"
            >
              浏览实时资讯 <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 animate-fade-in-up"
                style={{ animationDelay: `${0.6 + i * 0.1}s` }}
              >
                <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-white/70">{stat.label}</div>
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
