import React from 'react';

const FloorDetails = ({ floorNumber, flatsOnFloor, availableFlats, onChange }) => {
    return (
        <div className="border border-gray-200 rounded-md p-4">
            <h3 className="text-md font-medium text-gray-800 mb-4">Floor {floorNumber}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor={`flatsOnFloor${floorNumber}`} className="block text-sm font-medium text-gray-700">
                        Number of Flats on Floor
                    </label>
                    <input
                        type="number"
                        id={`flatsOnFloor${floorNumber}`}
                        value={flatsOnFloor}
                        onChange={(e) => onChange('flatsOnFloor', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        min="0"
                    />
                </div>
                <div>
                    <label htmlFor={`availableFlats${floorNumber}`} className="block text-sm font-medium text-gray-700">
                        Available Flats on Floor
                    </label>
                    <input
                        type="number"
                        id={`availableFlats${floorNumber}`}
                        value={availableFlats}
                        onChange={(e) => onChange('availableFlats', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        min="0"
                        max={flatsOnFloor}
                    />
                </div>
            </div>
        </div>
    );
};

export default FloorDetails;