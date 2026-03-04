import HeroSection from "../../components/Home/HeroSection";
import HowItWorks from "../../components/Home/HowItWorks";
import Advertisement from "../../components/Home/Advertisement";
import ReportsStats from "./ReportsStats";

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto pt-12 px-4 sm:px-6 lg:px-8 pb-12">
      <Advertisement />
      <HeroSection />
      <ReportsStats />
      <HowItWorks />
    </div>
  );
};

export default Home;
