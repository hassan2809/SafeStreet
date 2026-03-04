import { Lightbulb } from "lucide-react";
import React from "react";

const HeatMapFooter = () => {
  return (
    <div className="bg-white border-t">
      <div className="container mx-auto px-6 py-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex">
            <Lightbulb className="w-20 md:w-10 h-5 text-yellow-500" />
            <p className="text-gray-600">
              <strong>How to use:</strong> Use the filter controls above to
              show/hide specific incident types. Click on any colored marker to
              view detailed information. Zoom in to explore specific
              neighborhoods and zoom out for broader regional patterns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatMapFooter;
