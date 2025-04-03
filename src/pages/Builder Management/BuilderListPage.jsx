// import React, { useState, useEffect } from 'react';
// import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import { base_url } from '../../../utils/base_url';

// const BuilderListPage = () => {
//     const [builders, setBuilders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();

//     useEffect(() => {
//         fetchBuilders();
//     }, []);

//     const fetchBuilders = async () => {
//         try {
//             const response = await fetch(`${base_url}/builders`);
//             const data = await response.json();
//             setBuilders(data);
//             setLoading(false);
//         } catch (error) {
//             console.error('Error fetching builders:', error);
//             setLoading(false);
//         }
//     };

//     const handleDelete = async (builderId) => {
//         if (window.confirm('Are you sure you want to delete this builder?')) {
//             try {
//                 const response = await fetch(`${base_url}/builders/${builderId}`, {
//                     method: 'DELETE'
//                 });
//                 if (response.ok) {
//                     setBuilders(builders.filter(builder => builder._id !== builderId));
//                 }
//             } catch (error) {
//                 console.error('Error deleting builder:', error);
//             }
//         }
//     };

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div className="mx-auto ">
//             <div className="flex justify-between items-center mb-6">
//                 <h1 className="text-3xl font-bold text-gray-800">Builders</h1>
//                 <button
//                     onClick={() => navigate('/builder/upload')}
//                     className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
//                 >
//                     Add New Builder
//                 </button>
//             </div>

//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {builders.map(builder => (
//                     <div
//                         key={builder._id}
//                         className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition"
//                     >
//                         <div className="flex items-center mb-4">
//                             <img
//                                 src={builder.logo || 'https://via.placeholder.com/150'}
//                                 alt={`${builder.name} logo`}
//                                 className="w-16 h-16 rounded-full mr-4 object-cover"
//                             />
//                             <div>
//                                 <h2 className="text-xl font-bold text-gray-800">{builder.name}</h2>
//                                 <p className="text-gray-500">{builder.company}</p>
//                             </div>
//                         </div>

//                         <div className="flex justify-between items-center mt-4">
//                             <button
//                                 onClick={() => navigate(`/builder/detail/${builder._id}`)}
//                                 className="text-blue-500 hover:text-blue-600 transition"
//                             >
//                                 <FaEye className="mr-2 inline" /> View
//                             </button>
//                             <button
//                                 onClick={() => navigate(`/builder/update/${builder._id}`)}
//                                 className="text-green-500 hover:text-green-600 transition"
//                             >
//                                 <FaEdit className="mr-2 inline" /> Edit
//                             </button>
//                             <button
//                                 onClick={() => handleDelete(builder._id)}
//                                 className="text-red-500 hover:text-red-600 transition"
//                             >
//                                 <FaTrash className="mr-2 inline" /> Delete
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default BuilderListPage;

// import React, { useState, useEffect } from 'react';
// import { FaEdit, FaTrash, FaEye, FaLink, FaUnlink } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import { base_url } from '../../../utils/base_url';

// const BuilderListPage = () => {
//     const [builders, setBuilders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();

//     useEffect(() => {
//         fetchBuilders();
//     }, []);

//     const fetchBuilders = async () => {
//         try {
//             const response = await fetch(`${base_url}/builders`);
//             const data = await response.json();
//             setBuilders(data);
//             setLoading(false);
//         } catch (error) {
//             console.error('Error fetching builders:', error);
//             setLoading(false);
//         }
//     };

//     const handleDelete = async (builderId) => {
//         if (window.confirm('Are you sure you want to delete this builder?')) {
//             try {
//                 const response = await fetch(`${base_url}/api/builder/building/connection/builders/${builderId}`, {
//                     method: 'DELETE'
//                 });
//                 if (response.ok) {
//                     setBuilders(builders.filter(builder => builder._id !== builderId));
//                 }
//             } catch (error) {
//                 console.error('Error deleting builder:', error);
//             }
//         }
//     };

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div className="mx-auto">
//             <div className="flex justify-between items-center mb-6">
//                 <h1 className="text-3xl font-bold text-gray-800">Builders</h1>
//                 <button
//                     onClick={() => navigate('/builder/upload')}
//                     className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
//                 >
//                     Add New Builder
//                 </button>
//             </div>

//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {builders.map(builder => (
//                     <div
//                         key={builder._id}
//                         className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition"
//                     >
//                         <div className="flex items-center mb-4">
//                             <img
//                                 src={builder.logo || 'https://via.placeholder.com/150'}
//                                 alt={`${builder.name} logo`}
//                                 className="w-16 h-16 rounded-full mr-4 object-cover"
//                             />
//                             <div>
//                                 <h2 className="text-xl font-bold text-gray-800">{builder.name}</h2>
//                                 <p className="text-gray-500">{builder.company}</p>
//                             </div>
//                         </div>

//                         {/* Building statistics */}
//                         <div className="mb-4 px-2 py-1 bg-gray-100 rounded">
//                             <p className="text-sm text-gray-600">
//                                 <span className="font-semibold">Buildings:</span> {builder.buildings?.length || 0}
//                             </p>
//                             <p className="text-sm text-gray-600">
//                                 <span className="font-semibold">Projects:</span> {builder.statistics?.completedProjects + builder.statistics?.ongoingProjects || 0}
//                             </p>
//                         </div>

//                         {/* Action buttons */}
//                         <div className="grid grid-cols-2 gap-2 mb-4">
//                             <button
//                                 onClick={() => navigate(`/builder/connect-buildings/${builder._id}`)}
//                                 className="flex items-center justify-center bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition text-sm"
//                             >
//                                 <FaLink className="mr-1" /> Connect Buildings
//                             </button>
//                             <button
//                                 onClick={() => navigate(`/builder/disconnect-buildings/${builder._id}`)}
//                                 className="flex items-center justify-center bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600 transition text-sm"
//                             >
//                                 <FaUnlink className="mr-1" /> Disconnect Buildings
//                             </button>
//                         </div>

//                         <div className="flex justify-between items-center mt-4">
//                             <button
//                                 onClick={() => navigate(`/builder/detail/${builder._id}`)}
//                                 className="text-blue-500 hover:text-blue-600 transition"
//                             >
//                                 <FaEye className="mr-2 inline" /> View
//                             </button>
//                             <button
//                                 onClick={() => navigate(`/builder/update/${builder._id}`)}
//                                 className="text-green-500 hover:text-green-600 transition"
//                             >
//                                 <FaEdit className="mr-2 inline" /> Edit
//                             </button>
//                             <button
//                                 onClick={() => handleDelete(builder._id)}
//                                 className="text-red-500 hover:text-red-600 transition"
//                             >
//                                 <FaTrash className="mr-2 inline" /> Delete
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default BuilderListPage;


// import React, { useState, useEffect } from 'react';
// import { FaEdit, FaTrash, FaEye, FaLink, FaUnlink, FaBuilding, FaProjectDiagram } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import { base_url } from '../../../utils/base_url';

// const BuilderListPage = () => {
//     const [builders, setBuilders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();

//     useEffect(() => {
//         fetchBuilders();
//     }, []);

//     const fetchBuilders = async () => {
//         try {
//             const response = await fetch(`${base_url}/builders`);
//             const data = await response.json();
//             setBuilders(data);
//             setLoading(false);
//         } catch (error) {
//             console.error('Error fetching builders:', error);
//             setLoading(false);
//         }
//     };

//     const handleDelete = async (builderId) => {
//         if (window.confirm('Are you sure you want to delete this builder?')) {
//             try {
//                 const response = await fetch(`${base_url}/api/builder/building/connection/builders/${builderId}`, {
//                     method: 'DELETE'
//                 });
//                 if (response.ok) {
//                     setBuilders(builders.filter(builder => builder._id !== builderId));
//                 }
//             } catch (error) {
//                 console.error('Error deleting builder:', error);
//             }
//         }
//     };

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div className="mx-auto">
//             <div className="flex justify-between items-center mb-6">
//                 <h1 className="text-3xl font-bold text-gray-800">Builders</h1>
//                 <button
//                     onClick={() => navigate('/builder/upload')}
//                     className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
//                 >
//                     Add New Builder
//                 </button>
//             </div>

//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {builders.map(builder => (
//                     <div
//                         key={builder._id}
//                         className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition"
//                     >
//                         <div className="flex items-center mb-4">
//                             <img
//                                 src={builder.logo || 'https://via.placeholder.com/150'}
//                                 alt={`${builder.name} logo`}
//                                 className="w-16 h-16 rounded-full mr-4 object-cover"
//                             />
//                             <div>
//                                 <h2 className="text-xl font-bold text-gray-800">{builder.name}</h2>
//                                 <p className="text-gray-500">{builder.company}</p>
//                             </div>
//                         </div>

//                         {/* Statistics */}
//                         <div className="mb-4 px-2 py-1 bg-gray-100 rounded">
//                             <p className="text-sm text-gray-600">
//                                 <span className="font-semibold">Buildings:</span> {builder.buildings?.length || 0}
//                             </p>
//                             <p className="text-sm text-gray-600">
//                                 <span className="font-semibold">Projects:</span> {builder.projects?.length || 0}
//                             </p>
//                         </div>

//                         {/* Action buttons */}
//                         <div className="grid grid-cols-2 gap-2 mb-2">
//                             <button
//                                 onClick={() => navigate(`/builder/connect-buildings/${builder._id}`)}
//                                 className="flex items-center justify-center bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition text-sm"
//                             >
//                                 <FaBuilding className="mr-1" /> Connect Buildings
//                             </button>
//                             <button
//                                 onClick={() => navigate(`/builder/disconnect-buildings/${builder._id}`)}
//                                 className="flex items-center justify-center bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600 transition text-sm"
//                             >
//                                 <FaUnlink className="mr-1" /> Disconnect Buildings
//                             </button>
//                         </div>

//                         {/* Project connection buttons */}
//                         <div className="grid grid-cols-2 gap-2 mb-4">
//                             <button
//                                 onClick={() => navigate(`/builder/connect-projects/${builder._id}`)}
//                                 className="flex items-center justify-center bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition text-sm"
//                             >
//                                 <FaProjectDiagram className="mr-1" /> Connect Projects
//                             </button>
//                             <button
//                                 onClick={() => navigate(`/builder/disconnect-projects/${builder._id}`)}
//                                 className="flex items-center justify-center bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition text-sm"
//                             >
//                                 <FaProjectDiagram className="mr-1" /> Disconnect Projects
//                             </button>
//                         </div>

//                         <div className="flex justify-between items-center mt-4">
//                             <button
//                                 onClick={() => navigate(`/builder/detail/${builder._id}`)}
//                                 className="text-blue-500 hover:text-blue-600 transition"
//                             >
//                                 <FaEye className="mr-2 inline" /> View
//                             </button>
//                             <button
//                                 onClick={() => navigate(`/builder/update/${builder._id}`)}
//                                 className="text-green-500 hover:text-green-600 transition"
//                             >
//                                 <FaEdit className="mr-2 inline" /> Edit
//                             </button>
//                             <button
//                                 onClick={() => handleDelete(builder._id)}
//                                 className="text-red-500 hover:text-red-600 transition"
//                             >
//                                 <FaTrash className="mr-2 inline" /> Delete
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default BuilderListPage;

import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaEye, FaLink, FaUnlink, FaBuilding, FaProjectDiagram, FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { base_url } from '../../../utils/base_url';

const BuilderListPage = () => {
    const [builders, setBuilders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBuilders();
    }, []);

    const fetchBuilders = async () => {
        try {
            const response = await fetch(`${base_url}/builders`);
            const data = await response.json();
            setBuilders(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching builders:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (builderId) => {
        if (window.confirm('Are you sure you want to delete this builder?')) {
            try {
                const response = await fetch(`${base_url}/api/builder/building/connection/builders/${builderId}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    setBuilders(builders.filter(builder => builder._id !== builderId));
                }
            } catch (error) {
                console.error('Error deleting builder:', error);
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Builders</h1>
                <button
                    onClick={() => navigate('/builder/upload')}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                >
                    Add New Builder
                </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {builders.map(builder => (
                    <div
                        key={builder._id}
                        className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition"
                    >
                        <div className="flex items-center mb-4">
                            <img
                                src={builder.logo || 'https://via.placeholder.com/150'}
                                alt={`${builder.name} logo`}
                                className="w-16 h-16 rounded-full mr-4 object-cover"
                            />
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">{builder.name}</h2>
                                <p className="text-gray-500">{builder.company}</p>
                            </div>
                        </div>

                        {/* Statistics */}
                        <div className="mb-4 px-2 py-1 bg-gray-100 rounded">
                            <p className="text-sm text-gray-600">
                                <span className="font-semibold">Buildings:</span> {builder.buildings?.length || 0}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-semibold">Projects:</span> {builder.projects?.length || 0}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-semibold">Properties:</span> {builder.properties?.length || 0}
                            </p>
                        </div>

                        {/* Building connection buttons */}
                        <div className="grid grid-cols-2 gap-2 mb-2">
                            <button
                                onClick={() => navigate(`/builder/connect-buildings/${builder._id}`)}
                                className="flex items-center justify-center bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition text-sm"
                            >
                                <FaBuilding className="mr-1" /> Connect Buildings
                            </button>
                            <button
                                onClick={() => navigate(`/builder/disconnect-buildings/${builder._id}`)}
                                className="flex items-center justify-center bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600 transition text-sm"
                            >
                                <FaUnlink className="mr-1" /> Disconnect Buildings
                            </button>
                        </div>

                        {/* Project connection buttons */}
                        <div className="grid grid-cols-2 gap-2 mb-2">
                            <button
                                onClick={() => navigate(`/builder/connect-projects/${builder._id}`)}
                                className="flex items-center justify-center bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition text-sm"
                            >
                                <FaProjectDiagram className="mr-1" /> Connect Projects
                            </button>
                            <button
                                onClick={() => navigate(`/builder/disconnect-projects/${builder._id}`)}
                                className="flex items-center justify-center bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition text-sm"
                            >
                                <FaProjectDiagram className="mr-1" /> Disconnect Projects
                            </button>
                        </div>

                        {/* Property connection buttons - NEW */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <button
                                onClick={() => navigate(`/builder/connect-properties/${builder._id}`)}
                                className="flex items-center justify-center bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600 transition text-sm"
                            >
                                <FaHome className="mr-1" /> Connect Properties
                            </button>
                            <button
                                onClick={() => navigate(`/builder/disconnect-properties/${builder._id}`)}
                                className="flex items-center justify-center bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition text-sm"
                            >
                                <FaHome className="mr-1" /> Disconnect Properties
                            </button>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                            <button
                                onClick={() => navigate(`/builder/detail/${builder._id}`)}
                                className="text-blue-500 hover:text-blue-600 transition"
                            >
                                <FaEye className="mr-2 inline" /> View
                            </button>
                            <button
                                onClick={() => navigate(`/builder/update/${builder._id}`)}
                                className="text-green-500 hover:text-green-600 transition"
                            >
                                <FaEdit className="mr-2 inline" /> Edit
                            </button>
                            <button
                                onClick={() => handleDelete(builder._id)}
                                className="text-red-500 hover:text-red-600 transition"
                            >
                                <FaTrash className="mr-2 inline" /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BuilderListPage;