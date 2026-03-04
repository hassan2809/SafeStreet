import { useEffect } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, ChevronRight } from "lucide-react";

const HeroSection = () => {
  const user = useAuthStore((state) => state.user);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <div className="w-full py-6">
      <Card className="relative overflow-hidden rounded-2xl border-none shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-90"></div>

        {/* Background pattern */}
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>

        <div className="relative z-10 px-6 py-12 sm:px-12 lg:flex lg:items-center lg:gap-x-10">
          <div className="mx-auto lg:mx-0 lg:flex-auto lg:text-left text-center">
            {/* User greeting with subtle animation */}
            <div className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-sm">
              <Sparkles className="mr-2 h-4 w-4 text-yellow-300" />
              <span>
                {user
                  ? `Welcome back, ${user.fullName}`
                  : "Make our roads safer"}
              </span>
            </div>

            {/* Main heading with gradient text */}
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {user
                ? "Ready to make a difference today?"
                : "Report Unsafe Driving. Save Lives."}
            </h1>

            <p className="mt-6 text-lg text-white/80 max-w-xl mx-auto lg:mx-0">
              Use SafeStreet.com.au to report dangerous, reckless or unsafe
              driving you have witnessed with just a few clicks. Your reports
              help contribute to improved road safety outcomes for all road
              users across Australia.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 lg:justify-start">
              <Button
                asChild
                size="lg"
                className="bg-white text-indigo-600 hover:bg-gray-200 text-xl font-sans font-semibold rounded-full px-8"
              >
                <Link to="/report">Report Now</Link>
              </Button>
            </div>
          </div>

          <div className="relative aspect-video overflow-hidden mt-8 lg:mt-0 rounded-2xl shadow-xl w-full max-w-xl mx-auto">
            <video
              src="/images/homePageVideo.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HeroSection;
