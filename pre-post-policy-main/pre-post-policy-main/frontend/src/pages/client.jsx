import React, { useState, useEffect } from 'react';
import { Download, Filter, UserCircle } from 'lucide-react';
import * as XLSX from "xlsx";
import BellIcon from '../assets/bell.svg';
import MsgIcon from '../assets/msg.svg';
import LogoIcon from '../assets/logo.svg';
import DashboardIcon from '../assets/icon1.svg';
import TicketsIcon from '../assets/icon2.svg';
import SettingsIcon from '../assets/icon3.svg';
import ProfileIcon from '../assets/icon4.svg';
import TicketDetails from './TicketDetails';
import FilterComponent from './FilterComponent';

const ClientDashboard = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [data, setData] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [filterCriteria, setFilterCriteria] = useState({
    order: '',
    gender: '',
    priority: '',
    status: '',
    date: '',
    time: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setData([]);  // Clear data state
    setFilteredData([]);  // Clear filtered data
    localStorage.removeItem('ticketData');  // Clear localStorage on login
  }, []);

  useEffect(() => {
    applyFilters();
  }, [data, filterCriteria, searchTerm]);

  const sortById = (dataToSort) => {
    return [...dataToSort].sort((a, b) => a.id - b.id);
  };

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleCloseTicketDetails = () => {
    setSelectedTicket(null);
  };

  


  const handleFileUpload = (e) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = async (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
  
      // Get the current upload date and time in ISO format
      const uploadDateTime = new Date().toISOString();
  
      // Add the uploadDateTime to each ticket
      const updatedData = parsedData.map(ticket => ({
        ...ticket,
        uploadDateTime // Adds the current time to each ticket
      }));
  
      setData(updatedData);
      setFilteredData(sortById(updatedData));
      localStorage.setItem('ticketData', JSON.stringify(updatedData));
  
      try {
        const response = await fetch('http://localhost:8080/excel/data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ parsedData: updatedData, uploadDateTime }),  // Send updated data
        });
  
        if (response.ok) {
          const responseData = await response.json();
          console.log('File data successfully uploaded:', responseData);
  
          // Convert and log local time
          const localTimeString = new Date(uploadDateTime).toLocaleString(); // Converts to local time
          console.log('Upload date and time (local):', localTimeString); // Logs the local time
  
          setData(responseData);
        } else {
          console.error('Error uploading file data');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  };
  
  


  const handleDownload = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "filtered_tickets.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const applyFilters = () => {
    let newFilteredData = [...data];
    
    // Apply search filter
    if (searchTerm) {
      newFilteredData = newFilteredData.filter(ticket => 
        Object.values(ticket).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    // Apply other filters
    Object.entries(filterCriteria).forEach(([key, value]) => {
      if (value && key !== 'order') {
        newFilteredData = newFilteredData.filter(ticket => {
          if (key === 'date') {
            return ticket.dateTime.includes(value);
          }
          if (key === 'time') {
            return ticket.dateTime.includes(value);
          }
          if (key === 'gender' || key === 'priority' || key === 'status') {
            return String(ticket[key]).toLowerCase() === String(value).toLowerCase();
          }
          return true;
        });
      }
    });

    // Apply sorting
    if (filterCriteria.order === 'ascending') {
      newFilteredData.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
    } else if (filterCriteria.order === 'descending') {
      newFilteredData.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
    } else {
      // If no order is specified, sort by id
      newFilteredData = sortById(newFilteredData);
    }

    setFilteredData(newFilteredData);
  };

  const handleFilter = (newFilterCriteria) => {
    setFilterCriteria(prevCriteria => ({...prevCriteria, ...newFilterCriteria}));
  };

  const handleClearFilters = () => {
    setFilterCriteria({
      order: '',
      gender: '',
      priority: '',
      status: '',
      date: '',
      time: ''
    });
    setSearchTerm('');
    setFilteredData(sortById(data));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex h-screen bg-gray-100 w-screen">
      {/* Sidebar */}
      <div className="ml-5 mb-8 mt-8 w-20 bg-teal-600 p-4 flex flex-col items-center justify-between shadow-lg rounded-lg pt-5 pb-5">
        <div className="space-y-8 flex flex-col items-center justify-center">
          <div className="flex justify-center items-center flex-col">
            <img src={LogoIcon} alt="Logo" className="w-12 h-12" />
            <span className="mt-2 text-white text-xs font-semibold">CheckMed</span>
          </div>
          <img src={DashboardIcon} alt="Dashboard Icon" className="w-8 h-8" />
          <div className="shadow-md rounded-full p-2 shadow-xxl">
            <img src={TicketsIcon} alt="Tickets Icon" className="w-8 h-8 text-teal-600" />
          </div>
          <img src={SettingsIcon} alt="Settings Icon" className="w-8 h-8" />
        </div>
        <img src={ProfileIcon} alt="Profile Icon" className="w-10 h-10 rounded-full bg-white p-1" />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-grey p-2 flex items-center justify-end space-x-4 mt-8 mr-8">
          <img src={BellIcon} alt="Notifications" className="w-8 h-8" />
          <img src={MsgIcon} alt="Messages" className="w-8 h-8" />
        </header>

        <main className="flex-1 p-6 mb-6 overflow-auto">
          <div className="bg-gray-100 rounded-lg shadow-lg p-6">
            <div className="flex flex-wrap gap-4 mb-6">
              <button className="bg-teal-500 text-white px-6 py-2 rounded-full shadow-md">
                Tickets
              </button>
              <button 
                className="bg-grey shadow-md text-black px-6 py-2 rounded-full"
                onClick={() => document.getElementById('fileInput').click()}
              >
                Upload Excel
              </button>
              <input 
                type="file" 
                accept=".xlsx, .xls" 
                onChange={handleFileUpload} 
                id="fileInput" 
                className="hidden" 
              />
              <button className="bg-grey text-black px-6 py-2 rounded-full shadow-md">
                Closed Tickets
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
              {/* Table section */}
              <div className={`bg-white p-4 rounded-lg ${selectedTicket ? 'lg:w-1/2' : 'w-full'}`}>
                <div className="mb-4 flex flex-wrap justify-between items-center gap-4">
                  <h2 className="text-base font-semibold">Tickets</h2>
                  <input 
                    type="text" 
                    placeholder="Search" 
                    className="border rounded-full px-4 py-2 shadow-sm text-sm"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                  <div className="flex items-center space-x-4">
                    <button className="text-sm flex items-center text-gray-600" onClick={handleDownload}>
                      <Download className="w-4 h-4 mr-2" />
                      Download in excel
                    </button>
                    <button
                      onClick={() => setShowFilter(!showFilter)}
                      className={`flex items-center bg-white text-grey-600 text-sm px-2 py-2 rounded ${showFilter ? 'bg-gray-300' : ''}`}
                    >
                      <Filter className="mr-1" /> Filter
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  {filteredData.length > 0 ? (
                    <table className="w-full font-nunito text-xs">
                      <thead>
                        <tr className="bg-gray-50">
                          {Object.keys(filteredData[0]).map((key) => (
                            <th key={key} className="px-4 py-3 text-left whitespace-nowrap">{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((row, index) => (
                          <tr
                            key={index}
                            className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleTicketClick(row)}
                          >
                            {Object.values(row).map((value, valueIndex) => (
                              <td key={valueIndex} className="px-4 py-3 whitespace-nowrap">{value}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-center py-4">No matching tickets found.</p>
                  )}
                </div>
              </div>

              {/* Ticket details section */}
              {selectedTicket && (
                <div className="lg:w-1/2 p-4 bg-white rounded-lg overflow-y-auto max-h-[600px]">
                  <TicketDetails 
                    ticket={selectedTicket} 
                    showEdit={false} 
                    onClose={handleCloseTicketDetails}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Show Filter Component */}
      {showFilter && (
        <FilterComponent 
          onFilter={handleFilter} 
          onClose={() => setShowFilter(false)}
          currentFilters={filterCriteria}
          onClearFilters={handleClearFilters}
        />
      )}
    </div>
  );
};

export default ClientDashboard;