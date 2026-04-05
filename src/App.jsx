import { useState, useEffect } from 'react'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import OverviewSection from './components/OverviewSection'
import AdmissionSection from './components/AdmissionSection'
import DataSection from './components/DataSection'
import AdvisorsSection from './components/AdvisorsSection'
import ResourcesSection from './components/ResourcesSection'
import NewsFeedSection from './components/NewsFeedSection'
import FAQSection from './components/FAQSection'
import Footer from './components/Footer'

function App() {
  const [activeSection, setActiveSection] = useState('home')

  const handleNavigate = (sectionId) => {
    setActiveSection(sectionId)
    const el = document.getElementById(sectionId)
    if (el) {
      const offset = 80 // header height
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  // Track scroll position to highlight active nav item
  useEffect(() => {
    const sections = ['home', 'overview', 'admission', 'data', 'advisors', 'resources', 'news', 'faq']
    const handleScroll = () => {
      const scrollPos = window.scrollY + 120
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i])
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Header activeSection={activeSection} onNavigate={handleNavigate} />
      <main>
        <HeroSection onNavigate={handleNavigate} />
        <OverviewSection />
        <AdmissionSection />
        <DataSection />
        <AdvisorsSection />
        <ResourcesSection />
        <NewsFeedSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  )
}

export default App
