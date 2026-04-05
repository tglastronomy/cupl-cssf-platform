import { studyResources } from '../data/admissionData'
import { BookOpen, Video, FileText, Database, Star, ExternalLink } from 'lucide-react'

const iconMap = {
  '专业课教材': BookOpen,
  '公共课资料': FileText,
  '学术期刊与论文': Database,
  '线上学习平台': Video,
}

const importanceColors = {
  '核心教材': 'bg-red-100 text-red-700 border-red-200',
  '必备': 'bg-red-100 text-red-700 border-red-200',
  '重要参考': 'bg-amber-100 text-amber-700 border-amber-200',
  '推荐': 'bg-blue-100 text-blue-700 border-blue-200',
  '权威期刊': 'bg-purple-100 text-purple-700 border-purple-200',
  '专业期刊': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  '学校期刊': 'bg-green-100 text-green-700 border-green-200',
  '免费视频': 'bg-pink-100 text-pink-700 border-pink-200',
  '论文数据库': 'bg-gray-100 text-gray-700 border-gray-200',
  '法律数据库': 'bg-teal-100 text-teal-700 border-teal-200',
}

export default function ResourcesSection() {
  return (
    <section id="resources" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-red-50 text-cupl-red text-sm font-medium rounded-full mb-4">备考资源</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            一站式 <span className="text-cupl-red">备考资源库</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            精心整理的教材、资料、期刊和学习平台，助你高效备考
          </p>
        </div>

        <div className="space-y-8">
          {studyResources.map((category, i) => {
            const Icon = iconMap[category.category] || BookOpen
            return (
              <div key={i} className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-cupl-red rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{category.category}</h3>
                  <span className="text-sm text-gray-500">({category.items.length} 项)</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {category.items.map((item, j) => (
                    <div key={j} className="bg-white rounded-xl p-4 flex items-start gap-4 card-hover border border-gray-100">
                      <div className="shrink-0">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${
                          importanceColors[item.type] || 'bg-gray-100 text-gray-700 border-gray-200'
                        }`}>
                          {item.type}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Tips */}
        <div className="mt-12 bg-gradient-to-r from-cupl-red to-cupl-dark rounded-2xl p-8 text-white">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-cupl-gold" /> 备考贴士
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              '专业课教材至少精读3遍，第一遍通读建立框架，第二遍做笔记抓重点，第三遍查漏补缺',
              '历年真题是最重要的复习资料，至少做近10年真题，总结高频考点和出题规律',
              '关注法大教授近2年发表的论文，特别是《政法论坛》上的文章，可能是出题方向',
              '英语一不能放松，法大单科线要求较高（≥60），阅读理解和作文是重点',
              '政治不要过早开始，9月开始跟肖秀荣即可，最后两个月背肖四肖八',
              '复试权重高，要提前准备英语口语和专业课问答，关注时事热点和学术前沿',
            ].map((tip, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-cupl-gold rounded-full text-xs font-bold text-white mb-2">
                  {i + 1}
                </span>
                <p className="text-sm text-white/90">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
