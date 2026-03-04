import React from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Report unsafe driving and make Australian roads safer
            </h1>
            <p className="text-xl mb-8 text-indigo-100 md:mr-4">
              SafeStreet empowers everyday Australians to report at-risk
              driving behaviours and contribute to safer roads for everyone.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/report"
                className="bg-white text-indigo-700 hover:bg-indigo-50 px-6 py-3 rounded-md font-semibold shadow-md text-center transition"
              >
                Report an Incident
              </Link>
              <Link
                to="/signup"
                className="bg-transparent hover:bg-indigo-700 border-2 border-white px-6 py-3 rounded-md font-semibold text-center transition"
              >
                Create Account
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <video
              src="/images/homePageVideo.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="rounded-lg shadow-xl w-full h-full object-cover"
            >
              <source src="/images/homePageVideo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;