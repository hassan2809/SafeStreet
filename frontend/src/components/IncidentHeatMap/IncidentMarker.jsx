import React from "react";

// Custom Marker Component
const IncidentMarker = ({ incident, color, onClick }) => {
  const date = new Date(incident.date).toLocaleDateString("en-AU");
  const time = new Date(incident.date).toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      onClick={onClick}
      style={{
        position: "absolute",
        transform: "translate(-50%, -50%)",
        cursor: "pointer",
      }}
      title={`${incident.incidentType} - ${date} ${time}`}
    >
      <div
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          backgroundColor: color,
          border: "2px solid #ffffff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
          transition: "transform 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.2)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(1)";
        }}
      />
    </div>
  );
};

export default IncidentMarker;