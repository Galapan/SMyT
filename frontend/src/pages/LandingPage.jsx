import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import ModulesSection from "../components/landing/ModulesSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import RolesSection from "../components/landing/RolesSection";
import TechStackSection from "../components/landing/TechStackSection";
import CTASection from "../components/landing/CTASection";
import Footer from "../components/landing/Footer";

export default function LandingPage() {
  return (
    <div
      id="scroll-container"
      className="h-dvh w-full overflow-y-auto overflow-x-hidden scroll-smooth bg-white"
    >
      <Navbar />
      <main>
        <HeroSection />
        <ModulesSection />
        <FeaturesSection />
        <RolesSection />
        <TechStackSection />
        <div className="min-h-screen flex flex-col w-full">
          <CTASection />
          <Footer />
        </div>
      </main>
    </div>
  );
}
