import React, { useState, useEffect, useRef, useCallback } from 'react';

const AndroidFeedPreview = () => {
    const [feedData, setFeedData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [coordinates, setCoordinates] = useState({
        latitude: 26.4737067,
        longitude: 80.2857217
    });

    // Filter sections the same way it's done in the Android adapter
    const filterSections = (sections) => {
        return sections.map(section => {
            // Transform projectsSection and buildingsSection the same way Android does
            if (section.projectsSection) {
                return section.projectsSection;
            } else if (section.buildingsSection) {
                return section.buildingsSection;
            } else {
                return section;
            }
        }).filter(section => {
            // Filter based on content existence
            switch (section.sectionType) {
                case "propertyList":
                    return section.properties && section.properties.length > 0;
                case "optionList":
                    return section.options && section.options.length > 0;
                case "projectList":
                    return section.projects && section.projects.length > 0;
                case "buildingList":
                    return section.buildings && section.buildings.length > 0;
                default:
                    return true;
            }
        });
    };

    // Fetch data from real API
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch data from the real API
            const response = await fetch(`https://propertify.onrender.com/api/home-feed?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}`);

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();

            // Apply the same filtering logic as in the Android adapter
            const filteredData = filterSections(data);

            console.log("API data fetched successfully:", filteredData);
            setFeedData(filteredData);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching feed data:", err);
            setError("Failed to load feed: " + err.message);
            setLoading(false);

            // Fallback to sample data if API fails
            try {
                console.log("Falling back to sample data");
                const fileResponse = await window.fs.readFile('paste.txt', { encoding: 'utf8' });
                const fixedResponse = fileResponse.replace('\"\"\"\"', '\"\"');
                const sampleData = JSON.parse(fixedResponse);

                const filteredSampleData = filterSections(sampleData);
                setFeedData(filteredSampleData);
                setError("Using sample data (API call failed): " + err.message);
            } catch (fallbackErr) {
                console.error("Error loading fallback data:", fallbackErr);
            }
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
                className="mb-4 bg-blue-500 text-white py-2 px-4 rounded"
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
                <div className="bg-gray-100 h-full overflow-hidden flex flex-col">
                    {/* App bar */}
                    <div className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
                        <div className="text-lg font-semibold">Property Feed</div>
                        <div className="flex space-x-3">
                            <span>🔍</span>
                            <span>⋮</span>
                        </div>
                    </div>

                    {/* Content area */}
                    <div className="flex-1 overflow-y-auto pb-16">
                        {loading ? (
                            <div className="flex justify-center items-center h-full">
                                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : error ? (
                            <div className="p-4 m-4 bg-red-100 text-red-700 rounded">
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

// HomeFeedSection component - mimicking the Android adapter's ViewHolder
const HomeFeedSection = ({ section }) => {
    const getBackgroundColor = (colorString) => {
        if (colorString && colorString.startsWith("#")) {
            try {
                return { backgroundColor: colorString };
            } catch (e) {
                return {};
            }
        }
        return {};
    };

    const renderSectionContent = () => {
        console.log("Rendering section type:", section.sectionType);
        switch (section.sectionType) {
            case "propertyList":
                return <PropertyList properties={section.properties || []} />;
            case "optionList":
                return <OptionList options={section.options || []} section={section} />;
            case "projectList":
                return <ProjectList projects={section.projects || []} viewType={section.viewType} />;
            case "buildingList":
                return <BuildingList buildings={section.buildings || []} viewType={section.viewType} />;
            default:
                return <div className="p-2 text-gray-500">Unknown section type: {section.sectionType}</div>;
        }
    };

    // Handle visibility of title/subtitle based on section type
    const showHeader = section.sectionType !== "optionList";

    return (
        <div className="bg-white rounded-lg shadow mb-4 overflow-hidden">
            {/* Header Image */}
            {section.headerImage && section.headerImage !== "" && (
                <div className="w-full">
                    <img
                        src={section.headerImage}
                        alt="Header"
                        className="w-full h-32 object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/api/placeholder/400/150";
                        }}
                    />
                </div>
            )}

            {/* Title and Subtitle */}
            {showHeader && (
                <div className="p-3">
                    <h2 className="text-base font-bold">{section.title}</h2>
                    <p className="text-xs text-gray-600">{section.subtitle}</p>
                </div>
            )}

            {/* Content */}
            <div
                className="w-full overflow-hidden"
                style={getBackgroundColor(section.backgroundColor)}
            >
                {renderSectionContent()}
            </div>

            {/* Button */}
            {section.buttonText && (
                <div className="p-2 flex justify-end">
                    <button
                        className="px-4 py-1 text-sm rounded"
                        style={getBackgroundColor(section.buttonColor || '#f0f0f0')}
                    >
                        {section.buttonText}
                    </button>
                </div>
            )}
        </div>
    );
};

// PropertyList component
const PropertyList = ({ properties }) => {
    return (
        <div className="p-2">
            {properties.map((property, index) => (
                <div
                    key={index}
                    className="mb-2 mx-1 overflow-hidden"
                >
                    {/* MaterialCardView replica */}
                    <div className="rounded-lg overflow-hidden border border-blue-500 bg-white shadow">
                        <div className="flex">
                            {/* Left Accent Bar */}
                            <div className="w-2 bg-blue-500"></div>

                            {/* Main Content Container */}
                            <div className="flex p-2 flex-1 items-center">
                                {/* Property Image Container */}
                                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 shadow">
                                    <img
                                        src={property.image || "/api/placeholder/96/96"}
                                        alt={property.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "/api/placeholder/96/96";
                                        }}
                                    />
                                </div>

                                {/* Property Details */}
                                <div className="ml-3 flex-1">
                                    {/* Property Name and Favorite */}
                                    <div className="flex justify-between items-start">
                                        <div className="font-semibold text-base text-gray-800 truncate pr-2 flex-1">
                                            {property.title}
                                        </div>
                                        <button className="w-5 h-5 flex-shrink-0 text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Property Type */}
                                    <div className="text-xs text-green-700 mt-1">
                                        Apartment
                                    </div>

                                    {/* Property Specs */}
                                    <div className="text-xs text-gray-600 mt-1">
                                        {property.subtitle || "2 BHK"} • {property.area} sq.ft
                                    </div>

                                    {/* Price and Status */}
                                    <div className="flex justify-between items-center mt-1">
                                        <div className="text-sm text-blue-600 font-medium">
                                            {property.price}
                                        </div>
                                        <div className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
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

// OptionList component
const OptionList = ({ options, section }) => {
    const categoryType = section.categoryType?.toLowerCase();

    // Render based on categoryType
    if (categoryType === "single_item" && options.length > 0) {
        return (
            <div className="p-2">
                <div className="w-full">
                    <img
                        src={options[0].imagelink || "/api/placeholder/400/150"}
                        alt={options[0].textview}
                        className="w-full h-32 object-cover rounded"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/api/placeholder/400/150";
                        }}
                    />
                    <div className="text-xs text-center mt-1">{options[0].textview}</div>
                </div>
            </div>
        );
    }

    if (categoryType === "grid_view") {
        return (
            <div className="p-2">
                <div className="grid grid-cols-2 gap-2">
                    {options.map((option, index) => (
                        <div key={index} className="text-center">
                            <div className="h-24 rounded overflow-hidden">
                                <img
                                    src={option.imagelink || "/api/placeholder/120/96"}
                                    alt={option.textview}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/api/placeholder/120/96";
                                    }}
                                />
                            </div>
                            <div className="text-xs truncate mt-1">{option.textview}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (categoryType === "carousal" || categoryType === "carouselwithindicator" ||
        categoryType === "centercarousel" || categoryType === "centercarouselwithindicator") {
        return (
            <div className="p-2">
                <div className="relative">
                    <div className="overflow-hidden">
                        {/* Only showing first item in the carousel for simplicity */}
                        <div className="w-full">
                            <img
                                src={options[0]?.imagelink || "/api/placeholder/400/200"}
                                alt={options[0]?.textview || ""}
                                className="w-full h-48 object-cover rounded"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/api/placeholder/400/200";
                                }}
                            />
                        </div>
                    </div>
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                        {options.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 w-1.5 rounded-full mx-1 ${i === 0 ? 'bg-blue-500 w-3' : 'bg-gray-300'}`}
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Default horizontal list
    return (
        <div className="p-2">
            <div className="overflow-x-auto">
                <div className="flex space-x-4 py-2 px-4">
                    {options.map((option, index) => (
                        <div key={index} className="flex flex-col items-center w-16 flex-shrink-0">
                            <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200">
                                <img
                                    src={option.imagelink || "/api/placeholder/56/56"}
                                    alt={option.textview}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/api/placeholder/56/56";
                                    }}
                                />
                            </div>
                            <div className="text-xs text-center mt-1 w-full truncate">{option.textview}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ProjectList component
const ProjectList = ({ projects, viewType }) => {
    const isCompact = viewType === "compact";

    // For ViewPager-like display
    return (
        <div className="p-2">
            <div className="relative overflow-hidden pb-4">
                {/* Main carousel item */}
                <div className="px-4">
                    {projects.length > 0 && (
                        <div className="rounded-lg overflow-hidden shadow transform scale-100 transition-transform duration-300">
                            <div className="relative">
                                <img
                                    src={projects[0].image || "/api/placeholder/400/220"}
                                    alt={projects[0].name}
                                    className="w-full h-52 object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/api/placeholder/400/220";
                                    }}
                                />

                                {/* Sliding elements container (top) */}
                                <div className="absolute top-2 left-2 right-2 flex justify-between">
                                    <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                        {projects[0].status.replace(/_/g, ' ')}
                                    </div>
                                    <div className="bg-white/80 text-gray-800 text-xs px-2 py-1 rounded">
                                        2.5 km away
                                    </div>
                                </div>

                                {/* Sliding elements container (bottom) */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                                    <div className="text-white font-medium">{projects[0].name}</div>
                                    <div className="text-white/80 text-xs">{projects[0].location || 'Location not specified'}</div>
                                    <div className="flex justify-between items-center mt-1">
                                        <div className="text-white text-xs">
                                            {projects[0].overview && projects[0].overview.startingPrice > 0
                                                ? `₹${(projects[0].overview.startingPrice / 100000).toFixed(1)}L`
                                                : 'Price on request'}
                                        </div>
                                        <div className="text-white text-xs">
                                            {projects[0].type}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Indicators */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                    {projects.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 w-1.5 rounded-full mx-1 ${i === 0 ? 'bg-blue-500 w-3' : 'bg-gray-300'}`}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// BuildingList component
const BuildingList = ({ buildings, viewType }) => {
    const isGrid = viewType === "grid";

    return (
        <div className="p-2">
            <div className={isGrid ? "grid grid-cols-2 gap-3" : "space-y-3"}>
                {buildings.map((building, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                        <div className="h-32 bg-gray-200">
                            <img
                                src={building.image || "/api/placeholder/160/128"}
                                alt={building.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/api/placeholder/160/128";
                                }}
                            />
                        </div>
                        <div className="p-2">
                            <div className="font-medium text-sm truncate">{building.name}</div>
                            <div className="text-xs flex justify-between mt-1">
                                <span className="capitalize">{building.type}</span>
                                <span>{building.totalFloors} floors</span>
                            </div>
                            {building.connectedProperties > 0 && (
                                <div className="text-xs text-blue-600 mt-1">
                                    {building.connectedProperties} properties
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AndroidFeedPreview;