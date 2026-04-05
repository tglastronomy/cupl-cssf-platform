import { useState } from 'react'
import { programs } from '../data/admissionData'
import { BookOpen, FileText, Layers, Star, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'

export default function AdmissionSection() {
  const [expandedProgram, setExpandedProgram] = useState(0)
  const [showAllRefs, setShowAllRefs] = useState({})

  const toggleRefs = (idx) => {
    setShowAllRefs(prev => ({ ...prev, [idx]: !prev[idx] }))
  }

  return (
    <section id="admission" className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-red-50 text-cupl-red text-sm font-medium rounded-full mb-4">招生信息</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            2026年硕士研究生 <span className="text-cupl-red">招生专业</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            刑事司法学院设有刑法学、诉讼法学两个硕士点，均为国家重点学科
          </p>
        </div>

        {/* Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <strong>注意：</strong>2026年初试科目可能有调整，请密切关注
            <a href="https://yjsy.cupl.edu.cn/yjszs.htm" target="_blank" rel="noopener" className="text-cupl-red underline ml-1">
              中国政法大学研究生院官网
            </a>
            发布的最新通知。以下信息仅供参考。
          </div>
        </div>

        {/* Programs */}
        <div className="space-y-6">
          {programs.map((prog, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Program header */}
              <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => setExpandedProgram(expandedProgram === idx ? -1 : idx)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-cupl-red rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{prog.code.slice(-2)}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{prog.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-gray-500">代码：{prog.code}</span>
                        <span className="text-sm px-2 py-0.5 bg-cupl-red/10 text-cupl-red rounded">{prog.type}</span>
                        <span className="text-sm px-2 py-0.5 bg-cupl-gold/10 text-cupl-gold rounded">{prog.degree}</span>
                        <span className="text-sm text-gray-500">学制：{prog.duration}</span>
                      </div>
                    </div>
                  </div>
                  {expandedProgram === idx ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </div>
              </div>

              {/* Expanded content */}
              {expandedProgram === idx && (
                <div className="border-t border-gray-100 p-6 animate-fade-in-up">
                  {/* Research directions */}
                  <div className="mb-8">
                    <h4 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                      <Layers className="w-5 h-5 text-cupl-red" /> 研究方向
                    </h4>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {prog.directions.map((dir, i) => (
                        <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3">
                          <span className="w-6 h-6 bg-cupl-red/10 text-cupl-red rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                          <span className="text-sm text-gray-700">{dir}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Exam subjects */}
                  <div className="mb-8">
                    <h4 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                      <FileText className="w-5 h-5 text-cupl-red" /> 初试科目
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-cupl-red/5">
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 rounded-tl-lg">科目代码</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">科目名称</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-700">满分</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 rounded-tr-lg">备注</th>
                          </tr>
                        </thead>
                        <tbody>
                          {prog.examSubjects.map((sub, i) => (
                            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                              <td className="py-3 px-4 font-mono text-cupl-red">{sub.code}</td>
                              <td className="py-3 px-4 font-medium text-gray-900">{sub.name}</td>
                              <td className="py-3 px-4 text-center text-gray-600">{sub.score}</td>
                              <td className="py-3 px-4 text-gray-500">{sub.note || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Retest subjects */}
                  <div className="mb-8">
                    <h4 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                      <FileText className="w-5 h-5 text-amber-600" /> 复试科目
                    </h4>
                    <div className="bg-amber-50 rounded-lg p-4">
                      {prog.retestSubjects.map((sub, i) => (
                        <p key={i} className="text-sm text-amber-800">{sub}</p>
                      ))}
                    </div>
                  </div>

                  {/* Reference books */}
                  <div>
                    <h4 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                      <BookOpen className="w-5 h-5 text-cupl-red" /> 参考书目
                    </h4>
                    <div className="space-y-3">
                      {(showAllRefs[idx] ? prog.references : prog.references.slice(0, 4)).map((ref, i) => (
                        <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                          <div className={`shrink-0 px-2 py-0.5 rounded text-xs font-medium ${
                            ref.importance === '核心' ? 'bg-red-100 text-red-700' :
                            ref.importance === '重要' ? 'bg-amber-100 text-amber-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {ref.importance}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{ref.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{ref.author} | {ref.publisher} | {ref.year}</p>
                          </div>
                        </div>
                      ))}
                      {prog.references.length > 4 && (
                        <button
                          onClick={() => toggleRefs(idx)}
                          className="text-sm text-cupl-red hover:underline"
                        >
                          {showAllRefs[idx] ? '收起' : `查看全部 ${prog.references.length} 本参考书`}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
