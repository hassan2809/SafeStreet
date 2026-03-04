import React from "react";

const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            How SafeStreet Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our platform enables you to report dangerous driving behaviours
            in just a few simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-indigo-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
              <span className="text-indigo-600 text-2xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Observe Incident</h3>
            <p className="text-gray-600">
              Witness unsafe driving behaviour or an at-risk situation on
              Australian roads, and optionally capture it with dashcam
              footage.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-indigo-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
              <span className="text-indigo-600 text-2xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Submit Report</h3>
            <p className="text-gray-600">
              Enter vehicle registration, incident details, date, time and
              location through our secure form.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-indigo-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
              <span className="text-indigo-600 text-2xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Data Analysis</h3>
            <p className="text-gray-600">
              Reports are verified and analysed to identify patterns and
              high-risk drivers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-indigo-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
              <span className="text-indigo-600 text-2xl font-bold">4</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Safety Impact</h3>
            <p className="text-gray-600">
              Insurance companies access the data for risk assessment,
              improving road safety for all.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;