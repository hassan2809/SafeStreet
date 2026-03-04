import { useState, useEffect } from "react";

// This is a simplified mockup of a map component
// In a real application, you would use a mapping library like Mapbox, Google Maps, or Leaflet
const MapView = ({ reports, height = 400 }) => {
  const [mapReady, setMapReady] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  
  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapReady(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Process reports to get map markers
  const getMapMarkers = () => {
    return reports.map(report => ({
      id: report._id,
      vehicle: report.vehicleRegistration,
      incidentType: report.incidentType,
      date: new Date(report.date).toLocaleDateString(),
      // Simulated coordinates - in a real app these would come from geocoding the location
      position: {
        x: Math.random() * 100,
        y: Math.random() * 100
      }
    }));
  };
  
  const markers = getMapMarkers();
  
  // Marker color based on incident type
  const getMarkerColor = (incidentType) => {
    switch (incidentType) {
      case "Speeding":
        return "bg-red-500";
      case "Running Red Light":
        return "bg-yellow-500";
      case "Reckless Driving":
        return "bg-purple-500";
      case "Tailgating":
        return "bg-orange-500";
      default:
        return "bg-blue-500";
    }
  };

  // Handle marker click
  const handleMarkerClick = (marker) => {
    setSelectedReport(marker);
  };

  return (
    <div 
      className="bg-gray-100 rounded-lg shadow overflow-hidden relative"
      style={{ height: `${height}px` }}
    >
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
            
            {/* City names - simulate map labels */}
            <div className="absolute text-xs text-gray-600 font-medium" style={{ left: '15%', top: '25%' }}>Sydney</div>
            <div className="absolute text-xs text-gray-600 font-medium" style={{ left: '45%', top: '35%' }}>Canberra</div>
            <div className="absolute text-xs text-gray-600 font-medium" style={{ left: '80%', top: '45%' }}>Melbourne</div>
            <div className="absolute text-xs text-gray-600 font-medium" style={{ left: '20%', top: '55%' }}>Adelaide</div>
            <div className="absolute text-xs text-gray-600 font-medium" style={{ left: '65%', top: '70%' }}>Brisbane</div>
            <div className="absolute text-xs text-gray-600 font-medium" style={{ left: '35%', top: '85%' }}>Perth</div>
          </div>
          
          {/* Map Markers */}
          {markers.map((marker) => (
            <div
              key={marker.id}
              className={`absolute cursor-pointer ${getMarkerColor(marker.incidentType)} w-5 h-5 rounded-full border-2 border-white shadow-md transition transform hover:scale-125`}
              style={{
                left: `${marker.position.x}%`,
                top: `${marker.position.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              title={`${marker.vehicle}: ${marker.incidentType}`}
              onClick={() => handleMarkerClick(marker)}
            ></div>
          ))}
          
          {/* Selected Marker Info */}
          {selectedReport && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-lg shadow-lg max-w-sm">
              <button 
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setSelectedReport(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h4 className="font-medium text-gray-900">{selectedReport.vehicle}</h4>
              <div className="mt-1 flex items-center">
                <div className={`w-3 h-3 rounded-full ${getMarkerColor(selectedReport.incidentType)} mr-2`}></div>
                <span className="text-sm">{selectedReport.incidentType}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{selectedReport.date}</p>
              <div className="mt-2 flex justify-end">
                <button className="text-xs text-blue-600 hover:text-blue-800">
                  View Details
                </button>
              </div>
            </div>
          )}
          
          {/* Map Legend */}
          <div className="absolute top-3 right-3 bg-white p-2 rounded shadow-md text-xs">
            <div className="mb-1 font-medium text-gray-700">Incident Types</div>
            <div className="space-y-1">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span>Speeding</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <span>Running Red Light</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                <span>Reckless Driving</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                <span>Tailgating</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span>Other</span>
              </div>
            </div>
          </div>
          
          {/* Map Controls (simplified) */}
          <div className="absolute top-3 left-3 flex flex-col space-y-2">
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
          Note: This is a simulated map view. <br />
          In production, integrate with a mapping API.
        </div>
      </div>
    </div>
  );
};

export default MapView;