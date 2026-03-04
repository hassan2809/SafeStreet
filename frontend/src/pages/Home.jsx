import React, { useEffect, useState } from "react";
import HomeNavbar from "../components/layout/HomeNavbar";
import RoadSafetyHome from "../components/Landing/RoadSafetyHome";
import * as HomeService from "../api/homeService";
import HeroSection from "../components/Landing/HeroSection";
import HowItWorksSection from "../components/Landing/HowItWorksSection";
import BenefitsSection from "../components/Landing/BenefitsSection";
import StatisticsSection from "../components/Landing/StatisticsSection";
import FAQSection from "../components/Landing/FAQSection";
import ContactSection from "../components/Landing/ContactSection";
import Footer from "../components/Landing/Footer";

const Homepage = () => {
  const [stats, setStats] = useState(null);
  const [deathStats, setDeathStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await HomeService.getStatsForHome();
        setStats(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchDeathStats = async () => {
      try {
        const data = await HomeService.getLatestDeathStats();
        setDeathStats(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchDeathStats();
  }, []);

  return (
    <div>
      <HomeNavbar />
      <div className="font-inter text-gray-800 pt-20">
        <HeroSection />
        <HowItWorksSection />
        <div>
          <RoadSafetyHome deathStats={deathStats} />
        </div>
        <BenefitsSection />
        <StatisticsSection stats={stats} />
        <FAQSection />
        <ContactSection />
        <Footer />
      </div>
    </div>
  );
};

export default Homepage;
