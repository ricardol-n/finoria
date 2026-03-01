
import Hero from "../components/Hero/Hero";
import InvestSection from "../components/InvestSection";
import Features from "../components/Features/Features";
import Stats from "../components/Stats/Stats";
import Testimonials from "../components/Testimonials/Testimonials";
import FinalCTA from "../components/FinalCTA/FinalCTA";
import Footer from "../components/Footer/Footer";
import MarketTrends from "../components/MarketTrends/MarketTrends";

export default function Home() {
  return (
    <>
      <Hero />
      <InvestSection />
      <MarketTrends />
      <Features />
      <Stats />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </>
  );
}