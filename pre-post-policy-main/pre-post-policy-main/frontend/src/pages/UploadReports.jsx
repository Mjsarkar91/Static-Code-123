import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';

const UploadReports = () => {
  const [reports, setReports] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setReports(prevReports => [...prevReports, ...files]);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className='absolute right-4'>
      <button 
        onClick={triggerFileInput}
        className="bg-white text-gray-700 px-6 py-2 rounded-full shadow-md font-nunito text-sm font-semibold leading-27px text-center flex items-center justify-center"
      >
        <Upload size={16} className="mr-2" />
        Upload Reports
      </button>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        multiple
      />

      {reports.length > 0 && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-gray-800 font-semibold mb-2">Uploaded Reports:</h3>
          <ul className="text-gray-700 text-sm">
            {reports.map((file, index) => (
              <li key={index} className="mb-1">
                {file.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadReports;
