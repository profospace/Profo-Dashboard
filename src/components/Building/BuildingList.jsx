import React from 'react';
import { TrashIcon, PencilIcon } from '@heroicons/react/outline';
import { FaBuilding } from "react-icons/fa";

export default function BuildingList({
    buildings,
    loading,
    error,
    onEdit,
    onDelete,
    searchTerm,
    onSearchChange,
    filterStatus,
    onFilterStatusChange
}) {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading buildings...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    onClick={() => window.location.reload()}
                >
                    Try Again
                </button>
            </div>
        );
    }

    const statusOptions = [
        { value: '', label: 'All Statuses' },
        { value: 'Ready', label: 'Ready' },
        { value: 'Under Construction', label: 'Under Construction' },
        { value: 'Upcoming', label: 'Upcoming' }
    ];

    return (
        <div className="p-4">
            {/* Filter and Search Bar */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                        Filter by Status
                    </label>
                    <select
                        id="status-filter"
                        className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={filterStatus}
                        onChange={(e) => onFilterStatusChange(e.target.value)}
                    >
                        {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                        Search Buildings
                    </label>
                    <input
                        type="text"
                        id="search"
                        placeholder="Search by name, ID, or owner..."
                        className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            </div>

            {/* Buildings Grid */}
            {buildings.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-lg">No buildings found matching your criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {buildings.map((building) => (
                        <BuildingCard
                            key={building._id}
                            building={building}
                            onEdit={() => onEdit(building)}
                            onDelete={() => onDelete(building.buildingId)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function BuildingCard({ building, onEdit, onDelete }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'Ready':
                return 'bg-green-100 text-green-800';
            case 'Under Construction':
                return 'bg-yellow-100 text-yellow-800';
            case 'Upcoming':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Calculate percentage of allocated properties
    const totalProperties = building.totalProperties || 0;
    const allocatedProperties = building.allocatedProperties || 0;
    const allocationPercentage = totalProperties > 0
        ? Math.round((allocatedProperties / totalProperties) * 100)
        : 0;

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            {/* Building Image */}
            <div className="h-48 w-full overflow-hidden relative">
                {building.galleryList && building.galleryList.length > 0 ? (
                    <img
                        src={building.galleryList[0]}
                        alt={building.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-400">
                        <FaBuilding className="h-16 w-16" />
                    </div>
                )}

                {/* Status Badge */}
                {building.developmentStatus && (
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(building.developmentStatus)}`}>
                        {building.developmentStatus}
                    </div>
                )}
            </div>

            {/* Building Details */}
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate" title={building.name}>
                    {building.name || 'Unnamed Building'}
                </h3>

                <div className="text-sm text-gray-500 mb-2">
                    ID: {building.buildingId} | {building.type || 'N/A'}
                </div>

                {building.ownerName && (
                    <div className="text-sm text-gray-700 mb-3">
                        Owner: {building.ownerName}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="text-sm">
                        <span className="text-gray-500">Total floors:</span>
                        <span className="ml-1 font-medium">{building.totalFloors || 0}</span>
                    </div>

                    <div className="text-sm">
                        <span className="text-gray-500">Total units:</span>
                        <span className="ml-1 font-medium">{building.totalProperties || 0}</span>
                    </div>

                    <div className="text-sm">
                        <span className="text-gray-500">Available:</span>
                        <span className="ml-1 font-medium">{building.numberOfFlatsAvailable || 0}</span>
                    </div>

                    <div className="text-sm">
                        <span className="text-gray-500">Age:</span>
                        <span className="ml-1 font-medium">{building.age || 'N/A'}</span>
                    </div>
                </div>

                {/* Property Allocation Progress Bar */}
                <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Property Allocation</span>
                        <span>{allocationPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${allocationPercentage}%` }}
                        ></div>
                    </div>
                </div>

                {building.description && (
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2" title={building.description}>
                        {building.description}
                    </p>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between pt-2 border-t border-gray-100">
                    <button
                        onClick={onEdit}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Edit
                    </button>

                    <button
                        onClick={onDelete}
                        className="flex items-center text-sm text-red-600 hover:text-red-800"
                    >
                        <TrashIcon className="h-4 w-4 mr-1" />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}