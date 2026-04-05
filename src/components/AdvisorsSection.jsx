import { advisors } from '../data/admissionData'
import { User, BookOpen, Tag } from 'lucide-react'

export default function AdvisorsSection() {
  return (
    <section id="advisors" className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-red-50 text-cupl-red text-sm font-medium rounded-full mb-4">导师信息</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            名师荟萃 · <span className="text-cupl-red">师资力量</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            学院拥有教授23人、博士生导师19人，是国内刑事法学领域师资最强的学院之一
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {advisors.map((advisor, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm card-hover">
              {/* Avatar area */}
              <div className="bg-gradient-to-br from-cupl-red to-cupl-dark p-6 text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">{advisor.name}</h3>
                <p className="text-sm text-white/80 mt-1">{advisor.title}</p>
              </div>

              {/* Details */}
              <div className="p-5">
                <div className="flex items-start gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-cupl-red shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">研究方向</p>
                    <p className="text-sm font-medium text-gray-800">{advisor.direction}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{advisor.intro}</p>

                <div className="flex flex-wrap gap-1.5">
                  {advisor.tags.map((tag, j) => (
                    <span key={j} className="text-xs px-2 py-0.5 bg-cupl-red/5 text-cupl-red rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            以上仅列出部分导师信息，完整导师名单请访问
            <a href="https://xssfxy.cupl.edu.cn/" target="_blank" rel="noopener" className="text-cupl-red hover:underline ml-1">
              刑事司法学院官网
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
