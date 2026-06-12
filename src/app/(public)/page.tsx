import { HeroSection } from '@/components/home/HeroSection'
import { StatsBar } from '@/components/home/StatsBar'
import { FeaturedProjects } from '@/components/home/FeaturedProjects'
import { LatestPosts } from '@/components/home/LatestPosts'
import { SkillsSection } from '@/components/home/SkillsSection'
import { Testimonials } from '@/components/home/Testimonials'
import { CTASection } from '@/components/home/CTASection'
import { NewsletterSignup } from '@/components/home/NewsletterSignup'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <FeaturedProjects />
      <SkillsSection />
      <LatestPosts />
      <Testimonials />
      <CTASection />
      <NewsletterSignup />
    </>
  )
}
