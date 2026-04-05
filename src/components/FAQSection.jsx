import { useState } from 'react'
import { faq } from '../data/admissionData'
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react'

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-red-50 text-cupl-red text-sm font-medium rounded-full mb-4">常见问题</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            考研 <span className="text-cupl-red">FAQ</span>
          </h2>
          <p className="text-gray-600">汇集最常见的考研疑问，帮你快速找到答案</p>
        </div>

        <div className="space-y-3">
          {faq.map((item, i) => (
            <div
              key={i}
              className={`bg-white rounded-xl border transition-all ${
                openIndex === i ? 'border-cupl-red/30 shadow-md' : 'border-gray-100 shadow-sm'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                className="w-full flex items-start gap-4 p-5 text-left"
              >
                <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                  openIndex === i ? 'bg-cupl-red text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold text-sm ${openIndex === i ? 'text-cupl-red' : 'text-gray-900'}`}>
                    {item.q}
                  </h3>
                </div>
                <ChevronDown className={`w-5 h-5 shrink-0 text-gray-400 transition-transform ${
                  openIndex === i ? 'rotate-180' : ''
                }`} />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5 pl-17 animate-fade-in-up">
                  <div className="pl-12 border-l-2 border-cupl-gold/30">
                    <p className="text-sm text-gray-700 leading-relaxed">{item.a}</p>
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
