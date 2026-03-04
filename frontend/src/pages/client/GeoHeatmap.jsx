import { useState, useEffect } from "react";

// This is a simplified version of a geographic heatmap
// In a real application, you would use a mapping library like Mapbox, Google Maps, or Leaflet
const GeoHeatmap = ({ reports }) => {
  const [mapReady, setMapReady] = useState(false);
  
  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapReady(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // In a real app, this would process location data from reports
  // to generate heatmap data points
  const processMapData = () => {
    // Group reports by location
    const locationGroups = reports.reduce((acc, report) => {
      const location = report.location;
      if (!acc[location]) {
        acc[location] = [];
      }
      acc[location].push(report);
      return acc;
    }, {});
    
    // Transform to an array of location data points
    return Object.keys(locationGroups).map(location => ({
      location,
      count: locationGroups[location].length,
      // Simulated coordinates - in a real app these would come from geocoding the location
      position: {
        x: Math.random() * 100,
        y: Math.random() * 100
      },
      // Calculate intensity level (1-5) based on count
      intensity: Math.min(5, Math.ceil(locationGroups[location].length / 2))
    }));
  };
  
  const mapData = processMapData();
  
  // Color function for heatmap points
  const getIntensityColor = (intensity) => {
    const colors = [
      'bg-blue-200',
      'bg-blue-300',
      'bg-blue-400',
      'bg-blue-500',
      'bg-blue-600'
    ];
    return colors[intensity - 1] || colors[0];
  };
  
  // Size function for heatmap points
  const getPointSize = (intensity) => {
    const sizes = [
      'w-4 h-4',
      'w-5 h-5',
      'w-6 h-6',
      'w-7 h-7',
      'w-8 h-8'
    ];
    return sizes[intensity - 1] || sizes[0];
  };

  return (
    <div className="bg-gray-100 rounded-lg h-72 relative overflow-hidden">
      {!mapReady ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Map Background - In a real app, this would be an actual map */}
          <div className="absolute inset-0 bg-gray-200">
            {/* Map grid lines */}
            <div className="grid grid-cols-10 h-full">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="border-r border-gray-300 h-full"></div>
              ))}
            </div>
            <div className="grid grid-rows-10 absolute inset-0">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="border-b border-gray-300 w-full"></div>
              ))}
            </div>
          </div>
          
          {/* Heatmap Points */}
          {mapData.map((point, index) => (
            <div
              key={index}
              className={`absolute rounded-full ${getPointSize(point.intensity)} ${getIntensityColor(point.intensity)} opacity-70`}
              style={{
                left: `${point.position.x}%`,
                top: `${point.position.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              title={`${point.location}: ${point.count} incidents`}
            ></div>
          ))}
          
          {/* Map Legend */}
          <div className="absolute bottom-3 right-3 bg-white p-2 rounded shadow-md text-xs">
            <div className="mb-1 font-medium text-gray-700">Incident Density</div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-blue-200"></div>
              <span>Low</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-blue-400"></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <span>High</span>
            </div>
          </div>
          
          {/* Map Controls (simplified) */}
          <div className="absolute top-3 right-3 flex flex-col space-y-2">
            <button className="w-8 h-8 bg-white rounded-md shadow flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <button className="w-8 h-8 bg-white rounded-md shadow flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
          </div>
        </>
      )}
      
      {/* Explanation for demo purposes */}
      <div className="absolute bottom-3 left-3 bg-white p-2 rounded shadow-md text-xs">
        <div className="text-gray-700">
          Note: This is a simulated heatmap. <br />
          In production, integrate with a mapping API.
        </div>
      </div>
    </div>
  );
};

export default GeoHeatmap;