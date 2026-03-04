import Footer from "../components/Landing/Footer";
import HomeNavbar from "../components/layout/HomeNavbar";

const TermsAndConditions = () => {
  return (
    <div>
      <HomeNavbar />
      <div className="font-inter text-gray-800 pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Terms & Conditions
              </h1>
              <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
                Please read these terms and conditions carefully before using the SafeStreet platform.
              </p>
              <div className="mt-8 text-indigo-200">
                <p className="text-lg">Effective Date: 30/08/2025</p>
              </div>
            </div>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 md:p-12">
              
              {/* Introduction */}
              <div className="mb-12">
                <p className="text-lg text-gray-700 leading-relaxed">
                  These Terms & Conditions ("Terms") govern your use of the Safe Street platform, including the website, mobile application, and related services (together, the "Platform"). By accessing or using the Platform, you agree to be bound by these Terms.
                </p>
              </div>

              {/* Section 1 */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-indigo-200">
                  1. Definitions
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p><span className="font-semibold">"Safe Street" / "We" / "Us" / "Our"</span> – Safe Street AU Pty Ltd (ABN: [Insert ABN])</p>
                  <p><span className="font-semibold">"User" / "You" / "Your"</span> – any individual who accesses, registers, or uses the Platform</p>
                  <p><span className="font-semibold">"Registered Partners"</span> – insurance companies, law enforcement agencies, legal firms, and other authorised entities with whom Safe Street has agreements</p>
                  <p><span className="font-semibold">"Content"</span> – any information, report, or media (including dash cam footage) submitted by users to the Platform</p>
                </div>
              </div>

              {/* Section 2 */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-indigo-200">
                  2. Use of the Platform
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>The Platform allows users to report at-risk driver behaviour and incidents, including collisions, vehicle damage, and other road safety concerns.</p>
                  <p>Users may submit written reports and may indicate whether dash cam or other media exists.</p>
                  <p>The Platform does not permit direct upload of digital media. Instead, users will be contacted if footage is requested by a Registered Partner.</p>
                </div>
              </div>

              {/* Section 3 */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-indigo-200">
                  3. Privacy Policy
                </h2>
                <div className="space-y-4 text-gray-700">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Data Collection</h3>
                    <p>We collect and store information that you provide, including your name, contact details, reports, and bank details (for reward payments).</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Data Sharing</h3>
                    <p>Safe Street AU Pty Ltd will only share user details with Registered Partners, including but not limited to:</p>
                    <ul className="list-disc ml-6 mt-2 space-y-1">
                      <li>Insurance Companies</li>
                      <li>Law Enforcement Agencies</li>
                      <li>Legal Firms (under lawful request)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Bank Details</h3>
                    <p>Your uploaded banking information will be used solely for reward payment purposes and will never be shared outside Safe Street AU Pty Ltd.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Data Security</h3>
                    <p>We use industry-standard safeguards to protect user data but cannot guarantee absolute protection against unauthorised access.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Retention</h3>
                    <p>Reports and associated user details may be retained for as long as required to fulfil business, legal, or regulatory purposes.</p>
                  </div>
                </div>
              </div>

              {/* Section 4 */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-indigo-200">
                  4. Rewards for Media Provision
                </h2>
                <div className="bg-indigo-50 p-6 rounded-lg mb-4">
                  <p className="text-gray-700 font-medium mb-3">If dash cam footage is requested, received, and approved by Safe Street:</p>
                  <ul className="list-disc ml-6 space-y-2 text-gray-700">
                    <li>The user will be entitled to a monetary reward of <span className="font-semibold text-indigo-700">$50 – $100 AUD</span>, depending on the request.</li>
                    <li>Payment will be made within <span className="font-semibold">45 days</span> of the date the footage is received and approved.</li>
                    <li>Payment will be made via the bank details supplied by the user on the Platform.</li>
                  </ul>
                </div>
                <p className="text-gray-700">
                  Users are responsible for ensuring the accuracy of their bank details. Safe Street will not be liable for misdirected payments caused by incorrect information provided by the user.
                </p>
              </div>

              {/* Section 5 */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-indigo-200">
                  5. User Responsibilities
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>You agree that any reports or content you submit are truthful and accurate to the best of your knowledge.</p>
                  <p>You must not knowingly submit false or misleading reports.</p>
                  <p>You agree not to use the Platform for unlawful purposes, harassment, or malicious targeting of individuals.</p>
                  <p>You are responsible for maintaining the confidentiality of your login credentials.</p>
                </div>
              </div>

              {/* Section 6 */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-indigo-200">
                  6. Intellectual Property
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>All intellectual property related to the Platform, including its design, branding, and systems, is owned by Safe Street AU Pty Ltd.</p>
                  <p>By submitting reports or media, you grant Safe Street a limited, transferable licence to use, process, and share that content with Registered Partners for commercial and investigative purposes.</p>
                </div>
              </div>

              {/* Section 7 */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-indigo-200">
                  7. Liability
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>Safe Street AU Pty Ltd provides the Platform "as is" and makes no guarantees regarding uninterrupted service or absolute accuracy of reports.</p>
                  <p>We are not responsible for the outcome of investigations, insurance claims, or enforcement actions that rely on user reports or submitted media.</p>
                  <p>To the extent permitted by law, Safe Street AU Pty Ltd disclaims all liability for indirect, consequential, or incidental losses arising from use of the Platform.</p>
                </div>
              </div>

              {/* Section 8 */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-indigo-200">
                  8. Termination
                </h2>
                <p className="text-gray-700">
                  We reserve the right to suspend or terminate user accounts that breach these Terms, submit fraudulent reports, or misuse the Platform.
                </p>
              </div>

              {/* Section 9 */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-indigo-200">
                  9. Governing Law
                </h2>
                <p className="text-gray-700">
                  These Terms shall be governed by and construed under the laws of Victoria, Australia. Any disputes shall be subject to the exclusive jurisdiction of Victorian courts.
                </p>
              </div>

              {/* Section 10 */}
              <div className="">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-indigo-200">
                  10. Amendments
                </h2>
                <p className="text-gray-700">
                  Safe Street AU Pty Ltd reserves the right to amend these Terms at any time. Users will be notified of material changes via email or platform notification. Continued use of the Platform after such changes constitutes acceptance of the updated Terms.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    </div>
  );
};

export default TermsAndConditions;