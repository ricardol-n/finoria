
import Hero from "../components/Hero/Hero";
import InvestSection from "../components/InvestSection";
import Features from "../components/Features/Features";
import Stats from "../components/Stats/Stats";
import Testimonials from "../components/Testimonials/Testimonials";
import FinalCTA from "../components/FinalCTA/FinalCTA";
import Footer from "../components/Footer/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <InvestSection />
      <Features />
      <Stats />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </>
  );
}