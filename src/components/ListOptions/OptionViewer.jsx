import React from 'react';

const OptionViewer = ({ option }) => {
    // Check if the option has referenced data
    const hasProperties = option.properties && option.properties.length > 0;
    const hasProjects = option.projects && option.projects.length > 0;
    const hasBuildings = option.buildings && option.buildings.length > 0;

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            {/* Option header */}
            <div className="flex items-center gap-4 mb-4">
                <img
                    src={option.imagelink}
                    alt={option.textview}
                    className="w-20 h-20 object-cover rounded-md"
                />
                <div>
                    <h2 className="text-xl font-semibold">{option.textview}</h2>
                    <a
                        href={option.link}
                        className="text-blue-500 hover:underline text-sm"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        View Details
                    </a>
                </div>
            </div>

            {/* Referenced content sections */}
            {(hasProperties || hasProjects || hasBuildings) && (
                <div className="border-t pt-4 mt-2">
                    <h3 className="text-lg font-medium mb-3">Linked Content</h3>

                    {/* Properties section */}
                    {hasProperties && (
                        <div className="mb-4">
                            <h4 className="text-md font-medium text-blue-700 mb-2">Properties</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {option.properties.map(property => (
                                    <div key={property.id} className="border rounded-md p-3 flex gap-3">
                                        <img
                                            src={property.image}
                                            alt={property.title}
                                            className="w-16 h-16 object-cover rounded-md"
                                        />
                                        <div>
                                            <h5 className="font-medium">{property.title}</h5>
                                            <p className="text-sm text-gray-600">{property.location}</p>
                                            <p className="text-sm font-medium">{property.price} • {property.area}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Projects section */}
                    {hasProjects && (
                        <div className="mb-4">
                            <h4 className="text-md font-medium text-green-700 mb-2">Projects</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {option.projects.map(project => (
                                    <div key={project.id} className="border rounded-md p-3 flex gap-3">
                                        <img
                                            src={project.image}
                                            alt={project.name}
                                            className="w-16 h-16 object-cover rounded-md"
                                        />
                                        <div>
                                            <h5 className="font-medium">{project.name}</h5>
                                            <p className="text-sm text-gray-600">{project.location}</p>
                                            <p className="text-sm">
                                                <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${project.status === 'Under Construction'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : project.status === 'Ready to Move'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {project.status}
                                                </span>
                                            </p>
                                            <p className="text-sm font-medium mt-1">
                                                Starting from ₹{project.overview.startingPrice.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Buildings section */}
                    {hasBuildings && (
                        <div>
                            <h4 className="text-md font-medium text-purple-700 mb-2">Buildings</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {option.buildings.map(building => (
                                    <div key={building.id} className="border rounded-md p-3 flex gap-3">
                                        <img
                                            src={building.image}
                                            alt={building.name}
                                            className="w-16 h-16 object-cover rounded-md"
                                        />
                                        <div>
                                            <h5 className="font-medium">{building.name}</h5>
                                            <p className="text-sm text-gray-600">{building.address}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default OptionViewer;