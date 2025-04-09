
// import React, { useState, useEffect } from 'react';
// import { RefreshCw, Edit, Trash, Save, X, ArrowUp, ArrowDown } from 'lucide-react';
// import { base_url } from "../../../utils/base_url";

// const ListOptionsSequence = () => {
//     const [selectedLists, setSelectedLists] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [isEditing, setIsEditing] = useState(false);
//     const [error, setError] = useState(null);
//     const [notification, setNotification] = useState({ show: false, message: '', type: '' });

//     // Load available lists on component mount
//     useEffect(() => {
//         loadAvailableLists();
//     }, []);

//     const loadAvailableLists = async () => {
//         try {
//             setLoading(true);
//             setError(null);
//             const response = await fetch(`${base_url}/api/list-options`);

//             if (!response.ok) {
//                 const errorData = await response.json().catch(() => ({}));
//                 throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//             }

//             const lists = await response.json();
//             console.log('Loaded lists:', lists);

//             // Sort lists by their current sequence (if available)
//             const sortedLists = lists.sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
//             setSelectedLists(sortedLists);
//         } catch (error) {
//             console.error('Error loading available lists:', error);
//             setError(error.message);
//             showNotification(`Failed to load lists: ${error.message}`, 'error');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const showNotification = (message, type = 'info') => {
//         setNotification({ show: true, message, type });
//         setTimeout(() => {
//             setNotification({ ...notification, show: false });
//         }, 3000);
//     };

//     // Move list up in the sequence
//     const moveListUp = (index) => {
//         if (index === 0) return;

//         const newLists = [...selectedLists];
//         const temp = newLists[index];
//         newLists[index] = newLists[index - 1];
//         newLists[index - 1] = temp;
//         setSelectedLists(newLists);
//     };

//     // Move list down in the sequence
//     const moveListDown = (index) => {
//         if (index === selectedLists.length - 1) return;

//         const newLists = [...selectedLists];
//         const temp = newLists[index];
//         newLists[index] = newLists[index + 1];
//         newLists[index + 1] = temp;
//         setSelectedLists(newLists);
//     };

//     // Save the new sequence
//     const saveSequence = async () => {
//         try {
//             setLoading(true);
//             setError(null);

//             // Debug: Log the lists we're about to update
//             console.log('Lists to update sequence:', selectedLists);

//             // Prepare sequence updates with validation
//             const sequenceUpdates = selectedLists.map((list, index) => {
//                 if (!list._id) {
//                     throw new Error(`Missing _id for list at index ${index} (${list.listName || 'unknown'})`);
//                 }

//                 // Ensure the id is correctly formatted (it should be a string)
//                 const id = list._id.toString();
//                 console.log(`List ${index + 1}: ${list.listName} (ID: ${id})`);

//                 return {
//                     id: id,
//                     sequence: index
//                 };
//             });

//             console.log('Submitting sequence updates:', sequenceUpdates);

//             const response = await fetch(`${base_url}/api/list-options/update-sequence`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ sequenceUpdates })
//             });

//             // Log the raw response
//             console.log('Response status:', response.status);

//             // Handle error responses
//             if (!response.ok) {
//                 const errorData = await response.json().catch(() => ({}));
//                 throw new Error(errorData.message || `Server error: ${response.status}`);
//             }

//             const result = await response.json();
//             console.log('Sequence update result:', result);

//             showNotification(
//                 `List sequence updated successfully. Modified ${result.modifiedCount} items.`,
//                 'success'
//             );
//             setIsEditing(false);

//             // Refresh the list to show updated sequence values
//             await loadAvailableLists();
//         } catch (error) {
//             console.error('Error updating list sequence:', error);
//             setError(error.message);
//             showNotification(`Failed to update list sequence: ${error.message}`, 'error');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="">
//             <h1 className="text-2xl font-bold mb-6 text-gray-800">List Options Sequence Management</h1>

//             {/* Error Display */}
//             {error && (
//                 <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
//                     <p className="font-medium">Error:</p>
//                     <p>{error}</p>
//                 </div>
//             )}

//             {/* Lists Sequence Section */}
//             <div className="bg-gray-50 p-4 rounded-lg mb-6">
//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-lg font-semibold text-gray-700">
//                         List Order {isEditing ? '(Editing)' : ''}
//                     </h2>

//                     <div className="flex gap-2">
//                         {!isEditing ? (
//                             <>
//                                 <button
//                                     onClick={() => setIsEditing(true)}
//                                     className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
//                                     disabled={loading || selectedLists.length === 0}
//                                 >
//                                     <Edit className="w-5 h-5" />
//                                     Edit Sequence
//                                 </button>
//                                 <button
//                                     onClick={loadAvailableLists}
//                                     className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
//                                     disabled={loading}
//                                 >
//                                     <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
//                                     Refresh
//                                 </button>
//                             </>
//                         ) : (
//                             <>
//                                 <button
//                                     onClick={saveSequence}
//                                     className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
//                                     disabled={loading}
//                                 >
//                                     {loading ? (
//                                         <RefreshCw className="w-5 h-5 animate-spin" />
//                                     ) : (
//                                         <Save className="w-5 h-5" />
//                                     )}
//                                     {loading ? 'Saving...' : 'Save Sequence'}
//                                 </button>
//                                 <button
//                                     onClick={() => {
//                                         loadAvailableLists();
//                                         setIsEditing(false);
//                                     }}
//                                     className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
//                                     disabled={loading}
//                                 >
//                                     <X className="w-5 h-5" />
//                                     Cancel
//                                 </button>
//                             </>
//                         )}
//                     </div>
//                 </div>

//                 {loading && !isEditing ? (
//                     <div className="flex justify-center py-12">
//                         <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
//                     </div>
//                 ) : selectedLists.length > 0 ? (
//                     <div className="space-y-4">
//                         {selectedLists.map((list, index) => (
//                             <div
//                                 key={list._id || index}
//                                 className="bg-white p-4 rounded-md border border-gray-200 shadow-sm flex items-center justify-between"
//                             >
//                                 <div className="flex-grow">
//                                     <div className="flex items-center gap-2">
//                                         <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-xs">
//                                             {index + 1}
//                                         </span>
//                                         <h3 className="font-medium text-gray-800">{list.listName}</h3>
//                                         <span className="text-xs text-gray-500">
//                                             (ID: {list._id ? list._id.toString().substring(0, 8) + '...' : 'missing'})
//                                         </span>
//                                     </div>
//                                     <p className="text-sm text-gray-600 mt-1">{list.title || 'No title'}</p>
//                                     <div className="mt-2 flex flex-wrap gap-2">
//                                         {list.city && (
//                                             <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
//                                                 City: {list.city}
//                                             </span>
//                                         )}
//                                         <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
//                                             Sequence: {list.sequence !== undefined ? list.sequence : 'not set'}
//                                         </span>
//                                         <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
//                                             Options: {list.options ? list.options.length : 0}
//                                         </span>
//                                     </div>
//                                 </div>

//                                 {isEditing && (
//                                     <div className="flex items-center gap-2">
//                                         <button
//                                             onClick={() => moveListUp(index)}
//                                             disabled={index === 0}
//                                             className={`p-2 rounded-md ${index === 0
//                                                 ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
//                                                 : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
//                                                 }`}
//                                             title="Move Up"
//                                         >
//                                             <ArrowUp className="w-5 h-5" />
//                                         </button>
//                                         <button
//                                             onClick={() => moveListDown(index)}
//                                             disabled={index === selectedLists.length - 1}
//                                             className={`p-2 rounded-md ${index === selectedLists.length - 1
//                                                 ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
//                                                 : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
//                                                 }`}
//                                             title="Move Down"
//                                         >
//                                             <ArrowDown className="w-5 h-5" />
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>
//                         ))}
//                     </div>
//                 ) : (
//                     <div className="bg-white p-8 rounded-md border border-gray-200 text-center text-gray-500">
//                         {error ? 'Error loading lists. Please try refreshing.' : 'No lists found. Please create some lists first.'}
//                     </div>
//                 )}
//             </div>

//             {/* Notification Toast */}
//             {notification.show && (
//                 <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 ${notification.type === 'success'
//                         ? 'bg-green-500 text-white'
//                         : notification.type === 'error'
//                             ? 'bg-red-500 text-white'
//                             : 'bg-blue-500 text-white'
//                     }`}>
//                     <span>{notification.message}</span>
//                     <button onClick={() => setNotification({ ...notification, show: false })} className="text-white">
//                         <X className="w-4 h-4" />
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ListOptionsSequence;



import React, { useState, useEffect } from 'react';
import {
    RefreshCw,
    Edit,
    Save,
    X,
    ArrowUp,
    ArrowDown,
    GripVertical,
    Eye,
    Search,
    Filter,
    SortAsc,
    SortDesc,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { base_url } from "../../../utils/base_url";

const ListOptionsSequence = () => {
    const [selectedLists, setSelectedLists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [draggedItem, setDraggedItem] = useState(null);
    const [sortMethod, setSortMethod] = useState('sequence'); // sequence, name, city, options
    const [sortDirection, setSortDirection] = useState('asc'); // asc, desc

    // Load available lists on component mount
    useEffect(() => {
        loadAvailableLists();
    }, []);

    const loadAvailableLists = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${base_url}/api/list-options`);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const lists = await response.json();
            console.log('Loaded lists:', lists);

            // Sort lists by their current sequence (if available)
            const sortedLists = lists.sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
            setSelectedLists(sortedLists);
        } catch (error) {
            console.error('Error loading available lists:', error);
            setError(error.message);
            showNotification(`Failed to load lists: ${error.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (message, type = 'info') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ ...notification, show: false });
        }, 3000);
    };

    // Move list up in the sequence
    const moveListUp = (index) => {
        if (index === 0) return;

        const newLists = [...selectedLists];
        const temp = newLists[index];
        newLists[index] = newLists[index - 1];
        newLists[index - 1] = temp;
        setSelectedLists(newLists);
    };

    // Move list down in the sequence
    const moveListDown = (index) => {
        if (index === selectedLists.length - 1) return;

        const newLists = [...selectedLists];
        const temp = newLists[index];
        newLists[index] = newLists[index + 1];
        newLists[index + 1] = temp;
        setSelectedLists(newLists);
    };

    // Drag and drop handlers
    const handleDragStart = (e, index) => {
        setDraggedItem(index);
        e.dataTransfer.effectAllowed = 'move';
        // Make the drag image transparent
        const dragImg = document.createElement('div');
        dragImg.style.position = 'absolute';
        dragImg.style.top = '-1000px';
        document.body.appendChild(dragImg);
        e.dataTransfer.setDragImage(dragImg, 0, 0);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        const draggedOverItem = selectedLists[index];

        // If item is dragged over itself, ignore
        if (draggedItem === index) {
            return;
        }

        // Filter out the currently dragged item
        let newLists = [...selectedLists];
        const draggedItemContent = newLists.splice(draggedItem, 1)[0];

        // Add the dragged item after the dragged over item
        newLists.splice(index, 0, draggedItemContent);

        // Update the actual array and draggedItem
        setSelectedLists(newLists);
        setDraggedItem(index);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
    };

    // Save the new sequence
    const saveSequence = async () => {
        try {
            setLoading(true);
            setError(null);

            // Debug: Log the lists we're about to update
            console.log('Lists to update sequence:', selectedLists);

            // Prepare sequence updates with validation
            const sequenceUpdates = selectedLists.map((list, index) => {
                if (!list._id) {
                    throw new Error(`Missing _id for list at index ${index} (${list.listName || 'unknown'})`);
                }

                // Ensure the id is correctly formatted (it should be a string)
                const id = list._id.toString();
                console.log(`List ${index + 1}: ${list.listName} (ID: ${id})`);

                return {
                    id: id,
                    sequence: index
                };
            });

            console.log('Submitting sequence updates:', sequenceUpdates);

            const response = await fetch(`${base_url}/api/list-options/update-sequence`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sequenceUpdates })
            });

            // Log the raw response
            console.log('Response status:', response.status);

            // Handle error responses
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Server error: ${response.status}`);
            }

            const result = await response.json();
            console.log('Sequence update result:', result);

            showNotification(
                `List sequence updated successfully. Modified ${result.modifiedCount} items.`,
                'success'
            );
            setIsEditing(false);

            // Refresh the list to show updated sequence values
            await loadAvailableLists();
        } catch (error) {
            console.error('Error updating list sequence:', error);
            setError(error.message);
            showNotification(`Failed to update list sequence: ${error.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    // Sort and filter functions
    const handleSort = (method) => {
        // If clicking the same method, toggle direction
        if (method === sortMethod) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortMethod(method);
            setSortDirection('asc');
        }

        const newLists = [...selectedLists];

        switch (method) {
            case 'name':
                newLists.sort((a, b) => {
                    const aName = a.listName || '';
                    const bName = b.listName || '';
                    return sortDirection === 'asc'
                        ? aName.localeCompare(bName)
                        : bName.localeCompare(aName);
                });
                break;
            case 'city':
                newLists.sort((a, b) => {
                    const aCity = a.city || '';
                    const bCity = b.city || '';
                    return sortDirection === 'asc'
                        ? aCity.localeCompare(bCity)
                        : bCity.localeCompare(aCity);
                });
                break;
            case 'options':
                newLists.sort((a, b) => {
                    const aOptions = a.options ? a.options.length : 0;
                    const bOptions = b.options ? b.options.length : 0;
                    return sortDirection === 'asc'
                        ? aOptions - bOptions
                        : bOptions - aOptions;
                });
                break;
            case 'sequence':
            default:
                newLists.sort((a, b) => {
                    const aSeq = a.sequence || 0;
                    const bSeq = b.sequence || 0;
                    return sortDirection === 'asc'
                        ? aSeq - bSeq
                        : bSeq - aSeq;
                });
                break;
        }

        setSelectedLists(newLists);
    };

    // Filter lists based on search term
    const filteredLists = selectedLists.filter(list => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (list.listName && list.listName.toLowerCase().includes(searchLower)) ||
            (list.title && list.title.toLowerCase().includes(searchLower)) ||
            (list.city && list.city.toLowerCase().includes(searchLower))
        );
    });

    return (
        <div className="mx-auto ">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-xl shadow-lg mb-8">
                <h1 className="text-3xl font-bold text-white">List Options Sequence Management</h1>
                <p className="text-blue-100 mt-2">Customize the order and organization of your list options</p>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 shadow-md">
                    <div className="flex">
                        <XCircle className="w-6 h-6 mr-2" />
                        <div>
                            <p className="font-semibold">Error</p>
                            <p>{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Controls Section */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        <div className="relative w-full lg:w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Search lists..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="font-medium text-gray-700 hidden md:block">Sort by:</div>
                            <div className="inline-flex rounded-md shadow-sm">
                                <button
                                    className={`px-3 py-2 border text-sm font-medium ${sortMethod === 'sequence'
                                        ? 'bg-blue-50 text-blue-700 border-blue-300'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'} 
                                        rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                                    onClick={() => handleSort('sequence')}
                                >
                                    Order
                                </button>
                                <button
                                    className={`px-3 py-2 border-t border-b border-r text-sm font-medium ${sortMethod === 'name'
                                        ? 'bg-blue-50 text-blue-700 border-blue-300'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'} 
                                        focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                                    onClick={() => handleSort('name')}
                                >
                                    Name
                                </button>
                                <button
                                    className={`px-3 py-2 border-t border-b border-r text-sm font-medium ${sortMethod === 'city'
                                        ? 'bg-blue-50 text-blue-700 border-blue-300'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'} 
                                        focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                                    onClick={() => handleSort('city')}
                                >
                                    City
                                </button>
                                <button
                                    className={`px-3 py-2 border-t border-b border-r text-sm font-medium ${sortMethod === 'options'
                                        ? 'bg-blue-50 text-blue-700 border-blue-300'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'} 
                                        rounded-r-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                                    onClick={() => handleSort('options')}
                                >
                                    Options
                                </button>
                            </div>

                            <button
                                className="p-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                                title={sortDirection === 'asc' ? "Sort Ascending" : "Sort Descending"}
                            >
                                {sortDirection === 'asc' ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-2 w-full lg:w-auto justify-end">
                        {!isEditing ? (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition-colors"
                                    disabled={loading || selectedLists.length === 0}
                                >
                                    <Edit className="w-5 h-5" />
                                    <span className="hidden sm:inline">Edit Sequence</span>
                                    <span className="sm:hidden">Edit</span>
                                </button>
                                <button
                                    onClick={loadAvailableLists}
                                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md shadow transition-colors"
                                    disabled={loading}
                                >
                                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                                    <span className="hidden sm:inline">Refresh</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={saveSequence}
                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow transition-colors"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Save className="w-5 h-5" />
                                    )}
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                    onClick={() => {
                                        loadAvailableLists();
                                        setIsEditing(false);
                                    }}
                                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md shadow transition-colors"
                                    disabled={loading}
                                >
                                    <X className="w-5 h-5" />
                                    <span className="hidden sm:inline">Cancel</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {isEditing && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <Eye className="h-5 w-5 text-blue-600" aria-hidden="true" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-blue-700">
                                    <span className="font-semibold">Edit Mode Active</span> - Drag and drop list items or use the arrow buttons to reorder them. Click Save when you're done.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Lists Section */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
                {loading && !isEditing ? (
                    <div className="flex justify-center items-center py-16">
                        <div className="flex flex-col items-center">
                            <RefreshCw className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                            <p className="text-gray-600">Loading lists...</p>
                        </div>
                    </div>
                ) : filteredLists.length > 0 ? (
                    <div className={`space-y-4 ${isEditing ? 'cursor-move' : ''}`}>
                        {filteredLists.map((list, index) => (
                            <div
                                key={list._id || index}
                                className={`bg-white p-4 rounded-xl ${isEditing
                                    ? 'border-2 border-dashed border-blue-200 hover:border-blue-400'
                                    : 'border border-gray-200'} 
                                    shadow-sm transition-all transform hover:shadow-md 
                                    ${draggedItem === index ? 'opacity-50' : 'opacity-100'}`}
                                draggable={isEditing}
                                onDragStart={isEditing ? (e) => handleDragStart(e, index) : null}
                                onDragOver={isEditing ? (e) => handleDragOver(e, index) : null}
                                onDragEnd={isEditing ? handleDragEnd : null}
                            >
                                <div className="flex items-center gap-3">
                                    {isEditing && (
                                        <div className="flex-shrink-0 text-gray-400 cursor-grab">
                                            <GripVertical className="w-6 h-6" />
                                        </div>
                                    )}

                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2 md:gap-3">
                                            <span className="bg-blue-600 text-white px-2.5 py-1 rounded-md text-sm font-medium">
                                                {index + 1}
                                            </span>
                                            <h3 className="font-medium text-lg text-gray-800">{list.listName}</h3>
                                            <span className="text-xs text-gray-500 hidden sm:inline-block">
                                                ID: {list._id ? `${list._id.toString().substring(0, 8)}...` : 'missing'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{list.title || 'No title'}</p>

                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {list.city && (
                                                <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full">
                                                    <span className="font-medium">City:</span> {list.city}
                                                </span>
                                            )}
                                            <span className="inline-flex items-center bg-purple-100 text-purple-800 text-xs px-2.5 py-1 rounded-full">
                                                <span className="font-medium">Sequence:</span> {list.sequence !== undefined ? list.sequence : 'not set'}
                                            </span>
                                            <span className="inline-flex items-center bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full">
                                                <span className="font-medium">Options:</span> {list.options ? list.options.length : 0}
                                            </span>
                                        </div>
                                    </div>

                                    {isEditing && (
                                        <div className="flex items-center gap-1 md:gap-2">
                                            <button
                                                onClick={() => moveListUp(index)}
                                                disabled={index === 0}
                                                className={`p-2 rounded-full ${index === 0
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:shadow-sm'
                                                    } transition-colors`}
                                                title="Move Up"
                                            >
                                                <ArrowUp className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => moveListDown(index)}
                                                disabled={index === selectedLists.length - 1}
                                                className={`p-2 rounded-full ${index === selectedLists.length - 1
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:shadow-sm'
                                                    } transition-colors`}
                                                title="Move Down"
                                            >
                                                <ArrowDown className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 text-center">
                        <div className="flex flex-col items-center">
                            <Filter className="w-12 h-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-700 mb-2">No Lists Found</h3>
                            {searchTerm ? (
                                <p className="text-gray-500">No lists match your search for "{searchTerm}". Try a different search term.</p>
                            ) : error ? (
                                <p className="text-gray-500">Error loading lists. Please try refreshing.</p>
                            ) : (
                                <p className="text-gray-500">No lists found. Please create some lists first.</p>
                            )}
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-800"
                                >
                                    <X className="w-4 h-4" /> Clear search
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Notification Toast */}
            {notification.show && (
                <div
                    className={`fixed bottom-4 right-4 flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg transform transition-all duration-300 ease-out ${notification.type === 'success'
                            ? 'bg-green-600 text-white'
                            : notification.type === 'error'
                                ? 'bg-red-600 text-white'
                                : 'bg-blue-600 text-white'
                        }`}
                >
                    {notification.type === 'success' ? (
                        <CheckCircle className="w-5 h-5" />
                    ) : notification.type === 'error' ? (
                        <XCircle className="w-5 h-5" />
                    ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    )}
                    <span className="font-medium">{notification.message}</span>
                    <button
                        onClick={() => setNotification({ ...notification, show: false })}
                        className="ml-2 text-white p-1 hover:bg-white hover:bg-opacity-20 rounded-full"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ListOptionsSequence;