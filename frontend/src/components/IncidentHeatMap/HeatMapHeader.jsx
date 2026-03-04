import React from "react";

const HeatMapHeader = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Road Safety Heat Map
          </h1>
          <p className="text-xl text-blue-100 mb-3">
            Live visualization of reported incidents across Australia
          </p>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto">
            Track dangerous driving patterns and road safety issues in
            real-time. Each marker represents a verified incident report
            from our community.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeatMapHeader;