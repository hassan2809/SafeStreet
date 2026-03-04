import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';

const PDFExport = {
  downloadReportAsPDF: (report) => {
    const doc = new jsPDF();
    
    // Get the vehicle data from the first vehicle in the array
    const vehicleData = report.vehicles && report.vehicles.length > 0 ? report.vehicles[0] : {};
    
    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("SafeStreet.com.au Incident Report", 105, 20, null, null, "center");
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Report ID: ${report._id}`, 15, 35);
    doc.text(`Date: ${new Date(report.date).toLocaleDateString()}`, 15, 45);

    // Reporter Information
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Reporter Information", 15, 60);
    
    autoTable(doc, {
      startY: 65,
      head: [["Field", "Details"]],
      body: [
        ["Name", report.name || "N/A"],
        ["Email", report.email || "N/A"],
        ["Phone", report.phone || "N/A"]
      ],
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [79, 70, 229] }
    });

    // Incident Details
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Incident Details", 15, doc.lastAutoTable.finalY + 15);
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [["Field", "Details"]],
      body: [
        ["Incident Type", report.incidentType || "N/A"],
        ["Vehicle Type", report.vehicleType || "N/A"],
        ["Date Reported", new Date(report.date).toLocaleDateString()],
        ["Time Reported", new Date(report.date).toLocaleTimeString()],
        ["Status", report.status ? report.status.toUpperCase() : "PENDING"]
      ],
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [79, 70, 229] }
    });

    // Location Information
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Location Information", 15, doc.lastAutoTable.finalY + 15);
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [["Field", "Details"]],
      body: [
        ["Street", report.location || "N/A"],
        ["Cross Street", report.crossStreet || "N/A"],
        ["Suburb", report.suburb || "N/A"],
        ["State", report.state || "N/A"]
      ],
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [79, 70, 229] }
    });

    // Vehicle Information
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Vehicle Information", 15, doc.lastAutoTable.finalY + 15);
    
    // Prepare vehicle data rows based on first vehicle in array
    const vehicleRows = [
      ["Registration", vehicleData.registration || "N/A"],
      ["Registration State", vehicleData.registrationState || "N/A"],
      ["Make", vehicleData.make || "N/A"],
      ["Model", vehicleData.model || "N/A"],
      ["Body Type", vehicleData.bodyType || "N/A"],
      ["Registration Visible", vehicleData.isRegistrationVisible || "N/A"]
    ];
    
    // Only add identifying features if not empty
    if (vehicleData.identifyingFeatures) {
      vehicleRows.push(["Identifying Features", vehicleData.identifyingFeatures]);
    }
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [["Field", "Details"]],
      body: vehicleRows,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [79, 70, 229] }
    });

    // Dashcam Information
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Dashcam Information", 15, doc.lastAutoTable.finalY + 15);
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [["Field", "Details"]],
      body: [
        ["Dashcam Footage Saved", report.hasDashcam ? "Yes" : "No"],
        ["Audio Available", report.hasAudio ? "Yes" : "No"],
        ["Can Provide Footage", report.canProvideFootage ? "Yes" : "No"],
        ["Media Flag", report.mediaFlag ? "Yes" : "No"]
      ],
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [79, 70, 229] }
    });

    // Description (if provided)
    if (report.description) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Incident Description", 15, doc.lastAutoTable.finalY + 15);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      
      // Use a text box to handle long descriptions with word wrap
      const splitDescription = doc.splitTextToSize(report.description, 180);
      doc.text(splitDescription, 15, doc.lastAutoTable.finalY + 25);
    }

    // Risk Assessment
    let riskScore = 0;
    const incidentWeights = {
      "Speeding": 8,
      "Running Red Light": 9,
      "Reckless Driving": 10,
      "Tailgating": 7,
      "Other": 5
    };
    
    const baseScore = incidentWeights[report.incidentType] || 5;
    const mediaBonus = report.mediaFlag ? 2 : 0;
    const dashcamBonus = report.hasDashcam ? 1 : 0;
    riskScore = Math.min(10, baseScore + mediaBonus + dashcamBonus);

    // Add a page if we're near the bottom
    if (doc.lastAutoTable && doc.lastAutoTable.finalY > 240) {
      doc.addPage();
    }

    const riskY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 25 : 220;
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Risk Assessment", 15, riskY);
    
    autoTable(doc, {
      startY: riskY + 10,
      body: [
        ["Risk Score", `${riskScore.toFixed(1)} / 10`],
        ["Risk Level", riskScore >= 8 ? "High" : riskScore >= 6 ? "Medium" : "Low"],
        ["Safety Impact", riskScore >= 8 ? "Significant" : riskScore >= 6 ? "Moderate" : "Minimal"]
      ],
      theme: "plain",
      styles: { fontSize: 10 }
    });

    // Metadata and timestamps
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    
    // Add a page if we're near the bottom
    if (doc.lastAutoTable && doc.lastAutoTable.finalY > 260) {
      doc.addPage();
    }
    
    const metaY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 240;
    
    doc.text(`Report submitted on: ${new Date(report.createdAt).toLocaleString()}`, 15, metaY);
    if (report.updatedAt) {
      doc.text(`Last updated on: ${new Date(report.updatedAt).toLocaleString()}`, 15, metaY + 5);
    }

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(
        `Generated by SafeStreet.com.au - Page ${i} of ${pageCount}`,
        105,
        doc.internal.pageSize.height - 10,
        null,
        null,
        "center"
      );
      doc.text(
        `Confidential - For authorized use only`,
        105,
        doc.internal.pageSize.height - 5,
        null,
        null,
        "center"
      );
    }

    // Determine filename using vehicle registration if available
    const vehicleReg = vehicleData.registration || "Unknown";
    doc.save(`SafeStreet_Report_${vehicleReg}_${report._id.substring(0, 8)}.pdf`);
  },
  
  exportAnalytics: (reports, format = "pdf") => {
    if (format !== "pdf") {
      console.error("Only PDF export is implemented in this demo");
      return;
    }
    
    const doc = new jsPDF();
    
    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("SafeStreet Analytics Report", 105, 20, null, null, "center");
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, null, null, "center");

    // Incident Summary
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Incident Summary", 15, 45);
    
    // Group by incident type
    const incidentCounts = reports.reduce((acc, report) => {
      const type = report.incidentType || "Unspecified";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    
    // Format for table
    const incidentData = Object.keys(incidentCounts).map(type => [
      type,
      incidentCounts[type],
      ((incidentCounts[type] / reports.length) * 100).toFixed(1) + "%"
    ]);
    
    // Add total row
    incidentData.push([
      "Total",
      reports.length,
      "100%"
    ]);
    
    autoTable(doc, {
      startY: 55,
      head: [["Incident Type", "Count", "Percentage"]],
      body: incidentData,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [79, 70, 229] }
    });
    
    // Vehicle Type Summary
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Vehicle Type Summary", 15, doc.lastAutoTable.finalY + 20);
    
    // Group by vehicle type
    const vehicleTypeCounts = reports.reduce((acc, report) => {
      const type = report.vehicleType || "Unspecified";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    
    // Format for table
    const vehicleTypeData = Object.keys(vehicleTypeCounts).map(type => [
      type,
      vehicleTypeCounts[type],
      ((vehicleTypeCounts[type] / reports.length) * 100).toFixed(1) + "%"
    ]);
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 30,
      head: [["Vehicle Type", "Count", "Percentage"]],
      body: vehicleTypeData,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [79, 70, 229] }
    });
    
    // High Risk Drivers
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("High Risk Drivers", 15, doc.lastAutoTable.finalY + 20);
    
    // Group by vehicle registration
    const driverReports = {};
    reports.forEach(report => {
      if (report.vehicles && report.vehicles.length > 0) {
        const registration = report.vehicles[0].registration;
        if (registration) {
          if (!driverReports[registration]) {
            driverReports[registration] = [];
          }
          driverReports[registration].push(report);
        }
      }
    });
    
    // Calculate risk scores
    const drivers = Object.keys(driverReports).map(registration => {
      const driverData = driverReports[registration];
      const incidents = driverData.length;
      
      // Simple risk algorithm
      const incidentTypeScores = driverData.reduce((acc, report) => {
        const typeScores = {
          "Speeding": 2,
          "Running Red Light": 3,
          "Reckless Driving": 4,
          "Tailgating": 1.5,
          "Other": 1
        };
        return acc + (typeScores[report.incidentType] || 1);
      }, 0);
      
      // Get vehicle info from the most recent report
      const latestReport = driverData.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      )[0];
      
      const vehicleInfo = latestReport.vehicles && latestReport.vehicles.length > 0 
        ? latestReport.vehicles[0] 
        : {};
      
      const score = Math.min(10, (incidentTypeScores / incidents) * 2.5);
      
      return {
        registration,
        make: vehicleInfo.make || "N/A",
        model: vehicleInfo.model || "N/A",
        incidents,
        score,
        primaryType: getMostCommonType(driverData)
      };
    });
    
    // Sort by risk score (descending) and take top 10
    const topRiskDrivers = drivers
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(driver => [
        driver.registration,
        `${driver.make} ${driver.model}`,
        driver.incidents,
        driver.primaryType,
        driver.score.toFixed(1) + " / 10",
        driver.score >= 8 ? "High" : driver.score >= 6 ? "Medium" : "Low"
      ]);
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 30,
      head: [["Registration", "Vehicle", "Incidents", "Primary Type", "Risk Score", "Risk Level"]],
      body: topRiskDrivers,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [79, 70, 229] }
    });

    // Status Summary
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    
    // Add a new page if we're running out of space
    if (doc.lastAutoTable.finalY > 210) {
      doc.addPage();
      doc.text("Report Status Summary", 15, 20);
      doc.lastAutoTable.finalY = 20;
    } else {
      doc.text("Report Status Summary", 15, doc.lastAutoTable.finalY + 20);
    }
    
    // Group by status
    const statusCounts = reports.reduce((acc, report) => {
      const status = report.status || "pending";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    
    // Format for table
    const statusData = Object.keys(statusCounts).map(status => [
      status.charAt(0).toUpperCase() + status.slice(1),
      statusCounts[status],
      ((statusCounts[status] / reports.length) * 100).toFixed(1) + "%"
    ]);
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 30,
      head: [["Status", "Count", "Percentage"]],
      body: statusData,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [79, 70, 229] }
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(
        `Generated by SafeStreet.com.au - Page ${i} of ${pageCount}`,
        105,
        doc.internal.pageSize.height - 10,
        null,
        null,
        "center"
      );
      doc.text(
        `Confidential - For authorized use only`,
        105,
        doc.internal.pageSize.height - 5,
        null,
        null,
        "center"
      );
    }

    // Save the PDF
    doc.save(`SafeStreet_Analytics_${new Date().toISOString().split('T')[0]}.pdf`);
  }
};

// Helper function to get most common incident type for a driver
function getMostCommonType(reports) {
  const typeCounts = reports.reduce((acc, report) => {
    acc[report.incidentType] = (acc[report.incidentType] || 0) + 1;
    return acc;
  }, {});
  
  return Object.keys(typeCounts).reduce((a, b) => typeCounts[a] > typeCounts[b] ? a : b);
}

export default PDFExport;