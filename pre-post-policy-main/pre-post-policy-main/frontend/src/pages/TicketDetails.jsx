import React, { useState, useEffect } from 'react';
import { Edit, Check, X } from 'lucide-react';

const TicketDetails = ({ ticket, showEdit = true }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [ticketDetails, setTicketDetails] = useState(null);
  const [editedDetails, setEditedDetails] = useState(null);

  useEffect(() => {
    // Dynamically transform ticket data into the required format
    const details = Object.keys(ticket).map((key) => ({
      label: key.replace(/([A-Z])/g, ' $1').trim(),  // Convert camelCase to spaced words
      value: ticket[key] || 'N/A',
      type: key.includes('Date') ? 'date' : 'text',  // You can adjust this logic based on key
      required: true,  // Set this as needed, or adjust logic based on keys
    }));

    // Grouping details into rows, every 2-3 fields per row for example
    const groupedDetails = [];
    for (let i = 0; i < details.length; i += 6) {
      groupedDetails.push(details.slice(i, i + 6));
    }

    setTicketDetails(groupedDetails);
    setEditedDetails(groupedDetails);
  }, [ticket]);

  const handleInputChange = (rowIndex, cellIndex, value) => {
    const newDetails = [...editedDetails];
    newDetails[rowIndex][cellIndex] = {
      ...newDetails[rowIndex][cellIndex],
      value: value
    };
    setEditedDetails(newDetails);
  };

  const handleSaveChanges = async () => {
    try {
      // Validate required fields
      let hasError = false;
      editedDetails.forEach(row => {
        row.forEach(cell => {
          if (cell.required && !cell.value) {
            hasError = true;
          }
        });
      });

      if (hasError) {
        alert("Please fill in all required fields");
        return;
      }

      // Here you would make the API call to save changes
      // await saveTicketDetails(editedDetails);

      setTicketDetails(editedDetails);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Failed to save changes. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditedDetails(ticketDetails);
    setIsEditing(false);
  };

  if (!ticketDetails) return null;

  return (
    <div className="w-1/2 bg-white rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <span className="font-bold text-gray-700 mr-2">Ticket Status:</span>
          <span className="text-green-500 font-bold">{ticket.Status || 'Active'}</span>
        </div>
        {isEditing ? (
          <div className="flex space-x-2">
            <button 
              onClick={handleSaveChanges}
              className="text-green-500 flex items-center hover:text-green-600"
            >
              <Check size={16} className="mr-1" />
              Save
            </button>
            <button 
              onClick={handleCancelEdit}
              className="text-red-500 flex items-center hover:text-red-600"
            >
              <X size={16} className="mr-1" />
              Cancel
            </button>
          </div>
        ) : (
          showEdit && (  // Conditionally render the edit option
            <button 
              onClick={() => setIsEditing(true)}
              className="text-blue-500 flex items-center hover:text-blue-600"
            >
              <Edit size={16} className="mr-1" />
              Edit
            </button>
          )
        )}
      </div>

      <div className="border border-gray-200 rounded">
        <table className="w-full">
          <tbody>
            {(isEditing ? editedDetails : ticketDetails).map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border-r border-b border-gray-200 p-2">
                    <div className="text-xs font-medium text-black">
                      {cell.label}
                      {cell.required && " *"}
                    </div>
                    {isEditing ? (
                      <input
                        type={cell.type}
                        value={cell.value}
                        onChange={(e) => handleInputChange(rowIndex, cellIndex, e.target.value)}
                        className="w-full text-xs p-1 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    ) : (
                      <div className="text-xs font-light text-gray-500">{cell.value}</div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketDetails;
