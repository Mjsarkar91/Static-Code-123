import React, { useState } from 'react';
import { saveAs } from 'file-saver';

const ReportViewer = () => {
  // State to manage whether reports are visible or not
  const [showReports, setShowReports] = useState(false);

  // Dummy reports data
  const reports = [
    { id: 1, name: 'Report 1', url: '/dummy-report1.pdf' },
    { id: 2, name: 'Report 2', url: '/dummy-report2.pdf' },
    { id: 3, name: 'Report 3', url: '/dummy-report3.pdf' },
  ];

  // Function to toggle the visibility of the reports
  const toggleReports = () => {
    setShowReports(!showReports);
  };

  // Function to download the report
  const downloadReport = (report) => {
    saveAs(report.url, report.name + '.pdf');
  };

  return (
    <div className="report-viewer ">
      {/* Button to view reports */}
      <button
        className="bg-gray-300 shadow-md text-black px-6 py-2 rounded-full font-nunito text-sm font-semibold"
        onClick={toggleReports}
        style={{
          cursor: 'pointer',
        }}
      >
        View Reports
      </button>

      {/* Conditionally show the reports list */}
      {showReports && (
        <div className="reports-list mt-4 absolute w-30 bg-white shadow-lg rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-2">Available Reports:</h3>
          <ul>
            {reports.map((report) => (
              <li key={report.id} className="flex justify-between items-center mb-2">
                <span>{report.name}</span>
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded"
                  onClick={() => downloadReport(report)}
                >
                  Download
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReportViewer;
