import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FilterComponent = ({ onFilter, onClose, currentFilters, onClearFilters }) => {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const handleFilterChange = (key, value) => {
    onFilter({ [key]: value });
  };

  return (
    <div className="bg-white shadow-lg p-4 rounded-lg w-64 absolute right-2 top-20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-black text-lg font-semibold">Filter Tickets</h2>
        <button 
          onClick={onClose} 
          className="text-black hover:text-gray-800 text-xs"
        >
          ✖
        </button>
      </div>
      <div className="space-y-3">
        {/* Ascending / Descending / No Order */}
        <div className="flex space-x-1">
          <button
            className={`px-2 py-1 text-xs rounded ${currentFilters.order === 'ascending' ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => handleFilterChange('order', 'ascending')}
          >
            Ascending
          </button>
          <button
            className={`px-2 py-1 text-xs rounded ${currentFilters.order === 'descending' ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => handleFilterChange('order', 'descending')}
          >
            Descending
          </button>
          <button
            className={`px-2 py-1 text-xs rounded ${currentFilters.order === '' ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => handleFilterChange('order', '')}
          >
            No Order
          </button>
        </div>

        {/* Date and Time */}
        <div className="flex space-x-1">
          <input
            type="date"
            className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs w-1/2"
            value={currentFilters.date}
            onChange={(e) => handleFilterChange('date', e.target.value)}
          />
          <input
            type="time"
            className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs w-1/2"
            value={currentFilters.time}
            onChange={(e) => handleFilterChange('time', e.target.value)}
          />
        </div>

        {/* Gender Selection */}
        <div>
          <p className="text-black mb-1 text-xs">Gender</p>
          <div className="flex space-x-1">
            <button
              className={`px-2 py-1 text-xs rounded ${currentFilters.gender === 'male' ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => handleFilterChange('gender', 'male')}
            >
              Male
            </button>
            <button
              className={`px-2 py-1 text-xs rounded ${currentFilters.gender === 'female' ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => handleFilterChange('gender', 'female')}
            >
              Female
            </button>
          </div>
        </div>

        {/* Priority Selection */}
        <div>
          <p className="text-black mb-1 text-xs">Priority</p>
          <div className="flex space-x-1">
            <button
              className={`px-2 py-1 text-xs rounded ${currentFilters.priority === 'high' ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => handleFilterChange('priority', 'high')}
            >
              High
            </button>
            <button
              className={`px-2 py-1 text-xs rounded ${currentFilters.priority === 'medium' ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => handleFilterChange('priority', 'medium')}
            >
              Medium
            </button>
            <button
              className={`px-2 py-1 text-xs rounded ${currentFilters.priority === 'low' ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => handleFilterChange('priority', 'low')}
            >
              Low
            </button>
          </div>
        </div>

        {/* Status Selection */}
        <div className="relative">
          <p className="text-black mb-1 text-xs">Status</p>
          <div
            className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs flex items-center justify-between cursor-pointer"
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
          >
            {currentFilters.status || 'Select Status'}
            <ChevronDown size={16} />
          </div>

          {showStatusDropdown && (
            <div className="absolute bg-white shadow-lg rounded-lg mt-1 w-full z-10">
              <ul className="text-black text-xs">
                <li
                  className="px-2 py-1 cursor-pointer hover:bg-gray-200"
                  onClick={() => { handleFilterChange('status', 'completed'); setShowStatusDropdown(false); }}
                >
                  Completed
                </li>
                <li
                  className="px-2 py-1 cursor-pointer hover:bg-gray-200"
                  onClick={() => { handleFilterChange('status', 'in process'); setShowStatusDropdown(false); }}
                >
                  In Process
                </li>
                <li
                  className="px-2 py-1 cursor-pointer hover:bg-gray-200"
                  onClick={() => { handleFilterChange('status', 'active'); setShowStatusDropdown(false); }}
                >
                  Active
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Clear Filters Button */}
        <div className="pt-2">
          <button
            className="w-full bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition duration-200"
            onClick={onClearFilters}
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;