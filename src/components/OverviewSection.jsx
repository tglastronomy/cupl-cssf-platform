import { schoolInfo } from '../data/admissionData'
import { MapPin, Phone, Globe, Award, Users, BookOpen, Building2, Scale } from 'lucide-react'

const features = [
  { icon: Award, title: '国家重点学科', desc: '刑法学、刑事诉讼法学均为国家重点学科', color: 'bg-red-50 text-red-600' },
  { icon: Users, title: '顶尖师资', desc: '专职教师64人，教授23人，博导19人', color: 'bg-blue-50 text-blue-600' },
  { icon: Building2, title: '五大研究所', desc: '刑法学、刑诉法、侦查学、犯罪学、网络法学', color: 'bg-amber-50 text-amber-600' },
  { icon: Scale, title: '法学殿堂', desc: '国内刑事法学教学与研究的顶尖学府', color: 'bg-green-50 text-green-600' },
]

const institutes = [
  { name: '刑法学研究所', focus: '中国刑法、比较刑法、经济刑法' },
  { name: '刑事诉讼法学研究所', focus: '刑事诉讼制度、证据规则改革' },
  { name: '侦查学研究所', focus: '侦查理论、刑事技术、数字取证' },
  { name: '犯罪学研究所', focus: '犯罪预防、刑事政策、社区矫正' },
  { name: '网络法学研究所', focus: '网络犯罪、数据安全、信息法' },
]

export default function OverviewSection() {
  return (
    <section id="overview" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-red-50 text-cupl-red text-sm font-medium rounded-full mb-4">院校概况</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            中国政法大学 · <span className="text-cupl-red">刑事司法学院</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            国内刑事法学教学与研究的重要基地，两个国家重点学科，顶尖的师资力量
          </p>
        </div>

        {/* School intro */}
        <div className="bg-gradient-to-r from-cupl-red/5 to-cupl-gold/5 rounded-2xl p-8 mb-12 border border-cupl-red/10">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold text-gray-900 mb-4">学院简介</h3>
              <p className="text-gray-700 leading-relaxed mb-6">{schoolInfo.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{schoolInfo.address}</span>
                <span className="flex items-center gap-1"><Phone className="w-4 h-4" />{schoolInfo.phone}</span>
                <a href={schoolInfo.website} target="_blank" rel="noopener" className="flex items-center gap-1 text-cupl-red hover:underline">
                  <Globe className="w-4 h-4" />学院官网
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">核心优势</h3>
              <ul className="space-y-2">
                {schoolInfo.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-1 w-1.5 h-1.5 bg-cupl-gold rounded-full shrink-0"></span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((f, i) => (
            <div key={i} className="card-hover bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Research institutes */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">五大教学科研机构</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {institutes.map((inst, i) => (
              <div key={i} className="bg-white rounded-xl p-4 text-center card-hover border border-gray-100">
                <div className="w-10 h-10 bg-cupl-red/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-5 h-5 text-cupl-red" />
                </div>
                <h4 className="font-bold text-sm text-gray-900 mb-1">{inst.name}</h4>
                <p className="text-xs text-gray-500">{inst.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
