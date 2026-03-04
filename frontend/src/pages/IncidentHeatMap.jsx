import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import HomeNavbar from "../components/layout/HomeNavbar";
import API from "../api/axiosConfig";
import IncidentMarker from "../components/IncidentHeatMap/IncidentMarker";
import IncidentFilter from "../components/IncidentHeatMap/IncidentFilter";
import HeatMapHeader from "../components/IncidentHeatMap/HeatMapHeader";
import IncidentDialogs from "../components/IncidentHeatMap/IncidentDialogs";
import HeatMapFooter from "../components/IncidentHeatMap/HeatMapFooter";
import {
  LoadingState,
  ErrorState,
} from "../components/IncidentHeatMap/LoadingErrors";
import { toast } from "react-hot-toast";

const IncidentHeatMap = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [geocodedIncidents, setGeocodedIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [mapsApi, setMapsApi] = useState(null);
  const [activeFilters, setActiveFilters] = useState([]);
  const [incidentCounts, setIncidentCounts] = useState({});
  const [witnessDialogOpen, setWitnessDialogOpen] = useState(false);
  const [witnessInfo, setWitnessInfo] = useState("");
  const [witnessEmail, setWitnessEmail] = useState("");
  const [submittingWitness, setSubmittingWitness] = useState(false);
  const [incidentDialogOpen, setIncidentDialogOpen] = useState(false);

  const incidentColors = {
    Collision: "#DC2626",
    "Excessive Speed": "#EA580C",
    "Road Rage": "#C2410C",
    "Hoon Driving (Including burnouts, racing)": "#7C2D12",
    Tailgating: "#1D4ED8",
    "Dangerous/Reckless Driving": "#7C3AED",
    "Request For Information": "#FFFFFF",
    Other: "#6B7280",
  };

  const getResponsiveZoom = () => {
    const width = window.innerWidth;

    if (width < 640) return 3.5;
    if (width < 768) return 4;
    if (width < 1024) return 4.5;
    return 5;
  };

  const mapDefaultProps = {
    center: {
      lat: -25.2744,
      lng: 133.7751,
    },
    zoom: getResponsiveZoom(),
  };

  const mapOptions = {
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
  };

  // Build address string from database fields
  const buildAddressString = (incident) => {
    const parts = [];
    if (incident.streetNumber) parts.push(incident.streetNumber);
    if (incident.location) parts.push(incident.location);
    if (incident.crossStreet) parts.push(`near ${incident.crossStreet}`);
    if (incident.suburb) parts.push(incident.suburb);
    if (incident.state) parts.push(incident.state);
    parts.push("Australia");
    return parts.join(", ");
  };

  // Geocode address using Google Maps API
  const geocodeAddress = async (addressString, geocoder) => {
    return new Promise((resolve) => {
      geocoder.geocode(
        {
          address: addressString,
          region: "AU",
        },
        (results, status) => {
          if (status === "OK" && results && results.length > 0) {
            const location = results[0].geometry.location;
            resolve({
              lat: location.lat(),
              lng: location.lng(),
            });
          } else {
            console.error(
              "Geocoding failed:",
              status,
              "for address:",
              addressString
            );
            resolve(null);
          }
        }
      );
    });
  };

  // Fetch incidents from API
  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const response = await API.get("/report/reportsForHeatMap", {
        skipAuth: true,
      });

      setIncidents(response.data);

      // Calculate incident counts and set initial filters
      const counts = {};
      response.data.forEach((incident) => {
        const type = incident.incidentType;
        counts[type] = (counts[type] || 0) + 1;
      });
      setIncidentCounts(counts);

      // Initially show all incident types
      setActiveFilters(Object.keys(incidentColors));
    } catch (err) {
      setError("Failed to load incident data");
      console.error("Error fetching incidents:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleWitnessSubmit = async () => {
    if (!witnessInfo.trim() || !selectedIncident) return;

    try {
      setSubmittingWitness(true);
      await API.post(
        `/report/witness/${selectedIncident._id}`,
        {
          info: witnessInfo.trim(),
          contactEmail: witnessEmail.trim() || null,
        },
        {
          skipAuth: true,
        }
      );

      setWitnessDialogOpen(false);
      setWitnessInfo("");
      setWitnessEmail("");
      toast.success(
        "Thank you! Your witness information has been submitted anonymously."
      );
    } catch (error) {
      console.error("Error submitting witness info:", error);
      toast.error("Failed to submit witness information. Please try again.");
    } finally {
      setSubmittingWitness(false);
    }
  };

  // Handle Google Maps API loaded
  const handleApiLoaded = ({ map, maps }) => {
    setMapsApi({ map, maps });
  };

  // Geocode all incidents when maps API is loaded
  useEffect(() => {
    const geocodeAllIncidents = async () => {
      if (!mapsApi || incidents.length === 0) return;

      const geocoder = new mapsApi.maps.Geocoder();
      const geocoded = [];

      for (const incident of incidents) {
        const addressString = buildAddressString(incident);
        const coordinates = await geocodeAddress(addressString, geocoder);

        if (coordinates) {
          geocoded.push({
            ...incident,
            ...coordinates,
            addressString,
            color:
              incidentColors[incident.incidentType] || incidentColors["Other"],
          });
        }
      }

      setGeocodedIncidents(geocoded);
    };

    geocodeAllIncidents();
  }, [mapsApi, incidents]);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleMarkerClick = (incident) => {
    setSelectedIncident(incident);
    setIncidentDialogOpen(true);
  };

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
    if (
      selectedIncident &&
      !newFilters.includes(selectedIncident.incidentType)
    ) {
      setSelectedIncident(null);
      setIncidentDialogOpen(false);
    }
  };

  // Filter incidents based on active filters
  const filteredIncidents = geocodedIncidents.filter((incident) =>
    activeFilters.includes(incident.incidentType)
  );

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <div>
      <HomeNavbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <HeatMapHeader />

        {/* Filter and Map Section */}
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Filter Component */}
            <IncidentFilter
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              incidentCounts={incidentCounts}
            />

            {/* Map */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b bg-gray-50">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="mb-4 lg:mb-0">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Interactive Map
                    </h3>
                    <p className="text-gray-600">
                      Click on markers for detailed incident information
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {filteredIncidents.length} incidents plotted
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="w-full h-[600px] lg:h-[700px]">
                  <GoogleMapReact
                    bootstrapURLKeys={{
                      key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
                    }}
                    defaultCenter={mapDefaultProps.center}
                    defaultZoom={mapDefaultProps.zoom}
                    options={mapOptions}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={handleApiLoaded}
                  >
                    {filteredIncidents.map((incident, index) => (
                      <IncidentMarker
                        key={`${incident._id}-${index}`}
                        lat={incident.lat}
                        lng={incident.lng}
                        incident={incident}
                        color={incident.color}
                        onClick={() => handleMarkerClick(incident)}
                      />
                    ))}
                  </GoogleMapReact>

                  <IncidentDialogs
                    witnessDialogOpen={witnessDialogOpen}
                    setWitnessDialogOpen={setWitnessDialogOpen}
                    witnessInfo={witnessInfo}
                    setWitnessInfo={setWitnessInfo}
                    witnessEmail={witnessEmail}
                    setWitnessEmail={setWitnessEmail}
                    submittingWitness={submittingWitness}
                    handleWitnessSubmit={handleWitnessSubmit}
                    incidentDialogOpen={incidentDialogOpen}
                    setIncidentDialogOpen={setIncidentDialogOpen}
                    selectedIncident={selectedIncident}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <HeatMapFooter />
      </div>
    </div>
  );
};

export default IncidentHeatMap;
