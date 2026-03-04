import React from "react";

const StatisticsSection = ({ stats }) => {
  if (!stats) return null;

  return (
    <section className="py-20 bg-indigo-800 text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Making Australian Roads Safer
          </h2>
          <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
            Our platform is driving meaningful change for road safety in
            Australia.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-bold mb-2">
              {stats.totalApprovedReports}
            </div>
            <div className="text-indigo-200">Reports Submitted</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold mb-2">
              {stats.highRiskDrivers.toLocaleString()}
            </div>
            <div className="text-indigo-200">
              High-Risk Drivers Identified
            </div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold mb-2">
              {stats.insurancePartner}
            </div>
            <div className="text-indigo-200">Insurance Partner</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;