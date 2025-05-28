import React, { useEffect, useState } from 'react';
import { Download, Filter, Edit, X, Check } from 'lucide-react';
import * as XLSX from "xlsx";
import { Link } from 'react-router-dom';

import TicketDetails from './TicketDetails';
import FilterComponent from './FilterComponent';
import UploadReports from './UploadReports';

import BellIcon from '../assets/bell.svg';
import MsgIcon from '../assets/msg.svg';
import LogoIcon from '../assets/logo.svg';
import DashboardIcon from '../assets/icon1.svg';
import TicketsIcon from '../assets/icon2.svg';
import SettingsIcon from '../assets/icon3.svg';
import ProfileIcon from '../assets/icon4.svg';

const Support = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [data, setData] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingRow, setEditingRow] = useState(null);
  const [editedValues, setEditedValues] = useState({});
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/fetch/exceldata');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
        setFilteredData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = (row) => {
    setEditingRow(row);
    setEditedValues({ ...row });
  };

  const handleEditInputChange = (key, value) => {
    setEditedValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`http://localhost:8080/update/exceldata/${editedValues.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedValues),
      });

      if (!response.ok) {
        throw new Error('Failed to update data');
      }

      const updatedData = data.map(item => 
        item.id === editedValues.id ? editedValues : item
      );
      setData(updatedData);
      setFilteredData(updatedData);
      setEditingRow(null);
      setEditedValues({});
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditedValues({});
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredData(data);
    } else {
      const searchResults = data.filter((item) =>
        Object.values(item).some((value) =>
          value?.toString().toLowerCase().includes(query.toLowerCase())
        )
      );
      setFilteredData(searchResults);
    }
  };

  const handleDownload = () => {
    const dataToDownload = filteredData.length > 0 ? filteredData : data;
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(dataToDownload);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "download.xlsx";
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
        <header className="bg-gray-100 p-4 flex justify-end items-center space-x-4">
          <img src={BellIcon} alt="Notifications" className="w-8 h-8" />
          <img src={MsgIcon} alt="Messages" className="w-8 h-8" />
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Ticket status buttons */}
            <div className="flex space-x-4 mb-6">
              <button className="bg-teal-500 text-white px-6 py-2 rounded-full shadow-md font-nunito text-sm font-bold leading-27px text-center">
                Open Tickets {filteredData.filter(item => item.Status?.toLowerCase() === 'active').length}
              </button>
              <button className="bg-white text-gray-700 px-6 py-2 rounded-full shadow-md font-nunito text-sm font-semibold leading-27px text-center">
                Overdue {filteredData.filter(item => new Date(item.Date) < new Date()).length}
              </button>
              <button className="bg-white text-gray-700 px-6 py-2 rounded-full shadow-md font-nunito text-sm font-semibold leading-27px text-center">
                Total {filteredData.length}
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">

            {/* Table section */}
            <div className={`bg-white p-4 rounded-lg ${selectedTicket ? 'lg:w-1/2' : 'w-full'}`}>
              <div className="p-4 flex justify-between items-center">
                <Link to="/ticket-details">
                  <h2 className="text-base font-semibold cursor-pointer">Tickets</h2>
                </Link>
                <div className="flex items-center space-x-4">
                  <input
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="border rounded-full px-4 py-2 shadow-sm text-sm"
                  />
                  <button className="text-sm flex items-center text-gray-600" onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-2" />
                    Download in excel
                  </button>
                  <button className="text-sm flex items-center text-gray-600" onClick={() => setShowFilter(!showFilter)}>
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </button>
                </div>
              </div>

              {/* Table with fixed height and vertical scroll */}
              <div className="overflow-x-auto">
                <div className="max-h-[400px] overflow-y-auto">
                  {filteredData.length > 0 && (
                    <table className="w-full font-nunito text-xs font-normal leading-[20.46px]">
                      <thead className="sticky top-0 bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left whitespace-nowrap">Edit</th>
                          {Object.keys(filteredData[0] || {}).map((key) => (
                            <th key={key} className="px-4 py-3 text-left whitespace-nowrap">{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((row) => (
                          <tr
                            key={row.id}
                            className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleTicketClick(row)}
                          >
                            <td className="px-4 py-3">
                              {editingRow?.id === row.id ? (
                                <div className="flex space-x-2">
                                  <button onClick={(e) => { e.stopPropagation(); handleSaveEdit(); }} className="text-green-600 hover:text-green-700">
                                    <Check className="w-5 h-5" />
                                  </button>
                                  <button onClick={(e) => { e.stopPropagation(); handleCancelEdit(); }} className="text-red-600 hover:text-red-700">
                                    <X className="w-5 h-5" />
                                  </button>
                                </div>
                              ) : (
                                <button onClick={(e) => { e.stopPropagation(); handleEditClick(row); }}>
                                  <Edit className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                                </button>
                              )}
                            </td>
                            {Object.keys(row).map((key) => (
                              <td key={key} className="px-4 py-3 whitespace-nowrap">
                                {editingRow?.id === row.id ? (
                                  <input
                                    type="text"
                                    value={editedValues[key] || ''}
                                    onChange={(e) => handleEditInputChange(key, e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="border border-gray-300 rounded px-2 py-1 w-full"
                                  />
                                ) : (
                                  row[key]
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>

            {/* Ticket details section */}
            {selectedTicket && (
              <div className="lg:w-1/2 p-4 bg-white rounded-lg overflow-y-auto max-h-[600px]">
              <TicketDetails 
                ticket={selectedTicket} 
                showEdit={true} 
                onClose={handleCloseTicketDetails}
              />
            </div>
            )}
          </div>
          </div>
        </main>
      </div>

      {/* Filter Component */}
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

export default Support;