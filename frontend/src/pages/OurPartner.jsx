import React from 'react'
import HomeNavbar from '../components/layout/HomeNavbar'
import Footer from '../components/Landing/Footer'

const OurPartner = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <HomeNavbar />
      
      {/* Coming Soon Content */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 pt-20">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Icon/Illustration */}
          <div className="my-8">
            <div className="mx-auto w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Our <span className="text-indigo-600">Partners</span>
          </h1>
          
          {/* Subheading */}
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">
            Coming Soon
          </h2>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            We're working with amazing partners to bring you the best road safety solutions. 
            This page will showcase our trusted collaborators and sponsors who share our vision 
            of making every journey a safe one.
          </p>
          
          {/* Features Preview */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Government Partners</h3>
              <p className="text-gray-600 text-sm">Official collaborations with transport authorities</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Safety Organizations</h3>
              <p className="text-gray-600 text-sm">Leading road safety advocacy groups</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Technology Partners</h3>
              <p className="text-gray-600 text-sm">Innovative tech companies driving safety forward</p>
            </div>
          </div>
          
          {/* Coming Soon Badge */}
          <div className="my-12">
            <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Launch Expected Q3 2025
            </div>
          </div>
          
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default OurPartner