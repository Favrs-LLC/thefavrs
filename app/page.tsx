import { Navigation } from '@/components/Navigation'
import { HeroSection } from '@/components/HeroSection'
import { ServicesSection } from '@/components/ServicesSection'
import { TeamSection } from '@/components/TeamSection'
import { ContactSection } from '@/components/ContactSection'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-100">
      <Navigation />
      <main>
        <HeroSection />
        <ServicesSection />
        <TeamSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}