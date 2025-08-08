// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { getAuthConfig } from '../../../utils/authConfig';
// import { base_url } from '../../../utils/base_url';

// const AndroidFeedPreview = () => {
//     const [feedData, setFeedData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [coordinates, setCoordinates] = useState({
//         latitude: 26.4737067,
//         longitude: 80.2857217
//     });

//     // Filter sections the same way it's done in the Android adapter
//     const filterSections = (sections) => {
//         return sections.map(section => {
//             // Transform projectsSection and buildingsSection the same way Android does
//             if (section.projectsSection) {
//                 return section.projectsSection;
//             } else if (section.buildingsSection) {
//                 return section.buildingsSection;
//             } else {
//                 return section;
//             }
//         }).filter(section => {
//             // Filter based on content existence
//             switch (section.sectionType) {
//                 case "propertyList":
//                     return section.properties && section.properties.length > 0;
//                 case "optionList":
//                     return section.options && section.options.length > 0;
//                 case "projectList":
//                     return section.projects && section.projects.length > 0;
//                 case "buildingList":
//                     return section.buildings && section.buildings.length > 0;
//                 default:
//                     return true;
//             }
//         });
//     };

//     // Fetch data from real API
//     const fetchData = async () => {
//         try {
//             setLoading(true);
//             setError(null);

//             // Fetch data from the real API
//             const response = await fetch(`${base_url}/api/home-feed?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}` , getAuthConfig());

//             if (!response.ok) {
//                 throw new Error(`API request failed with status ${response.status}`);
//             }

//             const data = await response.json();

//             // Apply the same filtering logic as in the Android adapter
//             const filteredData = filterSections(data);

//             console.log("API data fetched successfully:", filteredData);
//             setFeedData(filteredData);
//             setLoading(false);
//         } catch (err) {
//             console.error("Error fetching feed data:", err);
//             setError("Failed to load feed: " + err.message);
//             setLoading(false);

//             // Fallback to sample data if API fails
//             try {
//                 console.log("Falling back to sample data");
//                 const fileResponse = await window.fs.readFile('paste.txt', { encoding: 'utf8' });
//                 const fixedResponse = fileResponse.replace('\"\"\"\"', '\"\"');
//                 const sampleData = JSON.parse(fixedResponse);

//                 const filteredSampleData = filterSections(sampleData);
//                 setFeedData(filteredSampleData);
//                 setError("Using sample data (API call failed): " + err.message);
//             } catch (fallbackErr) {
//                 console.error("Error loading fallback data:", fallbackErr);
//             }
//         }
//     };

//     useEffect(() => {
//         fetchData();
//     }, []);

//     const handleRefresh = useCallback(() => {
//         fetchData();
//     }, [coordinates]);

//     return (
//         <div className="flex flex-col items-center w-full">
//             <div className="flex w-full max-w-md mb-4">
//                 <label className="flex-1 mr-2">
//                     <span className="block text-sm mb-1">Latitude</span>
//                     <input
//                         type="text"
//                         value={coordinates.latitude}
//                         onChange={(e) => setCoordinates({ ...coordinates, latitude: e.target.value })}
//                         className="w-full p-2 border rounded"
//                     />
//                 </label>
//                 <label className="flex-1">
//                     <span className="block text-sm mb-1">Longitude</span>
//                     <input
//                         type="text"
//                         value={coordinates.longitude}
//                         onChange={(e) => setCoordinates({ ...coordinates, longitude: e.target.value })}
//                         className="w-full p-2 border rounded"
//                     />
//                 </label>
//             </div>

//             <button
//                 onClick={handleRefresh}
//                 className="mb-4 bg-blue-500 text-white py-2 px-4 rounded"
//             >
//                 Refresh Feed
//             </button>

//             {/* Android device frame */}
//             <div className="relative w-full max-w-md border-8 border-gray-800 rounded-3xl shadow-lg overflow-hidden bg-black" style={{ height: '700px' }}>
//                 {/* Status bar */}
//                 <div className="h-6 bg-black text-white flex justify-between items-center px-4 text-xs">
//                     <div>11:20</div>
//                     <div className="flex items-center space-x-1">
//                         <span>📶</span>
//                         <span>📡</span>
//                         <span>🔋</span>
//                     </div>
//                 </div>

//                 {/* App UI */}
//                 <div className="bg-gray-100 h-full overflow-hidden flex flex-col">
//                     {/* App bar */}
//                     <div className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
//                         <div className="text-lg font-semibold">Property Feed</div>
//                         <div className="flex space-x-3">
//                             <span>🔍</span>
//                             <span>⋮</span>
//                         </div>
//                     </div>

//                     {/* Content area */}
//                     <div className="flex-1 overflow-y-auto pb-16">
//                         {loading ? (
//                             <div className="flex justify-center items-center h-full">
//                                 <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//                             </div>
//                         ) : error ? (
//                             <div className="p-4 m-4 bg-red-100 text-red-700 rounded">
//                                 {error}
//                             </div>
//                         ) : (
//                             <div className="p-2 space-y-4">
//                                 {feedData.map((section, index) => (
//                                     <HomeFeedSection key={index} section={section} />
//                                 ))}
//                             </div>
//                         )}
//                     </div>

//                     {/* Bottom navigation */}
//                     <div className="absolute bottom-0 left-0 right-0 h-16 bg-white flex justify-around items-center shadow-up border-t border-gray-200">
//                         <div className="flex flex-col items-center">
//                             <span className="text-blue-500">🏠</span>
//                             <span className="text-xs text-blue-500">Home</span>
//                         </div>
//                         <div className="flex flex-col items-center">
//                             <span className="text-gray-500">🔍</span>
//                             <span className="text-xs">Search</span>
//                         </div>
//                         <div className="flex flex-col items-center">
//                             <span className="text-gray-500">❤️</span>
//                             <span className="text-xs">Saved</span>
//                         </div>
//                         <div className="flex flex-col items-center">
//                             <span className="text-gray-500">👤</span>
//                             <span className="text-xs">Profile</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// // HomeFeedSection component - mimicking the Android adapter's ViewHolder
// const HomeFeedSection = ({ section }) => {
//     const getBackgroundColor = (colorString) => {
//         if (colorString && colorString.startsWith("#")) {
//             try {
//                 return { backgroundColor: colorString };
//             } catch (e) {
//                 return {};
//             }
//         }
//         return {};
//     };

//     const renderSectionContent = () => {
//         console.log("Rendering section type:", section.sectionType);
//         switch (section.sectionType) {
//             case "propertyList":
//                 return <PropertyList properties={section.properties || []} />;
//             case "optionList":
//                 return <OptionList options={section.options || []} section={section} />;
//             case "projectList":
//                 return <ProjectList projects={section.projects || []} viewType={section.viewType} />;
//             case "buildingList":
//                 return <BuildingList buildings={section.buildings || []} viewType={section.viewType} />;
//             default:
//                 return <div className="p-2 text-gray-500">Unknown section type: {section.sectionType}</div>;
//         }
//     };

//     // Handle visibility of title/subtitle based on section type
//     const showHeader = section.sectionType !== "optionList";

//     return (
//         <div className="bg-white rounded-lg shadow mb-4 overflow-hidden">
//             {/* Header Image */}
//             {section.headerImage && section.headerImage !== "" && (
//                 <div className="w-full">
//                     <img
//                         src={section.headerImage}
//                         alt="Header"
//                         className="w-full h-32 object-cover"
//                         onError={(e) => {
//                             e.target.onerror = null;
//                             e.target.src = "/api/placeholder/400/150";
//                         }}
//                     />
//                 </div>
//             )}

//             {/* Title and Subtitle */}
//             {showHeader && (
//                 <div className="p-3">
//                     <h2 className="text-base font-bold">{section.title}</h2>
//                     <p className="text-xs text-gray-600">{section.subtitle}</p>
//                 </div>
//             )}

//             {/* Content */}
//             <div
//                 className="w-full overflow-hidden"
//                 style={getBackgroundColor(section.backgroundColor)}
//             >
//                 {renderSectionContent()}
//             </div>

//             {/* Button */}
//             {section.buttonText && (
//                 <div className="p-2 flex justify-end">
//                     <button
//                         className="px-4 py-1 text-sm rounded"
//                         style={getBackgroundColor(section.buttonColor || '#f0f0f0')}
//                     >
//                         {section.buttonText}
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// // PropertyList component
// const PropertyList = ({ properties }) => {
//     return (
//         <div className="p-2">
//             {properties.map((property, index) => (
//                 <div
//                     key={index}
//                     className="mb-2 mx-1 overflow-hidden"
//                 >
//                     {/* MaterialCardView replica */}
//                     <div className="rounded-lg overflow-hidden border border-blue-500 bg-white shadow">
//                         <div className="flex">
//                             {/* Left Accent Bar */}
//                             <div className="w-2 bg-blue-500"></div>

//                             {/* Main Content Container */}
//                             <div className="flex p-2 flex-1 items-center">
//                                 {/* Property Image Container */}
//                                 <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 shadow">
//                                     <img
//                                         src={property.image || "/api/placeholder/96/96"}
//                                         alt={property.title}
//                                         className="w-full h-full object-cover"
//                                         onError={(e) => {
//                                             e.target.onerror = null;
//                                             e.target.src = "/api/placeholder/96/96";
//                                         }}
//                                     />
//                                 </div>

//                                 {/* Property Details */}
//                                 <div className="ml-3 flex-1">
//                                     {/* Property Name and Favorite */}
//                                     <div className="flex justify-between items-start">
//                                         <div className="font-semibold text-base text-gray-800 truncate pr-2 flex-1">
//                                             {property.title}
//                                         </div>
//                                         <button className="w-5 h-5 flex-shrink-0 text-gray-400">
//                                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                                 <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
//                                             </svg>
//                                         </button>
//                                     </div>

//                                     {/* Property Type */}
//                                     <div className="text-xs text-green-700 mt-1">
//                                         Apartment
//                                     </div>

//                                     {/* Property Specs */}
//                                     <div className="text-xs text-gray-600 mt-1">
//                                         {property.subtitle || "2 BHK"} • {property.area} sq.ft
//                                     </div>

//                                     {/* Price and Status */}
//                                     <div className="flex justify-between items-center mt-1">
//                                         <div className="text-sm text-blue-600 font-medium">
//                                             {property.price}
//                                         </div>
//                                         <div className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
//                                             Ready to move
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// };

// // OptionList component
// const OptionList = ({ options, section }) => {
//     const categoryType = section.categoryType?.toLowerCase();

//     // Render based on categoryType
//     if (categoryType === "single_item" && options.length > 0) {
//         return (
//             <div className="p-2">
//                 <div className="w-full">
//                     <img
//                         src={options[0].imagelink || "/api/placeholder/400/150"}
//                         alt={options[0].textview}
//                         className="w-full h-32 object-cover rounded"
//                         onError={(e) => {
//                             e.target.onerror = null;
//                             e.target.src = "/api/placeholder/400/150";
//                         }}
//                     />
//                     <div className="text-xs text-center mt-1">{options[0].textview}</div>
//                 </div>
//             </div>
//         );
//     }

//     if (categoryType === "grid_view") {
//         return (
//             <div className="p-2">
//                 <div className="grid grid-cols-2 gap-2">
//                     {options.map((option, index) => (
//                         <div key={index} className="text-center">
//                             <div className="h-24 rounded overflow-hidden">
//                                 <img
//                                     src={option.imagelink || "/api/placeholder/120/96"}
//                                     alt={option.textview}
//                                     className="w-full h-full object-cover"
//                                     onError={(e) => {
//                                         e.target.onerror = null;
//                                         e.target.src = "/api/placeholder/120/96";
//                                     }}
//                                 />
//                             </div>
//                             <div className="text-xs truncate mt-1">{option.textview}</div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         );
//     }

//     if (categoryType === "carousal" || categoryType === "carouselwithindicator" ||
//         categoryType === "centercarousel" || categoryType === "centercarouselwithindicator") {
//         return (
//             <div className="p-2">
//                 <div className="relative">
//                     <div className="overflow-hidden">
//                         {/* Only showing first item in the carousel for simplicity */}
//                         <div className="w-full">
//                             <img
//                                 src={options[0]?.imagelink || "/api/placeholder/400/200"}
//                                 alt={options[0]?.textview || ""}
//                                 className="w-full h-48 object-cover rounded"
//                                 onError={(e) => {
//                                     e.target.onerror = null;
//                                     e.target.src = "/api/placeholder/400/200";
//                                 }}
//                             />
//                         </div>
//                     </div>
//                     <div className="absolute bottom-2 left-0 right-0 flex justify-center">
//                         {options.map((_, i) => (
//                             <div
//                                 key={i}
//                                 className={`h-1.5 w-1.5 rounded-full mx-1 ${i === 0 ? 'bg-blue-500 w-3' : 'bg-gray-300'}`}
//                             ></div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     // Default horizontal list
//     return (
//         <div className="p-2">
//             <div className="overflow-x-auto">
//                 <div className="flex space-x-4 py-2 px-4">
//                     {options.map((option, index) => (
//                         <div key={index} className="flex flex-col items-center w-16 flex-shrink-0">
//                             <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200">
//                                 <img
//                                     src={option.imagelink || "/api/placeholder/56/56"}
//                                     alt={option.textview}
//                                     className="w-full h-full object-cover"
//                                     onError={(e) => {
//                                         e.target.onerror = null;
//                                         e.target.src = "/api/placeholder/56/56";
//                                     }}
//                                 />
//                             </div>
//                             <div className="text-xs text-center mt-1 w-full truncate">{option.textview}</div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// // ProjectList component
// const ProjectList = ({ projects, viewType }) => {
//     const isCompact = viewType === "compact";

//     // For ViewPager-like display
//     return (
//         <div className="p-2">
//             <div className="relative overflow-hidden pb-4">
//                 {/* Main carousel item */}
//                 <div className="px-4">
//                     {projects.length > 0 && (
//                         <div className="rounded-lg overflow-hidden shadow transform scale-100 transition-transform duration-300">
//                             <div className="relative">
//                                 <img
//                                     src={projects[0].image || "/api/placeholder/400/220"}
//                                     alt={projects[0].name}
//                                     className="w-full h-52 object-cover"
//                                     onError={(e) => {
//                                         e.target.onerror = null;
//                                         e.target.src = "/api/placeholder/400/220";
//                                     }}
//                                 />

//                                 {/* Sliding elements container (top) */}
//                                 <div className="absolute top-2 left-2 right-2 flex justify-between">
//                                     <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
//                                         {projects[0].status.replace(/_/g, ' ')}
//                                     </div>
//                                     <div className="bg-white/80 text-gray-800 text-xs px-2 py-1 rounded">
//                                         2.5 km away
//                                     </div>
//                                 </div>

//                                 {/* Sliding elements container (bottom) */}
//                                 <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
//                                     <div className="text-white font-medium">{projects[0].name}</div>
//                                     <div className="text-white/80 text-xs">{projects[0].location || 'Location not specified'}</div>
//                                     <div className="flex justify-between items-center mt-1">
//                                         <div className="text-white text-xs">
//                                             {projects[0].overview && projects[0].overview.startingPrice > 0
//                                                 ? `₹${(projects[0].overview.startingPrice / 100000).toFixed(1)}L`
//                                                 : 'Price on request'}
//                                         </div>
//                                         <div className="text-white text-xs">
//                                             {projects[0].type}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* Indicators */}
//                 <div className="absolute bottom-0 left-0 right-0 flex justify-center">
//                     {projects.map((_, i) => (
//                         <div
//                             key={i}
//                             className={`h-1.5 w-1.5 rounded-full mx-1 ${i === 0 ? 'bg-blue-500 w-3' : 'bg-gray-300'}`}
//                         ></div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// // BuildingList component
// const BuildingList = ({ buildings, viewType }) => {
//     const isGrid = viewType === "grid";

//     return (
//         <div className="p-2">
//             <div className={isGrid ? "grid grid-cols-2 gap-3" : "space-y-3"}>
//                 {buildings.map((building, index) => (
//                     <div key={index} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
//                         <div className="h-32 bg-gray-200">
//                             <img
//                                 src={building.image || "/api/placeholder/160/128"}
//                                 alt={building.name}
//                                 className="w-full h-full object-cover"
//                                 onError={(e) => {
//                                     e.target.onerror = null;
//                                     e.target.src = "/api/placeholder/160/128";
//                                 }}
//                             />
//                         </div>
//                         <div className="p-2">
//                             <div className="font-medium text-sm truncate">{building.name}</div>
//                             <div className="text-xs flex justify-between mt-1">
//                                 <span className="capitalize">{building.type}</span>
//                                 <span>{building.totalFloors} floors</span>
//                             </div>
//                             {building.connectedProperties > 0 && (
//                                 <div className="text-xs text-blue-600 mt-1">
//                                     {building.connectedProperties} properties
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default AndroidFeedPreview;

import React, { useState, useEffect, useCallback } from 'react';
import { base_url } from '../../../utils/base_url';
import { getAuthConfig } from '../../../utils/authConfig';

const AndroidFeedPreview = () => {
    const [feedData, setFeedData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [coordinates, setCoordinates] = useState({
        latitude: 26.4737067,
        longitude: 80.2857217
    });

    // Filter sections based on content availability
    const filterSections = (sections) => {
        return sections.filter(section => {
            switch (section.sectionType) {
                case "propertyList":
                    return section.properties && section.properties.length > 0;
                case "optionList":
                    return (section.options && section.options.length > 0) ||
                        (section.propertyList && section.propertyList.length > 0) ||
                        (section.projectList && section.projectList.length > 0) ||
                        (section.buildingList && section.buildingList.length > 0);
                case "projectList":
                    return section.projects && section.projects.length > 0;
                case "buildingList":
                    return section.buildings && section.buildings.length > 0;
                default:
                    return true;
            }
        });
    };

    // Mock API call - replace with actual API endpoint
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Simulate API call - replace with your actual endpoint
            const response = await fetch(`${base_url}/api/home-feed?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}` , getAuthConfig());

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            const filteredData = filterSections(data);

            console.log("API data fetched successfully:", filteredData);
            setFeedData(filteredData);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching feed data:", err);

            // Use the sample data provided by user as fallback
            const sampleData = [
                {
                    "sectionType": "propertyList",
                    "headerImage": "https://example.com/shops-banner.jpg",
                    "title": "Shops near you",
                    "subtitle": "Discover local stores in your area",
                    "backgroundColor": "#ffffff",
                    "buttonText": "View All Shops",
                    "buttonLink": "https://example.com/all-shops",
                    "buttonColor": "#ede8fe",
                    "properties": [
                        {
                            "id": "PROP1746532463463",
                            "image": "https://wityysaver.s3.ap-south-1.amazonaws.com/post_images/PROP1746532463463/f86785db-be6b-4dad-b873-cd44495a9356_12.jpg",
                            "title": "3BHK Shops for rent in Gujaini",
                            "subtitle": "123 Green Apartments, Main Road",
                            "price": "₹85",
                            "rating": "4.3",
                            "location": "123 Green Apartments, Main Road",
                            "deliveryTime": "20-25 mins",
                            "tags": ["Parking", "Lift", "Power Backup"],
                            "area": "1250"
                        }
                    ]
                },
                {
                    "sectionType": "optionList",
                    "title": "green1to3bhk",
                    "categoryType": "horizontal_list",
                    "headerImage": "https://wityysaver.s3.ap-south-1.amazonaws.com/1754549432382-1.png",
                    "backgroundColor": "#5CD081",
                    "subtitle": "Browse green1to3bhk",
                    "buttonText": "See All green1to3bhk",
                    "buttonLink": "https://example.com/all-green1to3bhk",
                    "buttonColor": "#FFFFFF",
                    "propertyList": [
                        {
                            "id": "68625eb41b989a5f6400081b",
                            "postId": "PROP1751277235720",
                            "typeName": "Apartment",
                            "title": "3BHK Apartment for buy in Sector 18",
                            "subtitle": "123 Green Apartments, Sector 18, Main Road",
                            "address": "123 Green Apartments, Sector 18, Main Road",
                            "bedrooms": 3,
                            "area": "1850",
                            "price": "₹10000000",
                            "location": "123 Green Apartments, Sector 18, Main Road",
                            "images": [
                                "https://wityysaver.s3.ap-south-1.amazonaws.com/gallery_images/PROP1751277235720/088718d0-b3ba-49c2-ae52-6a107adf1216_3.jpg"
                            ]
                        }
                    ]
                }
            ];

            const filteredSampleData = filterSections(sampleData);
            setFeedData(filteredSampleData);
            setError("Using sample data (API call failed): " + err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRefresh = useCallback(() => {
        fetchData();
    }, [coordinates]);

    return (
        <div className="flex flex-col items-center w-full">
            <div className="flex w-full max-w-md mb-4">
                <label className="flex-1 mr-2">
                    <span className="block text-sm mb-1">Latitude</span>
                    <input
                        type="text"
                        value={coordinates.latitude}
                        onChange={(e) => setCoordinates({ ...coordinates, latitude: e.target.value })}
                        className="w-full p-2 border rounded"
                    />
                </label>
                <label className="flex-1">
                    <span className="block text-sm mb-1">Longitude</span>
                    <input
                        type="text"
                        value={coordinates.longitude}
                        onChange={(e) => setCoordinates({ ...coordinates, longitude: e.target.value })}
                        className="w-full p-2 border rounded"
                    />
                </label>
            </div>

            <button
                onClick={handleRefresh}
                className="mb-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
                Refresh Feed
            </button>

            {/* Android device frame */}
            <div className="relative w-full max-w-md border-8 border-gray-800 rounded-3xl shadow-lg overflow-hidden bg-black" style={{ height: '700px' }}>
                {/* Status bar */}
                <div className="h-6 bg-black text-white flex justify-between items-center px-4 text-xs">
                    <div>11:20</div>
                    <div className="flex items-center space-x-1">
                        <span>📶</span>
                        <span>📡</span>
                        <span>🔋</span>
                    </div>
                </div>

                {/* App UI */}
                <div className="bg-white h-full overflow-hidden flex flex-col">
                    {/* App bar */}
                    {/* <div className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
                        <div className="text-lg font-semibold">Property Feed</div>
                        <div className="flex space-x-3">
                            <span>🔍</span>
                            <span>⋮</span>
                        </div>
                    </div> */}

                    {/* Content area */}
                    <div className="flex-1 overflow-y-auto pb-16">
                        {loading ? (
                            <div className="flex justify-center items-center h-full">
                                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : error ? (
                            <div className="p-4 m-4 bg-red-100 text-red-700 rounded text-sm">
                                {error}
                            </div>
                        ) : (
                            <div className="p-2 space-y-4">
                                {feedData.map((section, index) => (
                                    <HomeFeedSection key={index} section={section} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Bottom navigation */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-white flex justify-around items-center shadow-up border-t border-gray-200">
                        <div className="flex flex-col items-center">
                            <span className="text-blue-500">🏠</span>
                            <span className="text-xs text-blue-500">Home</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-gray-500">🔍</span>
                            <span className="text-xs">Search</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-gray-500">❤️</span>
                            <span className="text-xs">Saved</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-gray-500">👤</span>
                            <span className="text-xs">Profile</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// HomeFeedSection component
const HomeFeedSection = ({ section }) => {
    const getBackgroundStyle = (colorString) => {
        if (colorString && colorString.startsWith("#")) {
            return { backgroundColor: colorString };
        }
        return {};
    };

    const renderSectionContent = () => {
        switch (section.sectionType) {
            case "propertyList":
                return <PropertyList properties={section.properties || []} />;
            case "optionList":
                return <OptionList section={section} />;
            case "projectList":
                return <ProjectList projects={section.projects || []} />;
            case "buildingList":
                return <BuildingList buildings={section.buildings || []} />;
            default:
                return <div className="p-2 text-gray-500 text-sm">Unknown section type: {section.sectionType}</div>;
        }
    };

    return (
        <div className="bg-white rounded-lg overflow-hidden">
            {/* Header Image */}
            {section.headerImage && (
                <div className="w-full">
                    <img
                        src={section.headerImage}
                        alt="Header"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                </div>
            )}

            {/* Title and Subtitle */}
            {/* {section.title && (
                <div className="p-3">
                    <h2 className="text-base font-bold text-gray-900">{section.title}</h2>
                    {section.subtitle && (
                        <p className="text-xs text-gray-600 mt-1">{section.subtitle}</p>
                    )}
                </div>
            )} */}

            {/* Content */}
            <div
                className="w-full overflow-hidden"
                style={getBackgroundStyle(section.backgroundColor)}
            >
                {renderSectionContent()}
            </div>

            {/* Button */}
            {/* {section.buttonText && (
                <div className="p-2 flex justify-end">
                    <button
                        className="px-4 py-2 text-sm rounded text-gray-700 border border-gray-200 hover:bg-gray-50"
                        style={getBackgroundStyle(section.buttonColor)}
                    >
                        {section.buttonText}
                    </button>
                </div>
            )} */}
        </div>
    );
};

// PropertyList component
const PropertyList = ({ properties }) => {
    console.log("properties", properties)
    return (
        <div className="p-2">
            {properties.map((property, index) => (
                <div key={property.id || index} className="mb-3 mx-1">
                    <div className="rounded-lg border border-blue-200 bg-white shadow-sm overflow-hidden">
                        <div className="flex">
                            {/* Left accent bar */}
                            <div className="w-1 bg-blue-500 flex-shrink-0"></div>

                            {/* Main content */}
                            <div className="flex p-3 flex-1">
                                {/* Property image */}
                                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                                    <img
                                        src={property.image}
                                        alt={property.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                                        }}
                                    />
                                </div>

                                {/* Property details */}
                                <div className="ml-3 flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-semibold text-sm text-gray-900 truncate pr-2 flex-1">
                                            {property.title}
                                        </h3>
                                        <button className="flex-shrink-0 text-gray-400 hover:text-red-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="text-xs text-green-600 mb-1">
                                        {property.typeName || 'Apartment'}
                                    </div>

                                    <div className="text-xs text-gray-600 mb-2">
                                        {property.subtitle} • {property.area} sq.ft
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="font-medium text-sm text-blue-600">
                                            {property.price}
                                        </div>
                                        <div className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                                            Ready to move
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// OptionList component - handles different list types
const OptionList = ({ section }) => {
    const categoryType = section.categoryType?.toLowerCase() || 'horizontal_list';

    // Determine which data to use
    let items = [];
    let itemType = 'options';

    if (section.propertyList && section.propertyList.length > 0) {
        items = section.propertyList;
        itemType = 'properties';
    } else if (section.projectList && section.projectList.length > 0) {
        items = section.projectList;
        itemType = 'projects';
    } else if (section.buildingList && section.buildingList.length > 0) {
        items = section.buildingList;
        itemType = 'buildings';
    } else if (section.options && section.options.length > 0) {
        items = section.options;
        itemType = 'options';
    }

    const renderPropertyItem = (property, index) => (
        <div key={property.id || index} className="flex-shrink-0 w-64 mr-3 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-32 bg-gray-200">
                <img
                    src={property.images?.[0] || 'https://via.placeholder.com/256x128?text=No+Image'}
                    alt={property.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/256x128?text=No+Image';
                    }}
                />
            </div>
            <div className="p-3">
                <h4 className="font-semibold text-sm text-gray-900 truncate">{property.title}</h4>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{property.address}</p>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-medium text-blue-600">{property.price}</span>
                    <span className="text-xs text-gray-500">{property.area} sq.ft</span>
                </div>
                <div className="text-xs text-green-600 mt-1">{property.typeName}</div>
            </div>
        </div>
    );

    const renderProjectItem = (project, index) => (
        <div key={project.id || index} className="flex-shrink-0 w-80 mr-3 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-48 bg-gray-200 relative">
                <img
                    src={project.gallery?.[0]?.images?.[0] || 'https://via.placeholder.com/320x192?text=No+Image'}
                    alt={project.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/320x192?text=No+Image';
                    }}
                />
                <div className="absolute top-2 left-2">
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        {project.status?.replace(/_/g, ' ') || 'Active'}
                    </span>
                </div>
            </div>
            <div className="p-3">
                <h4 className="font-semibold text-sm text-gray-900 truncate">{project.name}</h4>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{project.location}</p>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-medium text-blue-600">
                        {project.overview?.priceRange?.min ?
                            `₹${(project.overview.priceRange.min / 100000).toFixed(1)}L` :
                            'Price on request'
                        }
                    </span>
                    <span className="text-xs text-gray-500">{project.type}</span>
                </div>
                {project.builder && (
                    <div className="text-xs text-gray-500 mt-1">by {project.builder.name}</div>
                )}
            </div>
        </div>
    );

    const renderBuildingItem = (building, index) => (
        <div key={building.id || index} className="flex-shrink-0 w-48 mr-3 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-32 bg-gray-200">
                <img
                    src={building.image || 'https://via.placeholder.com/192x128?text=No+Image'}
                    alt={building.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/192x128?text=No+Image';
                    }}
                />
            </div>
            <div className="p-3">
                <h4 className="font-semibold text-sm text-gray-900 truncate">{building.name}</h4>
                <div className="text-xs text-gray-600 mt-1">{building.type}</div>
                <div className="text-xs text-blue-600 mt-1">{building.totalProperties} properties</div>
            </div>
        </div>
    );

    const renderOptionItem = (option, index) => (
        <div key={index} className="flex flex-col items-center w-16 flex-shrink-0 mr-2">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                <img
                    src={option.imagelink}
                    alt={option.textview}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/48x48?text=?';
                    }}
                />
            </div>
            <div className="text-xs text-center mt-1 w-full truncate">{option.textview}</div>
        </div>
    );

    // Render based on category type and item type
    if (categoryType === 'single_item' && items.length > 0) {
        const item = items[0];
        return (
            <div className="p-2">
                <div className="w-full">
                    <img
                        src={itemType === 'options' ? item.imagelink : (item.images?.[0] || item.image)}
                        alt={itemType === 'options' ? item.textview : item.title || item.name}
                        className="w-full h-32 object-cover rounded"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x128?text=No+Image';
                        }}
                    />
                </div>
            </div>
        );
    }

    if (categoryType === 'grid_view') {
        return (
            <div className="p-2">
                <div className="grid grid-cols-2 gap-2">
                    {items.slice(0, 4).map((item, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="h-24 bg-gray-200">
                                <img
                                    src={itemType === 'options' ? item.imagelink : (item.images?.[0] || item.image)}
                                    alt={itemType === 'options' ? item.textview : item.title || item.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/120x96?text=No+Image';
                                    }}
                                />
                            </div>
                            <div className="p-2">
                                <div className="text-xs font-medium truncate">
                                    {itemType === 'options' ? item.textview : item.title || item.name}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Default horizontal list
    return (
        <div className="p-2">
            <div className="overflow-x-auto hide-scrollbar">
                <div className="flex py-2 px-2">
                    {items.map((item, index) => {
                        switch (itemType) {
                            case 'properties':
                                return renderPropertyItem(item, index);
                            case 'projects':
                                return renderProjectItem(item, index);
                            case 'buildings':
                                return renderBuildingItem(item, index);
                            default:
                                return renderOptionItem(item, index);
                        }
                    })}
                </div>
            </div>
        </div>
    );
};

// ProjectList component
const ProjectList = ({ projects }) => {
    return (
        <div className="p-2">
            <div className="space-y-3">
                {projects.map((project, index) => (
                    <div key={project.id || index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="h-48 bg-gray-200 relative">
                            <img
                                src={project.image}
                                alt={project.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/400x192?text=No+Image';
                                }}
                            />
                            <div className="absolute top-2 left-2">
                                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                    {project.status?.replace(/_/g, ' ')}
                                </span>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                                <h3 className="text-white font-semibold">{project.name}</h3>
                                <p className="text-white/80 text-xs">{project.location}</p>
                            </div>
                        </div>
                        <div className="p-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-blue-600">
                                    {project.overview?.startingPrice ?
                                        `₹${(project.overview.startingPrice / 100000).toFixed(1)}L` :
                                        'Price on request'
                                    }
                                </span>
                                <span className="text-xs text-gray-500">{project.type}</span>
                            </div>
                            {project.builder && (
                                <div className="text-xs text-gray-500 mt-1">by {project.builder.name}</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// BuildingList component
const BuildingList = ({ buildings }) => {
    return (
        <div className="p-2">
            <div className="grid grid-cols-2 gap-3">
                {buildings.map((building, index) => (
                    <div key={building.id || index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="h-24 bg-gray-200">
                            <img
                                src={building.image}
                                alt={building.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/160x96?text=No+Image';
                                }}
                            />
                        </div>
                        <div className="p-2">
                            <h4 className="font-medium text-sm truncate">{building.name}</h4>
                            <div className="text-xs text-gray-600 mt-1">
                                <div className="capitalize">{building.type}</div>
                                <div>{building.totalFloors} floors</div>
                                {building.connectedProperties > 0 && (
                                    <div className="text-blue-600">{building.connectedProperties} properties</div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AndroidFeedPreview;