import React, { useState } from "react";
import { Filter, Eye, EyeOff } from "lucide-react";

// Filter Component
const IncidentFilter = ({ activeFilters, onFilterChange, incidentCounts }) => {
  const [isExpanded, setIsExpanded] = useState(false);

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

  const handleFilterToggle = (incidentType) => {
    const newFilters = activeFilters.includes(incidentType)
      ? activeFilters.filter((f) => f !== incidentType)
      : [...activeFilters, incidentType];
    onFilterChange(newFilters);
  };

  const handleSelectAll = () => {
    onFilterChange(Object.keys(incidentColors));
  };

  const handleSelectNone = () => {
    onFilterChange([]);
  };

  const totalCount = Object.values(incidentCounts).reduce(
    (sum, count) => sum + count,
    0
  );
  const activeCount = Object.keys(incidentCounts)
    .filter((key) => activeFilters.includes(key))
    .reduce((sum, key) => sum + incidentCounts[key], 0);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-6">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Filter Incidents
              </h3>
            </div>
            <div className="text-sm text-gray-500">
              Showing {activeCount} of {totalCount} incidents
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAll}
              className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors font-medium"
            >
              Show All
            </button>
            <button
              onClick={handleSelectNone}
              className="text-xs px-3 py-1 bg-gray-50 text-gray-600 rounded-full hover:bg-gray-100 transition-colors font-medium"
            >
              Hide All
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {isExpanded ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {Object.entries(incidentColors).map(([incidentType, color]) => {
              const isActive = activeFilters.includes(incidentType);
              const count = incidentCounts[incidentType] || 0;

              return (
                <button
                  key={incidentType}
                  onClick={() => handleFilterToggle(incidentType)}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 text-left
                    ${
                      isActive
                        ? "border-gray-300 bg-white shadow-sm"
                        : "border-gray-100 bg-gray-50 opacity-50 hover:opacity-75"
                    }
                  `}
                >
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {incidentType}
                    </div>
                    <div className="text-xs text-gray-500">
                      {count} incident{count !== 1 ? "s" : ""}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {isActive ? (
                      <Eye size={16} className="text-green-500" />
                    ) : (
                      <EyeOff size={16} className="text-gray-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentFilter;