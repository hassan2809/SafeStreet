import React, { useState } from "react";

const FAQSection = () => {
  const [activeQuestion, setActiveQuestion] = useState(0);

  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about SafeStreet.
          </p>
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-gray-200">
          <div className="py-6">
            <button
              onClick={() => toggleQuestion(0)}
              className="flex justify-between items-center w-full text-left focus:outline-none"
            >
              <h3 className="text-lg font-medium text-gray-900">
                How does SafeStreet verify reports?
              </h3>
              <span className="ml-6 flex-shrink-0">
                {activeQuestion === 0 ? (
                  <svg
                    className="h-6 w-6 text-indigo-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 text-indigo-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </span>
            </button>
            {activeQuestion === 0 && (
              <div className="mt-3 text-gray-600">
                <p>
                  SafeStreet employs a multi-step verification process.
                  First, all reports are reviewed by our team to ensure they
                  contain accurate and complete information. Reports with
                  submitted media undergo an additional review to verify the
                  incident. We also use pattern recognition algorithms to
                  identify consistent behaviours across multiple reports for
                  the same vehicle registration.
                </p>
              </div>
            )}
          </div>

          <div className="py-6">
            <button
              onClick={() => toggleQuestion(1)}
              className="flex justify-between items-center w-full text-left focus:outline-none"
            >
              <h3 className="text-lg font-medium text-gray-900">
                Is my personal information kept private?
              </h3>
              <span className="ml-6 flex-shrink-0">
                {activeQuestion === 1 ? (
                  <svg
                    className="h-6 w-6 text-indigo-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 text-indigo-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </span>
            </button>
            {activeQuestion === 1 && (
              <div className="mt-3 text-gray-600">
                <p>
                  Yes, SafeStreet takes privacy very seriously. Your
                  personal information is never shared with the reported
                  drivers or made public. When insurance companies access
                  our data, they can only see anonymized report information.
                  All data is handled in accordance with Australian privacy
                  laws and our comprehensive privacy policy.
                </p>
              </div>
            )}
          </div>

          <div className="py-6">
            <button
              onClick={() => toggleQuestion(2)}
              className="flex justify-between items-center w-full text-left focus:outline-none"
            >
              <h3 className="text-lg font-medium text-gray-900">
                How do I receive payment for my media submissions?
              </h3>
              <span className="ml-6 flex-shrink-0">
                {activeQuestion === 2 ? (
                  <svg
                    className="h-6 w-6 text-indigo-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 text-indigo-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </span>
            </button>
            {activeQuestion === 2 && (
              <div className="mt-3 text-gray-600">
                <p>
                  When an insurance company requests access to your media,
                  you'll receive a notification. Once you approve the
                  request, the $100 AUD payment will be processed through
                  your chosen payment method (PayPal or direct deposit).
                  Payments are typically processed within 3-5 business days
                  after approval.
                </p>
              </div>
            )}
          </div>

          <div className="py-6">
            <button
              onClick={() => toggleQuestion(3)}
              className="flex justify-between items-center w-full text-left focus:outline-none"
            >
              <h3 className="text-lg font-medium text-gray-900">
                What types of incidents should I report?
              </h3>
              <span className="ml-6 flex-shrink-0">
                {activeQuestion === 3 ? (
                  <svg
                    className="h-6 w-6 text-indigo-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 text-indigo-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </span>
            </button>
            {activeQuestion === 3 && (
              <div className="mt-3 text-gray-600">
                <p>
                  SafeStreet is designed for reporting unsafe driving
                  behaviours such as speeding, running red lights, reckless
                  driving, tailgating, and other dangerous actions. For
                  emergencies or serious traffic incidents, always contact
                  emergency services (000) first. Our platform is not
                  intended for reporting parking violations or minor
                  infractions.
                </p>
              </div>
            )}
          </div>

          <div className="py-6">
            <button
              onClick={() => toggleQuestion(4)}
              className="flex justify-between items-center w-full text-left focus:outline-none"
            >
              <h3 className="text-lg font-medium text-gray-900">
                How can insurance companies access SafeStreet data?
              </h3>
              <span className="ml-6 flex-shrink-0">
                {activeQuestion === 4 ? (
                  <svg
                    className="h-6 w-6 text-indigo-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 text-indigo-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </span>
            </button>
            {activeQuestion === 4 && (
              <div className="mt-3 text-gray-600">
                <p>
                  Insurance companies can sign up for client accounts
                  through our website. After verification, they gain access
                  to our client portal where they can search for specific
                  vehicle registrations, view report histories, analyse risk
                  patterns, and request access to media evidence. Different
                  subscription levels are available based on data access
                  needs.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;