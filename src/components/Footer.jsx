import { GraduationCap, ExternalLink, Mail, MapPin, Phone } from 'lucide-react'

const links = [
  {
    title: '官方链接',
    items: [
      { name: '中国政法大学官网', url: 'https://www.cupl.edu.cn/' },
      { name: '刑事司法学院', url: 'https://xssfxy.cupl.edu.cn/' },
      { name: '研究生院', url: 'https://yjsy.cupl.edu.cn/' },
      { name: '研招网', url: 'https://yz.chsi.com.cn/' },
    ]
  },
  {
    title: '备考资源',
    items: [
      { name: '招生专业目录', url: 'https://yjsy.cupl.edu.cn/yjszs.htm' },
      { name: '历年分数线', url: 'https://yjsy.cupl.edu.cn/yjszs/fsfsx.htm' },
      { name: '复试录取', url: 'https://yjsy.cupl.edu.cn/yjszs/ndsszs/fslq.htm' },
      { name: '中国知网', url: 'https://www.cnki.net/' },
    ]
  },
  {
    title: '信息来源',
    items: [
      { name: '小红书', url: 'https://www.xiaohongshu.com/' },
      { name: 'B站', url: 'https://www.bilibili.com/' },
      { name: '知乎', url: 'https://www.zhihu.com/' },
      { name: '考研帮', url: 'https://www.kaoyan.com/' },
    ]
  }
]

export default function Footer() {
  return (
    <footer className="bg-cupl-dark text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-cupl-red rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">法大刑司考研</h3>
                <p className="text-xs text-gray-400">全网最全信息平台</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              汇聚全网资源，为中国政法大学刑事司法学院考研学子提供最全面、最及时的信息服务。
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4" />北京市昌平区府学路27号</p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4" />010-58908070（研招办）</p>
            </div>
          </div>

          {/* Links */}
          {links.map((group, i) => (
            <div key={i}>
              <h4 className="font-bold text-sm mb-4 text-cupl-gold">{group.title}</h4>
              <ul className="space-y-2">
                {group.items.map((item, j) => (
                  <li key={j}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-400 hover:text-white transition flex items-center gap-1"
                    >
                      {item.name}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            本平台仅提供信息聚合服务，所有招生信息以中国政法大学官方发布为准。
          </p>
          <p className="text-xs text-gray-500">
            CUPL 刑事司法学院考研综合信息平台 &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  )
}
