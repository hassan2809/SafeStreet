import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlarmClock, FileText, BarChart4, Shield, Sparkles, ArrowRight } from "lucide-react";

const HowItWorks = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: <FileText size={30} className="text-indigo-500" />,
      title: "Submit a Report",
      description: "Quickly report unsafe driving by entering vehicle details, incident type, time, and location.",
      color: "bg-indigo-50 border-indigo-100",
    },
    {
      icon: <BarChart4 size={30} className="text-amber-500" />,
      title: "Data Analysis",
      description: "Our system analyses patterns and shares anonymized risk data with insurance companies.",
      color: "bg-amber-50 border-amber-100",
    },
    {
      icon: <Shield size={30} className="text-emerald-500" />,
      title: "Impact & Rewards",
      description: "Help improve road safety and earn points that can be redeemed for rewards.",
      color: "bg-emerald-50 border-emerald-100",
    },
    {
      icon: <AlarmClock size={30} className="text-rose-500" />,
      title: "Real-time Updates",
      description: "Receive notifications on the status of your reports and their impact on safety.",
      color: "bg-rose-50 border-rose-100",
    },
  ];

  return (
    <section className="py-10" id="how-it-works">
      <div className="space-y-8">
        {/* Section Header with Gradient Badge */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center">
            <div className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
              <Sparkles className="mr-1 h-3.5 w-3.5 text-indigo-500" />
              <span>How it works</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Driving Change, One Report at a Time</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Our platform makes it easy to report unsafe driving behavior and contribute to safer roads for everyone.
          </p>
        </div>
        
        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card 
              key={index} 
              className={`overflow-hidden transition-all duration-300 hover:shadow-md ${step.color}`}
            >
              <div className="p-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-white shadow-sm mb-4">
                  {step.icon}
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
                <span className="flex mt-4 items-center text-xs font-semibold text-gray-400">
                  STEP {index + 1}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;