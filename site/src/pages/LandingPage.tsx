import React from "react";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import MarqueeTape from "../components/landing/MarqueeTape";
import StatsBar from "../components/landing/StatsBar";
import Features from "../components/landing/Features";
import PartnersBar from "../components/landing/PartnersBar";
import Pricing from "../components/landing/Pricing";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="font-sans text-brand-navy bg-brand-bg" dir="rtl">
      <Navbar />
      <main>
        <Hero />
        <MarqueeTape />
        <StatsBar />

        {/* Wave divider before Features */}
        <div className="wave-separator bg-brand-bg">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 30C240 60 480 0 720 30C960 60 1200 0 1440 30V60H0V30Z" fill="white" />
          </svg>
        </div>

        <Features />
        <PartnersBar />

        {/* Wave divider before Pricing */}
        <div className="wave-separator bg-white">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 30C360 0 720 60 1080 30C1260 15 1380 40 1440 30V60H0V30Z" fill="#F8FAFC" />
          </svg>
        </div>

        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}