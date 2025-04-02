import React, { useEffect, useState } from 'react';

const FlatsDetailsForm = ({ totalFloors, flatsDetails = [], onChange }) => {
  const [floorDetails, setFloorDetails] = useState([]);

  useEffect(() => {
    // Initialize or update floor details when totalFloors or flatsDetails change
    const updatedFloorDetails = [];
    
    for (let i = 1; i <= totalFloors; i++) {
      // Find existing floor details or create new ones
      const existingFloor = flatsDetails.find(detail => detail.floorNumber === i) || {
        floorNumber: i,
        flatsOnFloor: '',
        availableFlats: '',
      };
      
      updatedFloorDetails.push(existingFloor);
    }
    
    setFloorDetails(updatedFloorDetails);
  }, [totalFloors, flatsDetails]);

  // Handle changes to floor details
  const handleFloorDetailChange = (index, field, value) => {
    const newFloorDetails = [...floorDetails];
    newFloorDetails[index] = {
      ...newFloorDetails[index],
      [field]: parseInt(value) || '',
    };
    
    setFloorDetails(newFloorDetails);
    onChange(newFloorDetails);
  };

  if (totalFloors <= 0) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Please enter the total number of floors first
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Floor Details</h3>
        <div className="grid gap-6">
          {floorDetails.map((floor, index) => (
            <div key={floor.floorNumber} className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Floor {floor.floorNumber}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Flats on Floor
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={floor.flatsOnFloor}
                    onChange={(e) => handleFloorDetailChange(index, 'flatsOnFloor', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Available Flats on Floor
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={floor.flatsOnFloor}
                    value={floor.availableFlats}
                    onChange={(e) => handleFloorDetailChange(index, 'availableFlats', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {parseInt(floor.availableFlats) > parseInt(floor.flatsOnFloor) && 
                    <p className="mt-1 text-xs text-red-600">
                      Available flats cannot exceed total flats on floor
                    </p>
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlatsDetailsForm;