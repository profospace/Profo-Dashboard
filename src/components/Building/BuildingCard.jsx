// import React from 'react';
// import { Link } from 'react-router-dom';

// const BuildingCard = ({ building, onDelete }) => {
//     const statusColors = {
//         'Ready': 'bg-green-100 text-green-800',
//         'Under Construction': 'bg-yellow-100 text-yellow-800',
//         'Upcoming': 'bg-blue-100 text-blue-800',
//         'DEFAULT': 'bg-gray-100 text-gray-800'
//     };

//     const getStatusClass = (status) => {
//         return statusColors[status] || statusColors['DEFAULT'];
//     };

//     const confirmDelete = () => {
//         if (window.confirm('Are you sure you want to delete this building?')) {
//             onDelete(building._id);
//         }
//     };

//     return (
//         <div className="bg-white rounded-lg shadow overflow-hidden transition-all duration-200 hover:shadow-md">
//             <div className="relative pb-[60%]">
//                 {building.galleryList && building.galleryList.length > 0 ? (
//                     <img
//                         src={building.galleryList[0]}
//                         alt={building.name || 'Building'}
//                         className="absolute h-full w-full object-cover"
//                     />
//                 ) : (
//                     <div className="absolute h-full w-full bg-gray-200 flex items-center justify-center">
//                         <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                         </svg>
//                     </div>
//                 )}
//                 <div className="absolute top-2 left-2">
//                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(building.developmentStatus)}`}>
//                         {building.developmentStatus || 'Upcoming'}
//                     </span>
//                 </div>
//             </div>

//             <div className="p-4">
//                 <div className="flex justify-between items-start">
//                     <div>
//                         <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
//                             {building.name || 'Unnamed Building'}
//                         </h3>
//                         <p className="text-sm text-gray-500 mb-2">ID: {building.buildingId}</p>
//                     </div>
//                 </div>

//                 <div className="space-y-2 mb-4">
//                     <div className="flex items-start">
//                         <svg className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                         </svg>
//                         <span className="text-sm text-gray-600">
//                             {building.ownerName || 'No owner specified'}
//                         </span>
//                     </div>

//                     <div className="flex items-start">
//                         <svg className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//                         </svg>
//                         <span className="text-sm text-gray-600">
//                             {building.totalProperties
//                                 ? `${building.totalProperties} Properties`
//                                 : 'No properties'
//                             }
//                         </span>
//                     </div>
//                 </div>

//                 <div className="flex flex-wrap gap-2">
//                     <Link
//                         to={`/buildings/${building.buildingId}`}
//                         className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-center py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200"
//                     >
//                         View
//                     </Link>

//                     <Link
//                         to={`/buildings/edit/${building.buildingId}`}
//                         className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-center py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200"
//                     >
//                         Edit
//                     </Link>

//                     <button
//                         onClick={confirmDelete}
//                         className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 text-center py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200"
//                     >
//                         Delete
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default BuildingCard;

import { Button } from 'antd';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const BuildingCard = ({ building, onDelete }) => {
    const navigate = useNavigate()
    const statusColors = {
        'Ready': 'bg-green-100 text-green-800',
        'Under Construction': 'bg-yellow-100 text-yellow-800',
        'Upcoming': 'bg-blue-100 text-blue-800',
        'DEFAULT': 'bg-gray-100 text-gray-800'
    };

    const getStatusClass = (status) => {
        return statusColors[status] || statusColors['DEFAULT'];
    };

    const confirmDelete = () => {
        if (window.confirm('Are you sure you want to delete this building?')) {
            onDelete(building._id);
        }
    };


    const handleAddBuildingViewer = (id)=>{
        navigate(`/manager?id=${id}&targetType=building`)
    }
    
    const handleViewBuildingViewer = (id)=>{
        navigate(`/viewer?id=${id}`)

    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="relative pb-[60%]">
                {building.galleryList && building.galleryList.length > 0 ? (
                    <img
                        src={building.galleryList[0]}
                        alt={building.name || 'Building'}
                        className="absolute h-full w-full object-cover"
                    />
                ) : (
                    <div className="absolute h-full w-full bg-gray-200 flex items-center justify-center">
                        <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                )}
                <div className="absolute top-2 left-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(building.developmentStatus)}`}>
                        {building.developmentStatus || 'Upcoming'}
                    </span>
                </div>
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                            {building.name || 'Unnamed Building'}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">ID: {building.buildingId}</p>
                    </div>
                </div>

                <div className="space-y-2 mb-4">
                    <div className="flex items-start">
                        <svg className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-sm text-gray-600">
                            {building.ownerName || 'No owner specified'}
                        </span>
                    </div>

                    <div className="flex items-start">
                        <svg className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="text-sm text-gray-600">
                            {building.totalProperties
                                ? `${building.totalProperties} Properties`
                                : 'No properties'
                            }
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-2">
                    <Link
                        to={`/buildings/${building.buildingId}`}
                        className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-center py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                        View
                    </Link>

                    <Link
                        to={`/buildings/edit/${building.buildingId}`}
                        className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-center py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                        Edit
                    </Link>

                    <button
                        onClick={confirmDelete}
                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 text-center py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                        Delete
                    </button>
                </div>

                {/* New Connect button */}
                <Link
                    to={`/buildings/connect/${building.buildingId}`}
                    className="w-full block bg-green-50 hover:bg-green-100 text-green-700 text-center py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200"
                >
                    Connect Properties
                </Link>
                <Link
                    to={`/buildings/disconnect/${building.buildingId}`}
                    className="flex-1 bg-orange-50 hover:bg-orange-100 text-orange-700 text-center py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200"
                >
                    Disconnect Properties
                </Link>
                
                {/* Buttons to Add Viewer */}
                <Button onClick={()=>handleAddBuildingViewer(building?.buildingId)}>Add Buliding Viewer</Button>
                <Button onClick={()=>handleViewBuildingViewer(building?.buildingId)}>View Building Viewer</Button>
            </div>
        </div>
    );
};

export default BuildingCard;