import HeroSection from "@/components/hero-section"
import AboutSection from "@/components/about-section"
import FeaturesSection from "@/components/features-section"
import ShopSection from "@/components/shop-section"
import FuturePlansSection from "@/components/future-plans-section"
import ContactSection from "@/components/contact-section"

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <ShopSection />
      <FuturePlansSection />
      <ContactSection />
    </div>
  )
}
