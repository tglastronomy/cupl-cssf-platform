import { useState } from 'react'
import { scoreLines, admissionStats, timeline } from '../data/admissionData'
import { TrendingUp, BarChart3, Calendar, ArrowUp, ArrowDown, Minus } from 'lucide-react'

function ScoreChart({ data, program }) {
  const filtered = data.filter(d => d.program === program).sort((a, b) => a.year - b.year)
  const maxTotal = Math.max(...filtered.map(d => d.total))
  const minTotal = Math.min(...filtered.map(d => d.total))
  const range = maxTotal - minTotal || 1

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
      <h4 className="font-bold text-gray-900 mb-4">{program} · 历年分数线走势</h4>
      <div className="flex items-end gap-3 h-48">
        {filtered.map((d, i) => {
          const height = ((d.total - minTotal + 10) / (range + 20)) * 100
          const natHeight = ((d.nationalLine - minTotal + 10) / (range + 20)) * 100
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-sm font-bold text-cupl-red">{d.total}</span>
              <div className="w-full relative" style={{ height: '160px' }}>
                <div
                  className="absolute bottom-0 w-full bg-gradient-to-t from-cupl-red to-cupl-red/60 rounded-t-lg transition-all duration-500"
                  style={{ height: `${height}%` }}
                ></div>
                <div
                  className="absolute bottom-0 w-full border-t-2 border-dashed border-amber-500"
                  style={{ bottom: `${natHeight}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500">{d.year}</span>
            </div>
          )
        })}
      </div>
      <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-cupl-red rounded-sm"></span>院线</span>
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 border-t-2 border-dashed border-amber-500 inline-block"></span>国家线</span>
      </div>
    </div>
  )
}

export default function DataSection() {
  const [activeTab, setActiveTab] = useState('scores')

  return (
    <section id="data" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-red-50 text-cupl-red text-sm font-medium rounded-full mb-4">历年数据</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            数据分析 · <span className="text-cupl-red">知己知彼</span>
          </h2>
          <p className="text-gray-600">全面的历年考研数据，助你做出更明智的选择</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {[
            { id: 'scores', label: '复试分数线', icon: TrendingUp },
            { id: 'admission', label: '报录统计', icon: BarChart3 },
            { id: 'timeline', label: '备考时间线', icon: Calendar },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-cupl-red text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />{tab.label}
            </button>
          ))}
        </div>

        {/* Score lines */}
        {activeTab === 'scores' && (
          <div>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <ScoreChart data={scoreLines} program="刑法学" />
              <ScoreChart data={scoreLines} program="诉讼法学" />
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-cupl-red text-white">
                      <th className="py-3 px-4 text-left">年份</th>
                      <th className="py-3 px-4 text-left">专业</th>
                      <th className="py-3 px-4 text-center">政治</th>
                      <th className="py-3 px-4 text-center">英语</th>
                      <th className="py-3 px-4 text-center">业务课</th>
                      <th className="py-3 px-4 text-center">总分</th>
                      <th className="py-3 px-4 text-center">国家线</th>
                      <th className="py-3 px-4 text-center">超国家线</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scoreLines.map((row, i) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{row.year}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            row.program === '刑法学' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                          }`}>{row.program}</span>
                        </td>
                        <td className="py-3 px-4 text-center">{'\u2265'}{row.politics}</td>
                        <td className="py-3 px-4 text-center">{'\u2265'}{row.english}</td>
                        <td className="py-3 px-4 text-center">{'\u2265'}{row.professional}</td>
                        <td className="py-3 px-4 text-center font-bold text-cupl-red">{'\u2265'}{row.total}</td>
                        <td className="py-3 px-4 text-center text-gray-500">{row.nationalLine}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="text-red-600 font-bold">+{row.total - row.nationalLine}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Admission stats */}
        {activeTab === 'admission' && (
          <div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {admissionStats.filter(s => s.year === 2024).map((stat, i) => (
                <div key={i} className="bg-gradient-to-br from-cupl-red to-cupl-dark rounded-xl p-6 text-white">
                  <h4 className="font-bold text-lg mb-4">{stat.program} · {stat.year}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-white/70 text-xs">计划招生</p>
                      <p className="text-2xl font-bold">{stat.planned}</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-xs">报名人数</p>
                      <p className="text-2xl font-bold">{stat.applied}</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-xs">实际录取</p>
                      <p className="text-2xl font-bold">{stat.admitted}</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-xs">报录比</p>
                      <p className="text-2xl font-bold text-cupl-gold">{stat.ratio}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-cupl-red text-white">
                      <th className="py-3 px-4 text-left">年份</th>
                      <th className="py-3 px-4 text-left">专业</th>
                      <th className="py-3 px-4 text-center">计划</th>
                      <th className="py-3 px-4 text-center">报名</th>
                      <th className="py-3 px-4 text-center">录取</th>
                      <th className="py-3 px-4 text-center">报录比</th>
                      <th className="py-3 px-4 text-center">平均分</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admissionStats.map((row, i) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{row.year}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            row.program === '刑法学' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                          }`}>{row.program}</span>
                        </td>
                        <td className="py-3 px-4 text-center">{row.planned}</td>
                        <td className="py-3 px-4 text-center">{row.applied}</td>
                        <td className="py-3 px-4 text-center font-bold">{row.admitted}</td>
                        <td className="py-3 px-4 text-center font-bold text-cupl-red">{row.ratio}</td>
                        <td className="py-3 px-4 text-center font-bold text-cupl-gold">{row.avgScore}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        {activeTab === 'timeline' && (
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              {timeline.map((item, i) => (
                <div key={i} className="relative flex items-start gap-6 pb-8 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div
                    className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xs z-10"
                    style={{ background: item.color }}
                  >
                    {item.month.split('月')[0]}月
                  </div>
                  <div className="flex-1 bg-white rounded-xl p-5 border border-gray-100 shadow-sm card-hover">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs px-2 py-0.5 rounded-full text-white font-medium" style={{ background: item.color }}>
                        {item.month}
                      </span>
                      <h4 className="font-bold text-gray-900">{item.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
