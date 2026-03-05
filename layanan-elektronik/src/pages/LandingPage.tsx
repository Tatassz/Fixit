import { Navbar } from "@/components/landing/Navbar"
import { HeroSection } from "@/components/landing/HeroSection"
import { StatsSection } from "@/components/landing/StatsSection"
import { FeaturesSection } from "@/components/landing/FeaturesSection"
import { ServicesSection } from "@/components/landing/ServicesSection"
import { TestimonialsSection } from "@/components/landing/TestimonialsSection"
import { CTASection } from "@/components/landing/CTASection"
import { Footer } from "@/components/landing/Footer"

export default function LandingPage() {
    return (
        <div className="min-h-screen">
            <Navbar />
            <HeroSection />
            <StatsSection />
            <FeaturesSection />
            <ServicesSection />
            <TestimonialsSection />
            <CTASection />
            <Footer />
        </div>
    )
}
